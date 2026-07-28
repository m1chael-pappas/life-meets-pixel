/* eslint-disable no-console */
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

import { escapeHtml, sendMessage } from "@/lib/telegram";

// Clerk webhook receiver: pings Telegram when somebody signs up or when a
// membership starts, churns or goes past due. Without this the site is silent
// about users, since Clerk holds all of that and nothing else polls it.
//
// Setup (once, per Clerk instance):
//   1. Clerk dashboard > Webhooks > Add Endpoint
//        https://lifemeetspixel.com/api/clerk
//   2. Subscribe to: user.created, user.deleted, subscriptionItem.active,
//      subscriptionItem.canceled, subscriptionItem.pastDue,
//      subscriptionItem.freeTrialEnding
//   3. Copy the signing secret into CLERK_WEBHOOK_SIGNING_SECRET.
//
// verifyWebhook() reads that env var itself and throws on a bad signature, so
// an unsigned POST to this route can never reach the Telegram calls below.

const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

type EmailAddress = { id: string; email_address: string };

function pickEmail(data: {
  primary_email_address_id?: string | null;
  email_addresses?: EmailAddress[];
}): string {
  const list = data.email_addresses ?? [];
  const primary = list.find((e) => e.id === data.primary_email_address_id);
  return primary?.email_address || list[0]?.email_address || "no email on file";
}

function pickName(data: {
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
}): string {
  const full = [data.first_name, data.last_name].filter(Boolean).join(" ").trim();
  return full || data.username || "no name set";
}

// "$4.99 / month" from the money object + period, tolerating either being absent
// on trial or comped items.
function formatPrice(
  amount?: { amount_formatted?: string; currency?: string },
  period?: "month" | "annual"
): string {
  if (!amount?.amount_formatted) return "amount unknown";
  const money = `${amount.amount_formatted}${amount.currency ? ` ${amount.currency.toUpperCase()}` : ""}`;
  return period ? `${money} / ${period === "annual" ? "year" : "month"}` : money;
}

export async function POST(request: NextRequest) {
  if (!SIGNING_SECRET) {
    // Nothing configured: behave as if the route does not exist rather than
    // advertising an unverified endpoint.
    return new NextResponse("Not found", { status: 404 });
  }

  let evt;
  try {
    evt = await verifyWebhook(request);
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    switch (evt.type) {
      case "user.created": {
        const provider = evt.data.external_accounts?.[0]?.provider;
        await sendMessage(
          `🎉 <b>New sign-up</b>\n\n` +
            `Name: ${escapeHtml(pickName(evt.data))}\n` +
            `Email: ${escapeHtml(pickEmail(evt.data))}\n` +
            `Via: ${escapeHtml(provider ? provider.replace(/^oauth_/, "") : "email")}\n\n` +
            `<code>${escapeHtml(evt.data.id)}</code>`,
          { disablePreview: true }
        );
        break;
      }

      case "user.deleted": {
        await sendMessage(
          `👋 <b>Account deleted</b>\n\n<code>${escapeHtml(evt.data.id ?? "unknown")}</code>`,
          { disablePreview: true }
        );
        break;
      }

      case "subscriptionItem.active": {
        const { plan, plan_period: period, amount, payer } = evt.data;
        await sendMessage(
          `💰 <b>Membership started: ${escapeHtml(plan?.name || "unknown plan")}</b>\n\n` +
            `Price: ${escapeHtml(formatPrice(amount, period))}\n` +
            `Member: ${escapeHtml(payer?.email || "unknown")}\n\n` +
            `<code>${escapeHtml(payer?.user_id || evt.data.id)}</code>`,
          { disablePreview: true }
        );
        break;
      }

      case "subscriptionItem.canceled": {
        const { plan, payer } = evt.data;
        await sendMessage(
          `📉 <b>Membership cancelled: ${escapeHtml(plan?.name || "unknown plan")}</b>\n\n` +
            `Member: ${escapeHtml(payer?.email || "unknown")}\n` +
            `Access runs to the end of the paid period.`,
          { disablePreview: true }
        );
        break;
      }

      case "subscriptionItem.pastDue": {
        const { plan, payer } = evt.data;
        await sendMessage(
          `⚠️ <b>Payment past due: ${escapeHtml(plan?.name || "unknown plan")}</b>\n\n` +
            `Member: ${escapeHtml(payer?.email || "unknown")}\n` +
            `Clerk will retry; the member keeps access until it gives up.`,
          { disablePreview: true }
        );
        break;
      }

      case "subscriptionItem.freeTrialEnding": {
        const { plan, payer } = evt.data;
        await sendMessage(
          `⏳ <b>Free trial ending: ${escapeHtml(plan?.name || "unknown plan")}</b>\n\n` +
            `Member: ${escapeHtml(payer?.email || "unknown")}`,
          { disablePreview: true }
        );
        break;
      }

      default:
        // Subscribed to something we do not report on yet. Ack it so Clerk
        // does not retry.
        return NextResponse.json({ received: true, ignored: evt.type });
    }

    return NextResponse.json({ received: true, handled: evt.type });
  } catch (err) {
    // Signature was good but delivery failed (Telegram down, bad chat id).
    // Return 500 so Clerk retries with backoff instead of dropping the event.
    console.error(`Clerk webhook ${evt.type} failed to notify:`, err);
    return NextResponse.json(
      { message: "Notification failed", error: String(err) },
      { status: 500 }
    );
  }
}

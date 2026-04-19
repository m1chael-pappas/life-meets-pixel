"use server";

import { Resend } from "resend";

import { SITE_CONFIG } from "@/lib/constants";

type ActionResult = { ok: true } | { ok: false; error: string };

const TOPIC_LABELS: Record<string, string> = {
  "review-request": "Review Request",
  tip: "News Tip",
  collab: "Collab",
  feedback: "Feedback",
  business: "Business",
  other: "Other",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactMessage(formData: FormData): Promise<ActionResult> {
  const name = (formData.get("name") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const topicRaw = (formData.get("topic") ?? "").toString().trim();
  const message = (formData.get("message") ?? "").toString().trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Missing required fields." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please provide a valid email address." };
  }
  if (message.length > 1000) {
    return { ok: false, error: "Message too long (max 1000 characters)." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL || SITE_CONFIG.contact.email;

  if (!apiKey || !fromEmail) {
    // eslint-disable-next-line no-console
    console.error("[contact] RESEND_API_KEY or RESEND_FROM_EMAIL not configured");
    return { ok: false, error: "Email service not configured." };
  }

  const topicLabel = TOPIC_LABELS[topicRaw] ?? "Contact";
  const subject = `[Life Meets Pixel · ${topicLabel}] ${name}`;

  const text = [
    `New contact form submission`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Topic:   ${topicLabel}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  const html = `
    <div style="font-family: ui-monospace, monospace; line-height: 1.6; color: #1a1a1a;">
      <h2 style="color: #ff3d8b; margin: 0 0 12px;">New contact message</h2>
      <table style="border-collapse: collapse; margin-bottom: 16px;">
        <tbody>
          <tr><td style="padding: 4px 12px 4px 0; color: #7a719a;">Name</td><td>${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #7a719a;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #7a719a;">Topic</td><td>${escapeHtml(topicLabel)}</td></tr>
        </tbody>
      </table>
      <div style="padding: 12px 16px; border-left: 3px solid #3ee8ff; background: #f5f5f5; white-space: pre-wrap;">${escapeHtml(message)}</div>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject,
      text,
      html,
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[contact] resend error:", error);
      return { ok: false, error: "Could not send message. Try again later." };
    }
    return { ok: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[contact] unexpected error:", err);
    return { ok: false, error: "Something went wrong. Try again later." };
  }
}

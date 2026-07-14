/* eslint-disable no-console */
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  answerCallbackQuery,
  editMessageText,
  formatCandidateCard,
  getFileUrl,
  isAuthorizedChat,
  parseCallbackData,
  sendMessage,
  StoryCandidateCard,
} from '@/lib/telegram';
import { writeClient } from '@/sanity/write-client';

// Telegram sends this header when the webhook was registered with a secret_token.
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

interface TelegramUpdate {
  callback_query?: {
    id: string;
    data?: string;
    message?: { message_id: number; chat: { id: number } };
  };
  message?: {
    message_id: number;
    chat: { id: number };
    photo?: { file_id: string; width: number }[];
    reply_to_message?: { text?: string };
  };
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-telegram-bot-api-secret-token");
  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ message: "Bad payload" }, { status: 400 });
  }

  // Always answer 200 for handled updates: Telegram retries non-200 responses,
  // which would replay button presses against Sanity.
  try {
    if (update.callback_query) {
      await handleCallback(update.callback_query);
    } else if (update.message?.photo?.length) {
      await handlePhotoReply(update.message);
    }
  } catch (err) {
    console.error("Telegram webhook error:", err);
  }

  return NextResponse.json({ ok: true });
}

async function handleCallback(
  callback: NonNullable<TelegramUpdate["callback_query"]>
) {
  if (!callback.data || !isAuthorizedChat(callback.message?.chat.id)) {
    await answerCallbackQuery(callback.id);
    return;
  }

  const parsed = parseCallbackData(callback.data);
  if (!parsed) {
    await answerCallbackQuery(callback.id);
    return;
  }

  const candidate = await writeClient.fetch<
    (StoryCandidateCard & { status: string }) | null
  >(
    `*[_type == "storyCandidate" && _id == $id][0]{
      _id, headline, summary, sourceUrl, sourceName, alsoCoveredBy, storyType, suggestedAuthor, status
    }`,
    { id: parsed.candidateId }
  );

  if (!candidate) {
    await answerCallbackQuery(callback.id, "Candidate not found in Sanity");
    return;
  }

  switch (parsed.action) {
    case "approve": {
      if (candidate.status !== "proposed") {
        await answerCallbackQuery(callback.id, `Already ${candidate.status}`);
        return;
      }
      await writeClient
        .patch(candidate._id)
        .set({ status: "approved" })
        .commit();
      await answerCallbackQuery(callback.id, "Approved");
      if (callback.message) {
        await editMessageText(
          callback.message.message_id,
          `${formatCandidateCard(candidate)}\n\n✅ <b>Approved.</b> Drafting will pick this up.`
        );
      }
      break;
    }

    case "skip": {
      if (candidate.status !== "proposed") {
        await answerCallbackQuery(callback.id, `Already ${candidate.status}`);
        return;
      }
      await writeClient
        .patch(candidate._id)
        .set({ status: "skipped" })
        .commit();
      await answerCallbackQuery(callback.id, "Skipped");
      if (callback.message) {
        await editMessageText(
          callback.message.message_id,
          `${formatCandidateCard(candidate)}\n\n⏭ <b>Skipped.</b>`
        );
      }
      break;
    }

    // Publish approval buttons arrive with the drafting phase; acknowledge for now.
    case "publish":
    case "edits":
      await answerCallbackQuery(callback.id, "Not wired up yet (phase 4)");
      break;
  }
}

async function handlePhotoReply(
  message: NonNullable<TelegramUpdate["message"]>
) {
  if (!isAuthorizedChat(message.chat.id)) return;

  // Photo replies are matched to a candidate via the #cand:<id> tag in the
  // replied-to message (the candidate card or a "needs image" ping).
  const candidateId = message.reply_to_message?.text?.match(/#cand:(\S+)/)?.[1];
  if (!candidateId) {
    await sendMessage(
      "To attach an image, reply directly to the story's card (I match it via its #cand tag)."
    );
    return;
  }

  const photo = message.photo!.reduce((a, b) => (a.width > b.width ? a : b));
  const fileUrl = await getFileUrl(photo.file_id);
  const imageRes = await fetch(fileUrl);
  if (!imageRes.ok) {
    throw new Error(`Failed to download Telegram photo (${imageRes.status})`);
  }
  const buffer = Buffer.from(await imageRes.arrayBuffer());

  const asset = await writeClient.assets.upload("image", buffer, {
    filename: `${candidateId}-promo.jpg`,
  });

  await writeClient
    .patch(candidateId)
    .set({
      imageNeeded: false,
      promoImage: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();

  await sendMessage(`🖼 Image attached to <code>${candidateId}</code>. Thanks!`);
}

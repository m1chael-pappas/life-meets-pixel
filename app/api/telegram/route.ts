/* eslint-disable no-console */
import { waitUntil } from '@vercel/functions';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { draftFromCandidate } from '@/lib/drafting';
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

// Approvals kick off the drafting agent via waitUntil after the response is
// sent; give the function room for the full research + write run.
export const maxDuration = 300;

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
    (StoryCandidateCard & { status: string; newsPostId?: string }) | null
  >(
    `*[_type == "storyCandidate" && _id == $id][0]{
      _id, headline, summary, sourceUrl, sourceName, alsoCoveredBy, storyType, suggestedAuthor, status, newsPostId
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
      await answerCallbackQuery(callback.id, "Approved, drafting…");
      if (callback.message) {
        await editMessageText(
          callback.message.message_id,
          `${formatCandidateCard(candidate)}\n\n✅ <b>Approved.</b> Drafting now, preview lands here in a few minutes.`
        );
      }
      // Runs after the webhook response is sent; failures report to Telegram
      // from inside draftFromCandidate.
      waitUntil(draftFromCandidate(candidate._id).catch(() => {}));
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

    case "publish": {
      if (candidate.status !== "drafted") {
        await answerCallbackQuery(callback.id, `Cannot publish: status is ${candidate.status}`);
        return;
      }
      if (!candidate.newsPostId) {
        await answerCallbackQuery(callback.id, "No draft linked to this candidate");
        return;
      }
      const slug = await publishDraft(candidate.newsPostId);
      await writeClient
        .patch(candidate._id)
        .set({ status: "published" })
        .commit();
      await answerCallbackQuery(callback.id, "Published!");
      if (callback.message) {
        await editMessageText(
          callback.message.message_id,
          `🌐 <b>Published: ${escapeHtml(candidate.headline)}</b>\n\nhttps://lifemeetspixel.com/news/${slug}\n\n#cand:${candidate._id}`
        );
      }
      break;
    }

    case "edits":
      await answerCallbackQuery(callback.id, "OK, waiting on your edits");
      await sendMessage(
        `✏️ No worries. Edit the draft in Studio, then hit 🚀 Publish on the preview message when it's ready. The publish uses whatever is in the draft at that moment.`
      );
      break;
  }
}

// Promote the draft to a published document. Publishes the draft's CURRENT
// content, so Studio edits made after drafting are included.
async function publishDraft(draftId: string): Promise<string> {
  const draft = await writeClient.getDocument(draftId);
  if (!draft) throw new Error(`Draft ${draftId} not found`);
  const publishedId = draftId.replace(/^drafts\./, "");
  const { _rev, _createdAt, _updatedAt, ...doc } = draft;
  void _rev; void _createdAt; void _updatedAt;
  await writeClient
    .transaction()
    .createOrReplace({ ...doc, _id: publishedId, publishedAt: new Date().toISOString() })
    .delete(draftId)
    .commit();
  return (draft.slug as { current?: string } | undefined)?.current || "";
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

// Server-only helpers for the Life Meets Pixel Telegram approval bot.
// Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the environment.

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export interface StoryCandidateCard {
  _id: string;
  headline: string;
  summary?: string;
  sourceUrl: string;
  sourceName?: string;
  alsoCoveredBy?: string[];
  storyType?: string;
  suggestedAuthor?: string;
}

export type CandidateAction = "approve" | "skip" | "publish" | "edits";

const TYPE_BADGE: Record<string, string> = {
  breaking: "🔴 BREAKING",
  news: "📰 NEWS",
  preview: "🎮 PREVIEW",
  feature: "📖 FEATURE",
};

async function tg<T = unknown>(
  method: string,
  payload: Record<string, unknown>
): Promise<T> {
  if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set");
  }
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram ${method} failed: ${data.description || res.status}`);
  }
  return data.result as T;
}

export function candidateCallbackData(action: CandidateAction, candidateId: string) {
  // Telegram callback_data is capped at 64 bytes; keep the prefix short.
  return `c:${action[0]}:${candidateId}`;
}

export function parseCallbackData(
  data: string
): { action: CandidateAction; candidateId: string } | null {
  const match = data.match(/^c:([aspe]):(.+)$/);
  if (!match) return null;
  const action = (
    { a: "approve", s: "skip", p: "publish", e: "edits" } as const
  )[match[1] as "a" | "s" | "p" | "e"];
  return { action, candidateId: match[2] };
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function formatCandidateCard(candidate: StoryCandidateCard) {
  const badge = TYPE_BADGE[candidate.storyType || "news"] || TYPE_BADGE.news;
  const lines = [
    `${badge}`,
    `<b>${escapeHtml(candidate.headline)}</b>`,
  ];
  if (candidate.summary) lines.push(escapeHtml(candidate.summary));
  lines.push(
    `via ${escapeHtml(candidate.sourceName || "source")}: ${candidate.sourceUrl}`
  );
  if (candidate.alsoCoveredBy?.length) {
    lines.push(`Also covered by: ${escapeHtml(candidate.alsoCoveredBy.join(", "))}`);
  }
  if (candidate.suggestedAuthor && candidate.suggestedAuthor !== "michael") {
    lines.push(`Suggested author: ${escapeHtml(candidate.suggestedAuthor)}`);
  }
  // The #cand tag lets photo replies to this card be matched back to the candidate.
  lines.push(`#cand:${candidate._id}`);
  return lines.join("\n\n");
}

export async function sendCandidateCard(candidate: StoryCandidateCard) {
  if (!CHAT_ID) throw new Error("TELEGRAM_CHAT_ID is not set");
  return tg<{ message_id: number }>("sendMessage", {
    chat_id: CHAT_ID,
    text: formatCandidateCard(candidate),
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Draft it", callback_data: candidateCallbackData("approve", candidate._id) },
          { text: "❌ Skip", callback_data: candidateCallbackData("skip", candidate._id) },
        ],
      ],
    },
  });
}

export async function sendMessage(
  text: string,
  options: { replyMarkup?: unknown; disablePreview?: boolean } = {}
) {
  if (!CHAT_ID) throw new Error("TELEGRAM_CHAT_ID is not set");
  return tg<{ message_id: number }>("sendMessage", {
    chat_id: CHAT_ID,
    text,
    parse_mode: "HTML",
    ...(options.disablePreview ? { link_preview_options: { is_disabled: true } } : {}),
    ...(options.replyMarkup ? { reply_markup: options.replyMarkup } : {}),
  });
}

export async function sendPhoto(photoUrl: string, caption: string) {
  if (!CHAT_ID) throw new Error("TELEGRAM_CHAT_ID is not set");
  // Telegram caps photo captions at 1024 chars.
  return tg<{ message_id: number }>("sendPhoto", {
    chat_id: CHAT_ID,
    photo: photoUrl,
    caption: caption.slice(0, 1024),
    parse_mode: "HTML",
  });
}

export async function editMessageText(
  messageId: number,
  text: string,
  options: { replyMarkup?: unknown } = {}
) {
  if (!CHAT_ID) throw new Error("TELEGRAM_CHAT_ID is not set");
  return tg("editMessageText", {
    chat_id: CHAT_ID,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    reply_markup: options.replyMarkup ?? { inline_keyboard: [] },
  });
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  return tg("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    ...(text ? { text } : {}),
  });
}

export async function getFileUrl(fileId: string) {
  const file = await tg<{ file_path: string }>("getFile", { file_id: fileId });
  return `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
}

export function isAuthorizedChat(chatId: number | string | undefined) {
  return CHAT_ID !== undefined && String(chatId) === String(CHAT_ID);
}

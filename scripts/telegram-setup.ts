#!/usr/bin/env node
/**
 * One-time setup + diagnostics for the Telegram approval bot.
 *
 * Usage:
 *   pnpm telegram:setup -- --updates          # find your chat id (message the bot first)
 *   pnpm telegram:setup -- --set-webhook      # point the bot at NEXT_PUBLIC_SITE_URL/api/telegram
 *   pnpm telegram:setup -- --set-webhook https://preview-url.vercel.app
 *   pnpm telegram:setup -- --info             # show current webhook status
 *   pnpm telegram:setup -- --test             # send a test card with working buttons
 *
 * Needs TELEGRAM_BOT_TOKEN (+ TELEGRAM_WEBHOOK_SECRET for --set-webhook,
 * TELEGRAM_CHAT_ID for --test) in .env.local.
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function tg(method: string, payload: Record<string, unknown> = {}) {
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not set in .env.local');
    process.exit(1);
  }
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.ok) {
    console.error(`Telegram ${method} failed:`, data.description || res.status);
    process.exit(1);
  }
  return data.result;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--updates')) {
    const updates = await tg('getUpdates');
    if (!updates.length) {
      console.log('No updates. Open Telegram, send your bot any message, then rerun.');
      return;
    }
    for (const u of updates) {
      const chat = u.message?.chat;
      if (chat) {
        console.log(`chat id: ${chat.id}  (${chat.first_name || ''} ${chat.username ? '@' + chat.username : ''})`);
      }
    }
    console.log('\nPut the chat id in .env.local as TELEGRAM_CHAT_ID.');
    return;
  }

  if (args.includes('--info')) {
    const info = await tg('getWebhookInfo');
    console.log(JSON.stringify(info, null, 2));
    return;
  }

  const setWebhookIdx = args.indexOf('--set-webhook');
  if (setWebhookIdx !== -1) {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (!secret) {
      console.error('TELEGRAM_WEBHOOK_SECRET is not set. Generate one: openssl rand -hex 24');
      process.exit(1);
    }
    const base = args[setWebhookIdx + 1] || process.env.NEXT_PUBLIC_SITE_URL;
    if (!base) {
      console.error('Pass a base URL or set NEXT_PUBLIC_SITE_URL.');
      process.exit(1);
    }
    const url = `${base.replace(/\/$/, '')}/api/telegram`;
    await tg('setWebhook', {
      url,
      secret_token: secret,
      allowed_updates: ['message', 'callback_query'],
      drop_pending_updates: true,
    });
    console.log(`Webhook set to ${url}`);
    console.log('Remember: TELEGRAM_* env vars must also exist in Vercel (production).');
    return;
  }

  if (args.includes('--test')) {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!chatId) {
      console.error('TELEGRAM_CHAT_ID is not set. Run with --updates to find it.');
      process.exit(1);
    }
    await tg('sendMessage', {
      chat_id: chatId,
      text: '📰 <b>Life Meets Pixel bot test</b>\n\nIf the buttons below update this message, the webhook works.\n\n#cand:candidate-test',
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Draft it', callback_data: 'c:a:candidate-test' },
            { text: '❌ Skip', callback_data: 'c:s:candidate-test' },
          ],
        ],
      },
    });
    console.log('Test card sent. Pressing a button should reply "Candidate not found in Sanity" (expected: no candidate-test doc exists), which proves the webhook round-trip works.');
    return;
  }

  console.log('Usage: pnpm telegram:setup -- [--updates | --set-webhook [url] | --info | --test]');
}

main();

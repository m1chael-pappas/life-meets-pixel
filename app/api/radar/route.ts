/* eslint-disable no-console */
import { randomUUID } from 'crypto';

import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  fetchRecentItems,
  getRadarSources,
  RankedStory,
  rankStories,
} from '@/lib/radar';
import {
  sendCandidateCard,
  sendMessage,
} from '@/lib/telegram';
import { writeClient } from '@/sanity/write-client';

// Fluid compute: feed fetches + the ranking call can take a couple of minutes.
export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  // Vercel cron sends `Authorization: Bearer <CRON_SECRET>`; the query param
  // allows manual runs (curl "…/api/radar?secret=…").
  const authorized =
    CRON_SECRET &&
    (request.headers.get('authorization') === `Bearer ${CRON_SECRET}` ||
      request.nextUrl.searchParams.get('secret') === CRON_SECRET);
  if (!authorized) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    const sources = getRadarSources();
    const results = await Promise.all(sources.map(fetchRecentItems));
    const items = results.flatMap((r) => r.items);
    const health = results.map((r) => r.health);
    const failed = health.filter((h) => !h.ok);

    if (items.length === 0) {
      await sendMessage(
        `📡 <b>Radar ran, nothing fresh.</b> ${sources.length} sources scanned, 0 items in the window.` +
          formatFeedHealth(failed)
      );
      return NextResponse.json({ proposed: 0, itemsScanned: 0, feedsFailed: failed.length });
    }

    // Don't re-propose stories from previous runs (14-day lookback).
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const excludeUrls = await writeClient.fetch<string[]>(
      `*[_type == "storyCandidate" && proposedAt > $since].sourceUrl`,
      { since }
    );
    const fresh = items.filter((item) => !excludeUrls.includes(item.url));

    if (fresh.length === 0) {
      await sendMessage(
        `📡 <b>Radar ran, nothing new.</b> ${items.length} items scanned, all already proposed.` +
          formatFeedHealth(failed)
      );
      return NextResponse.json({ proposed: 0, itemsScanned: items.length, feedsFailed: failed.length });
    }

    const stories = (await rankStories(fresh, excludeUrls)).filter(
      (story) => !excludeUrls.includes(story.sourceUrl)
    );

    let proposed = 0;
    const proposeErrors: string[] = [];
    for (const story of stories) {
      try {
        await proposeCandidate(story);
        proposed++;
      } catch (err) {
        console.error(`Failed to propose "${story.headline}":`, err);
        proposeErrors.push(`"${story.headline}": ${String(err).slice(0, 150)}`);
      }
    }

    await sendMessage(
      `📡 <b>Radar done.</b> ${sources.length} sources · ${items.length} items · ${proposed}/${stories.length} candidates above.` +
        (proposeErrors.length
          ? `\n\n⚠️ ${proposeErrors.length} failed to propose:\n${proposeErrors[0]}`
          : '') +
        formatFeedHealth(failed)
    );

    return NextResponse.json({
      proposed,
      itemsScanned: items.length,
      feedsFailed: failed.length,
    });
  } catch (err) {
    console.error('Radar run failed:', err);
    try {
      await sendMessage(`⚠️ <b>Radar run failed:</b> ${String(err).slice(0, 300)}`);
    } catch {
      // Telegram itself unreachable; nothing more to do.
    }
    return NextResponse.json({ message: 'Radar failed', error: String(err) }, { status: 500 });
  }
}

async function proposeCandidate(story: RankedStory) {
  const candidateId = `candidate-${randomUUID().slice(0, 8)}`;
  await writeClient.createIfNotExists({
    _id: candidateId,
    _type: 'storyCandidate',
    headline: story.headline,
    summary: story.summary,
    sourceUrl: story.sourceUrl,
    sourceName: story.sourceName,
    alsoCoveredBy: story.alsoCoveredBy,
    storyType: story.storyType,
    pillLabel: story.pillLabel,
    suggestedAuthor: story.suggestedAuthor,
    status: 'proposed',
    imageNeeded: false,
    proposedAt: new Date().toISOString(),
  });

  const message = await sendCandidateCard({ _id: candidateId, ...story });
  await writeClient
    .patch(candidateId)
    .set({ telegramMessageId: message.message_id })
    .commit();
}

function formatFeedHealth(failed: { name: string; error?: string }[]) {
  if (failed.length === 0) return '';
  return (
    '\n\n⚠️ Feeds needing attention:\n' +
    failed.map((f) => `· ${f.name}: ${f.error || 'failed'}`).join('\n')
  );
}

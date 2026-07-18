/* eslint-disable no-console */
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  postToSocials,
  processSocialQueue,
  queueForSocials,
} from '@/lib/social';
import { writeClient } from '@/sanity/write-client';

// Copy generation + headless render + Graph API posting.
export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;

// Two modes:
//   ?candidateId=X          → book the candidate into the next free slot
//   ?candidateId=X&mode=now → post immediately (manual retry path)
//   no candidateId          → cron: drain due queued candidates (max 1/run)
export async function GET(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get('secret') ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  if (!CRON_SECRET || secret !== CRON_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const candidateId = request.nextUrl.searchParams.get('candidateId');

  if (!candidateId) {
    try {
      const posted = await processSocialQueue();
      return NextResponse.json({ posted });
    } catch (err) {
      console.error('Social queue processing failed:', err);
      return NextResponse.json(
        { message: 'Queue processing failed', error: String(err) },
        { status: 500 }
      );
    }
  }

  const status = await writeClient.fetch<string | null>(
    `*[_type == "storyCandidate" && _id == $id][0].status`,
    { id: candidateId }
  );
  if (!status) {
    return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });
  }
  // "posted"/"failed"/"queued" allowed so re-runs and re-queues are possible.
  if (!['published', 'posted', 'queued', 'failed'].includes(status)) {
    return NextResponse.json(
      { message: `Candidate status is "${status}", expected published/queued/posted/failed` },
      { status: 409 }
    );
  }

  try {
    if (request.nextUrl.searchParams.get('mode') === 'now') {
      await postToSocials(candidateId);
      return NextResponse.json({ posted: true, candidateId });
    }
    const scheduledAt = await queueForSocials(candidateId);
    return NextResponse.json({ queued: true, candidateId, scheduledAt });
  } catch (err) {
    console.error('Social posting failed:', err);
    return NextResponse.json({ message: 'Social posting failed', error: String(err) }, { status: 500 });
  }
}

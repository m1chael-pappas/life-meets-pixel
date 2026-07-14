/* eslint-disable no-console */
import {
  NextRequest,
  NextResponse,
} from 'next/server';
import { waitUntil } from '@vercel/functions';

import { draftFromCandidate } from '@/lib/drafting';
import { writeClient } from '@/sanity/write-client';

// Drafting runs as two chained invocations (research, then write) because the
// full run can exceed the Hobby-plan 300s ceiling. Each phase fits comfortably.
export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lifemeetspixel.com';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (!CRON_SECRET || secret !== CRON_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const candidateId = request.nextUrl.searchParams.get('candidateId');
  if (!candidateId) {
    return NextResponse.json({ message: 'candidateId required' }, { status: 400 });
  }

  const status = await writeClient.fetch<string | null>(
    `*[_type == "storyCandidate" && _id == $id][0].status`,
    { id: candidateId }
  );
  if (!status) {
    return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });
  }
  // "failed" is allowed so a broken run can be retried manually.
  if (status !== 'approved' && status !== 'failed') {
    return NextResponse.json(
      { message: `Candidate status is "${status}", expected approved/failed` },
      { status: 409 }
    );
  }

  // A retry normally reuses stored research notes; pass fresh=1 to redo the
  // research from scratch instead.
  if (request.nextUrl.searchParams.get('fresh') === '1') {
    await writeClient.patch(candidateId).unset(['researchNotes']).commit();
  }

  try {
    const phase = await draftFromCandidate(candidateId);
    if (phase === 'researched') {
      // Hand the write phase its own 300s window. The request goes out
      // immediately; even if this invocation ends before the response
      // arrives, the write invocation keeps running server-side.
      waitUntil(
        fetch(
          `${SITE_URL}/api/draft?candidateId=${encodeURIComponent(candidateId)}&secret=${CRON_SECRET}`
        ).catch((err) => console.error('Write-phase trigger failed:', err))
      );
      return NextResponse.json({ researched: true, candidateId, next: 'write' });
    }
    return NextResponse.json({ drafted: true, candidateId });
  } catch (err) {
    console.error('Draft failed:', err);
    return NextResponse.json({ message: 'Draft failed', error: String(err) }, { status: 500 });
  }
}

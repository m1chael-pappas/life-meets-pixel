/* eslint-disable no-console */
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { draftFromCandidate } from '@/lib/drafting';
import { writeClient } from '@/sanity/write-client';

// Research + writing can take several minutes end to end. 300s is the
// Hobby-plan ceiling; bump this if the project moves to Pro.
export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;

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

  try {
    await draftFromCandidate(candidateId);
    return NextResponse.json({ drafted: true, candidateId });
  } catch (err) {
    console.error('Draft failed:', err);
    return NextResponse.json({ message: 'Draft failed', error: String(err) }, { status: 500 });
  }
}

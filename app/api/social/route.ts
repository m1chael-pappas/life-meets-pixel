/* eslint-disable no-console */
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { postToSocials } from '@/lib/social';
import { writeClient } from '@/sanity/write-client';

// Copy generation + headless render + Graph API posting.
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
  // "posted" allowed so a re-run is possible (e.g. after fixing Meta creds).
  if (status !== 'published' && status !== 'posted') {
    return NextResponse.json(
      { message: `Candidate status is "${status}", expected published/posted` },
      { status: 409 }
    );
  }

  try {
    await postToSocials(candidateId);
    return NextResponse.json({ posted: true, candidateId });
  } catch (err) {
    console.error('Social posting failed:', err);
    return NextResponse.json({ message: 'Social posting failed', error: String(err) }, { status: 500 });
  }
}

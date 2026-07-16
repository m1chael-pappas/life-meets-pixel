import { NextRequest, NextResponse } from "next/server";

import { commentsEnabled, db, ensureSchema } from "@/lib/comments-db";
import { getMembership } from "@/lib/membership";

// Voting requires sign-in but not a paid membership: reacting is the free
// on-ramp, posting is the perk.
export async function POST(request: NextRequest) {
  if (!commentsEnabled()) {
    return NextResponse.json({ error: "Comments not configured" }, { status: 503 });
  }
  const { userId } = await getMembership();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to vote" }, { status: 401 });
  }

  const { commentId, value } = await request.json().catch(() => ({}));
  if (!Number.isInteger(commentId) || ![1, -1, 0].includes(value)) {
    return NextResponse.json(
      { error: "commentId and value (1, -1 or 0) required" },
      { status: 400 }
    );
  }

  await ensureSchema();
  const sql = db();
  if (value === 0) {
    await sql`DELETE FROM comment_votes WHERE comment_id = ${commentId} AND user_id = ${userId}`;
  } else {
    await sql`
      INSERT INTO comment_votes (comment_id, user_id, value)
      VALUES (${commentId}, ${userId}, ${value})
      ON CONFLICT (comment_id, user_id) DO UPDATE SET value = ${value}
    `;
  }

  const [counts] = (await sql`
    SELECT
      COALESCE(SUM(CASE WHEN value = 1 THEN 1 ELSE 0 END), 0)::int AS likes,
      COALESCE(SUM(CASE WHEN value = -1 THEN 1 ELSE 0 END), 0)::int AS dislikes
    FROM comment_votes WHERE comment_id = ${commentId}
  `) as { likes: number; dislikes: number }[];
  return NextResponse.json({ ...counts, myVote: value === 0 ? null : value });
}

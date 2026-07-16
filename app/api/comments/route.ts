import { NextRequest, NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs/server";

import {
  commentsEnabled,
  db,
  ensureSchema,
  type CommentRow,
} from "@/lib/comments-db";
import { getMembership, MEMBER_FEATURES } from "@/lib/membership";

const MAX_BODY = 2000;

export async function GET(request: NextRequest) {
  if (!commentsEnabled()) {
    return NextResponse.json({ error: "Comments not configured" }, { status: 503 });
  }
  const postId = request.nextUrl.searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }
  // Signed-out readers get null userId — my_vote just comes back null.
  const { userId } = await getMembership();
  await ensureSchema();
  const rows = (await db()`
    SELECT c.id, c.post_id, c.user_id, c.author_name, c.author_image, c.body, c.created_at,
      COALESCE(SUM(CASE WHEN v.value = 1 THEN 1 ELSE 0 END), 0)::int AS likes,
      COALESCE(SUM(CASE WHEN v.value = -1 THEN 1 ELSE 0 END), 0)::int AS dislikes,
      MAX(CASE WHEN v.user_id = ${userId} THEN v.value END)::int AS my_vote
    FROM comments c
    LEFT JOIN comment_votes v ON v.comment_id = c.id
    WHERE c.post_id = ${postId}
    GROUP BY c.id
    ORDER BY c.created_at ASC LIMIT 500
  `) as CommentRow[];
  return NextResponse.json(
    { comments: rows },
    { headers: { "cache-control": "no-store" } }
  );
}

export async function POST(request: NextRequest) {
  if (!commentsEnabled()) {
    return NextResponse.json({ error: "Comments not configured" }, { status: 503 });
  }
  const membership = await getMembership();
  if (!membership.userId) {
    return NextResponse.json({ error: "Sign in to comment" }, { status: 401 });
  }
  if (!membership.hasFeature(MEMBER_FEATURES.comments)) {
    return NextResponse.json(
      { error: "Commenting is a member perk", upgrade: "/membership" },
      { status: 403 }
    );
  }

  const { postId, body } = await request.json().catch(() => ({}));
  const text = typeof body === "string" ? body.trim() : "";
  if (!postId || typeof postId !== "string") {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }
  if (text.length < 2 || text.length > MAX_BODY) {
    return NextResponse.json(
      { error: `Comment must be 2-${MAX_BODY} characters` },
      { status: 400 }
    );
  }

  const user = await currentUser();
  const authorName =
    user?.fullName || user?.username || user?.firstName || "Member";
  const authorImage = user?.imageUrl || null;

  await ensureSchema();
  const [created] = (await db()`
    INSERT INTO comments (post_id, user_id, author_name, author_image, body)
    VALUES (${postId}, ${membership.userId}, ${authorName}, ${authorImage}, ${text})
    RETURNING id, post_id, user_id, author_name, author_image, body, created_at
  `) as CommentRow[];
  return NextResponse.json({ comment: created }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!commentsEnabled()) {
    return NextResponse.json({ error: "Comments not configured" }, { status: 503 });
  }
  const membership = await getMembership();
  if (!membership.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  // Authors can delete their own comments; admins can delete any.
  await ensureSchema();
  const deleted = membership.isAdmin
    ? await db()`DELETE FROM comments WHERE id = ${Number(id)} RETURNING id`
    : await db()`DELETE FROM comments WHERE id = ${Number(id)} AND user_id = ${membership.userId} RETURNING id`;
  if ((deleted as unknown[]).length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

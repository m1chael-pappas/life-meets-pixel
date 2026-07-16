"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import { useAuth, useUser } from "@clerk/nextjs";

const CLERK_ENABLED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

interface Comment {
  id: number;
  user_id: string;
  author_name: string;
  author_image: string | null;
  body: string;
  created_at: string;
  likes: number;
  dislikes: number;
  my_vote: number | null;
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[] | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments);
    }
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="comments lmp-section--tight" aria-label="Comments">
      <div className="section-head">
        <div className="section-head__title">
          <span className="num">▤</span>
          <h2>PLAYER COMMENTS{comments ? ` (${comments.length})` : ""}</h2>
        </div>
      </div>

      {comments === null ? (
        <p className="comments__empty">LOADING...</p>
      ) : comments.length === 0 ? (
        <p className="comments__empty">
          NO COMMENTS YET. INSERT COIN TO START THE CONVERSATION.
        </p>
      ) : CLERK_ENABLED ? (
        <SignedInAwareList comments={comments} onDeleted={load} />
      ) : (
        <CommentList comments={comments} onDeleted={load} />
      )}

      {CLERK_ENABLED ? (
        <CommentComposer postId={postId} onPosted={load} />
      ) : (
        <p className="comments__gate">COMMENTS OPEN SOON.</p>
      )}
    </section>
  );
}

// Calls useUser, so only rendered when Clerk is enabled.
function SignedInAwareList({
  comments,
  onDeleted,
}: {
  comments: Comment[];
  onDeleted: () => void;
}) {
  const { user } = useUser();
  return (
    <CommentList comments={comments} onDeleted={onDeleted} currentUserId={user?.id} />
  );
}

function CommentList({
  comments,
  onDeleted,
  currentUserId,
}: {
  comments: Comment[];
  onDeleted: () => void;
  currentUserId?: string;
}) {
  return (
    <ul className="comments__list">
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          onDeleted={onDeleted}
          mine={currentUserId === c.user_id}
          signedIn={Boolean(currentUserId)}
        />
      ))}
    </ul>
  );
}

function CommentItem({
  comment,
  onDeleted,
  mine,
  signedIn,
}: {
  comment: Comment;
  onDeleted: () => void;
  mine: boolean;
  signedIn: boolean;
}) {
  const [likes, setLikes] = useState(comment.likes ?? 0);
  const [dislikes, setDislikes] = useState(comment.dislikes ?? 0);
  const [myVote, setMyVote] = useState<number | null>(comment.my_vote ?? null);

  const vote = async (v: 1 | -1) => {
    if (!signedIn) {
      window.location.href = "/sign-in";
      return;
    }
    const next = myVote === v ? 0 : v; // clicking your own vote retracts it
    const res = await fetch("/api/comments/vote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ commentId: comment.id, value: next }),
    });
    if (res.ok) {
      const data = await res.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setMyVote(data.myVote);
    }
  };

  const remove = async () => {
    await fetch(`/api/comments?id=${comment.id}`, { method: "DELETE" });
    onDeleted();
  };

  return (
    <li className="comment">
      <div className="comment__head">
        {comment.author_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="comment__avatar"
            src={comment.author_image}
            alt=""
            width={28}
            height={28}
          />
        )}
        <span className="comment__author">{comment.author_name}</span>
        <time className="comment__date" dateTime={comment.created_at}>
          {new Date(comment.created_at).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
        {mine && (
          <button type="button" className="comment__delete" onClick={remove}>
            [DELETE]
          </button>
        )}
      </div>
      <p className="comment__body">{comment.body}</p>
      <div className="comment__votes">
        <button
          type="button"
          className={myVote === 1 ? "is-on" : ""}
          onClick={() => vote(1)}
          aria-label={`Like (${likes})`}
          aria-pressed={myVote === 1}
        >
          ▲ {likes}
        </button>
        <button
          type="button"
          className={myVote === -1 ? "is-on is-down" : "is-down-idle"}
          onClick={() => vote(-1)}
          aria-label={`Dislike (${dislikes})`}
          aria-pressed={myVote === -1}
        >
          ▼ {dislikes}
        </button>
      </div>
    </li>
  );
}

function CommentComposer({
  postId,
  onPosted,
}: {
  postId: string;
  onPosted: () => void;
}) {
  const { isLoaded, isSignedIn, has } = useAuth();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <p className="comments__gate">
        <Link href="/sign-in">SIGN IN</Link> TO JOIN THE DISCUSSION.
      </p>
    );
  }

  if (!has?.({ feature: "comments" })) {
    return (
      <p className="comments__gate">
        COMMENTS ARE A MEMBER PERK.{" "}
        <Link href="/membership">JOIN AS PLAYER 2</Link> TO POST.
      </p>
    );
  }

  const submit = async () => {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ postId, body }),
    });
    setBusy(false);
    if (res.ok) {
      setBody("");
      onPosted();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
    }
  };

  return (
    <div className="comments__composer">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={2000}
        rows={4}
        placeholder="Say something worth reading..."
        aria-label="Write a comment"
      />
      <div className="comments__composer-foot">
        <span className="comments__rules">
          HOUSE RULES: BE DECENT. NO HARASSMENT, NO SLURS, NO SPAM.
        </span>
        <button
          type="button"
          className="retro-btn retro-btn--magenta"
          disabled={busy || body.trim().length < 2}
          onClick={submit}
        >
          {busy ? "POSTING..." : "POST COMMENT"}
        </button>
      </div>
      {error && <p className="comments__error">{error}</p>}
    </div>
  );
}

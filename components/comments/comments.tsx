import dynamic from "next/dynamic";

// Server wrapper: renders nothing until DATABASE_URL exists, and keeps the
// client comment code (and its Clerk import) lazily chunked.
const CommentSection = dynamic(() => import("./comment-section"));

export default function Comments({ postId }: { postId: string }) {
  if (!process.env.DATABASE_URL) return null;
  // Anchor target for the "new comment" Telegram ping, which deep-links to
  // the thread rather than the top of the article.
  return (
    <div id="comments" style={{ scrollMarginTop: "6rem" }}>
      <CommentSection postId={postId} />
    </div>
  );
}

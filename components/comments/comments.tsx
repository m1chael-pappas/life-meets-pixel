import dynamic from "next/dynamic";

// Server wrapper: renders nothing until DATABASE_URL exists, and keeps the
// client comment code (and its Clerk import) lazily chunked.
const CommentSection = dynamic(() => import("./comment-section"));

export default function Comments({ postId }: { postId: string }) {
  if (!process.env.DATABASE_URL) return null;
  return <CommentSection postId={postId} />;
}

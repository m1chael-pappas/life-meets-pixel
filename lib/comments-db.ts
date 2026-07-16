import { neon } from "@neondatabase/serverless";

/**
 * Comments storage (Neon Postgres, member-only posting).
 * Optional like every integration here: without DATABASE_URL the comment
 * section doesn't render and the API returns 503.
 */

export interface CommentRow {
  id: number;
  post_id: string;
  user_id: string;
  author_name: string;
  author_image: string | null;
  body: string;
  created_at: string;
  likes?: number;
  dislikes?: number;
  my_vote?: number | null;
}

export function commentsEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function db() {
  return neon(process.env.DATABASE_URL!);
}

// One schema check per warm function instance — cheap insurance that beats
// maintaining a migration toolchain for a single table.
let schemaReady: Promise<unknown> | null = null;

export function ensureSchema() {
  if (!schemaReady) {
    const sql = db();
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS comments (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        post_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_image TEXT,
        body TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.then(
      () =>
        sql`CREATE INDEX IF NOT EXISTS comments_post_idx ON comments (post_id, created_at)`
    ).then(
      () =>
        sql`CREATE TABLE IF NOT EXISTS comment_votes (
          comment_id BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
          user_id TEXT NOT NULL,
          value SMALLINT NOT NULL CHECK (value IN (-1, 1)),
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (comment_id, user_id)
        )`
    );
    schemaReady.catch(() => {
      schemaReady = null; // allow retry on transient failures
    });
  }
  return schemaReady;
}

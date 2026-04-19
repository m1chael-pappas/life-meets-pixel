# Life Meets Pixel — Claude Context

Public-facing geek-culture review site (games, movies, books, anime, board games, tech). Next.js 15 (App Router) + React 19 + Sanity CMS + Impact.com affiliate integration. Retro-gaming aesthetic — Press Start 2P / JetBrains Mono / VT323 fonts, 4 switchable palettes, scanline overlay, CRT hero frame, HP-bar score breakdown. Deployed on Vercel.

## Read this first

Durable project knowledge lives in the Obsidian vault at `~/Documents/ObsidianVault`. Start here, then follow links:

- [`Projects/life-meets-pixel/overview.md`](/home/michael_pappas/Documents/ObsidianVault/Projects/life-meets-pixel/overview.md) — entry point, links to everything else
- `architecture.md`, `sanity-schema.md`, `affiliate-integration.md`, `decisions.md`, `backlog.md`, `redesign-plan.md` — topic-specific notes

Cross-project conventions:
- [`Conventions/nextjs-patterns.md`](/home/michael_pappas/Documents/ObsidianVault/Conventions/nextjs-patterns.md) — App Router patterns (note: this repo uses webhook-driven `revalidatePath`, not tag-based `revalidateTag`)
- [`Stack/life-meets-pixel-stack.md`](/home/michael_pappas/Documents/ObsidianVault/Stack/life-meets-pixel-stack.md) — versions + env vars

## Write back to the vault

Any decision, convention, performance finding, or gotcha discovered during a session should be documented in the vault before the session ends — not just when asked. Update existing notes before creating new ones.

## Non-negotiable rules

- **All GROQ lives in `lib/queries.ts`.** Don't inline GROQ in components/pages (sitemap + one-off scripts excepted).
- **`components/retro/review-card.tsx` renders all 8 item types.** Don't fork per-type cards — extend `lib/mappings.ts` + `components/retro/sprites.tsx`.
- **`/api/revalidate` is gated on `REVALIDATE_SECRET`.** If you add a new Sanity `_type`, update the `switch` in `app/api/revalidate/route.ts` or edits won't reflect until the 30s cache window lapses.
- **Every affiliate surface links to `/legal/affiliate-disclosure`.** FTC + ACL requirement.
- **Studio (`studio/`) is React 18 + Sanity 3.99.** Frontend is React 19. Don't try to unify.
- **No tag-based `revalidateTag` here.** This site is CMS-driven — Sanity webhook → `revalidatePath`. Don't retrofit tag-based invalidation without a concrete reason.

## Sanity MCP

This repo ships with a `.mcp.json` that registers the Sanity MCP server (`@sanity/mcp-server`). It picks up `SANITY_API_TOKEN` from `.env.local` at session start. Use it for schema introspection, data queries, and content patches without writing one-off scripts.

## Env vars (`.env.local`)

```
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=1ir3sv5r
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=sk_...              # Editor/Admin — seed scripts, delete-alex, MCP

# Site
NEXT_PUBLIC_SITE_URL=https://lifemeetspixel.com
REVALIDATE_SECRET=...                # gates /api/revalidate webhook

# Resend (contact form)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL="Life Meets Pixel <noreply@onthedot.dev>"
CONTACT_TO_EMAIL=michael@lifemeetspixel.com   # optional

# Impact.com (optional — /deals)
IMPACT_ACCOUNT_SID=...
IMPACT_AUTH_TOKEN=...

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-...
```

## Commands

```bash
# Frontend (pnpm — this is a pnpm workspace, not npm)
pnpm dev                # Next dev server
pnpm build
pnpm start
pnpm lint               # Vercel is the only CI gate — run this locally before push

# Sanity Studio
pnpm studio             # http://localhost:3333
pnpm studio:build
pnpm studio:deploy

# Data scripts (needs SANITY_API_TOKEN in .env.local)
pnpm seed:dry-run
pnpm seed
pnpm delete:alex:dry-run
pnpm delete:alex        # add --force to also delete referencing docs
```

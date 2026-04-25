# Life Meets Pixel — Claude Context

Public-facing geek-culture review site (games, movies, books, anime, board games, tech). Next.js 15 (App Router) + React 19 + Sanity CMS + Impact.com affiliate integration. Retro-gaming aesthetic — Press Start 2P / JetBrains Mono / VT323 fonts, 4 switchable palettes, scanline overlay, CRT hero frame, HP-bar score breakdown. Deployed on Vercel.

## Read this first

Durable project knowledge lives in the Obsidian vault at `~/Documents/ObsidianVault`, organised under the wiki schema. Start at the entry-point pages and follow `[[wikilinks]]`:

- [`wiki/entities/life-meets-pixel.md`](/home/michael_pappas/Documents/ObsidianVault/wiki/entities/life-meets-pixel.md): project entry point, links to everything else.
- [`wiki/concepts/life-meets-pixel-architecture.md`](/home/michael_pappas/Documents/ObsidianVault/wiki/concepts/life-meets-pixel-architecture.md), `life-meets-pixel-sanity-schema.md`, `life-meets-pixel-affiliate-integration.md`: topic-specific concepts.
- [`wiki/synthesis/life-meets-pixel-decisions.md`](/home/michael_pappas/Documents/ObsidianVault/wiki/synthesis/life-meets-pixel-decisions.md), `life-meets-pixel-backlog.md`, `life-meets-pixel-redesign-plan.md`: decision log, open work, redesign history.
- [`wiki/entities/life-meets-pixel-stack.md`](/home/michael_pappas/Documents/ObsidianVault/wiki/entities/life-meets-pixel-stack.md): versions + env vars.

Cross-project conventions:
- [`wiki/concepts/nextjs-patterns.md`](/home/michael_pappas/Documents/ObsidianVault/wiki/concepts/nextjs-patterns.md): App Router patterns (note: this repo uses webhook-driven `revalidatePath`, not tag-based `revalidateTag`).

The vault's operating manual is at [`WIKI-SCHEMA.md`](/home/michael_pappas/Documents/ObsidianVault/WIKI-SCHEMA.md). Master catalogue at [`wiki/index.md`](/home/michael_pappas/Documents/ObsidianVault/wiki/index.md).

## Write back to the vault

Any decision, convention, performance finding, or gotcha discovered during a session should be documented in the vault before the session ends, not just when asked. Update existing pages before creating new ones. Always update `wiki/index.md` and append to `wiki/log.md` when you create a page. Tags must come from the canonical taxonomy in `WIKI-SCHEMA.md`.

## Non-negotiable rules

- **All GROQ lives in `lib/queries.ts`.** Don't inline GROQ in components/pages (sitemap + one-off scripts excepted).
- **`components/retro/review-card.tsx` renders all 8 item types.** Don't fork per-type cards — extend `lib/mappings.ts` + `components/retro/sprites.tsx`.
- **`/api/revalidate` is gated on `REVALIDATE_SECRET`.** If you add a new Sanity `_type`, update the `switch` in `app/api/revalidate/route.ts` or edits won't reflect until the 30s cache window lapses.
- **Every affiliate surface links to `/legal/affiliate-disclosure`.** FTC + ACL requirement.
- **Studio (`studio/`) is React 18 + Sanity 3.99.** Frontend is React 19. Don't try to unify.
- **No tag-based `revalidateTag` here.** This site is CMS-driven — Sanity webhook → `revalidatePath`. Don't retrofit tag-based invalidation without a concrete reason.

## Sanity MCP

Register the hosted Sanity MCP server once per machine (OAuth — no token needed):

```
claude mcp add Sanity -t http https://mcp.sanity.io --scope user
```

After first use it'll prompt an OAuth browser flow. Use the MCP for schema introspection, data queries, and content patches — faster than maintaining one-off scripts in `scripts/`. The `SANITY_API_TOKEN` in `.env.local` is still needed for the local seed/delete scripts, but **not** for the MCP.

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

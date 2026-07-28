# Life Meets Pixel — Claude Context

Public-facing geek-culture review site (games, movies, books, anime, board games, tech). Next.js 15 (App Router) + React 19 + Sanity CMS. Retro-gaming aesthetic — Press Start 2P / JetBrains Mono / VT323 fonts, 4 switchable palettes, scanline overlay, CRT hero frame, HP-bar score breakdown. Deployed on Vercel.

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

## Article media, non-negotiable

**A text-only draft is not a deliverable.** Never hand over a `newsPost` or `review` draft without all three:

1. **Featured image** — real promo art, press-kit still, key art or Steam capsule. Download it and actually *look* at it (`Read` the file) before attaching. Outlet `og:image` tags are sometimes memes or collages.
2. **At least 2 inline body images**, spread through the sections, each with a required `alt` *and* a `caption` crediting the source ("Screenshot via Steam / BioWare", "Still via Sony Pictures").
3. **A `videoEmbed` of the official trailer** under a closing `h2` ("Watch the trailer"), whenever one exists.

**Verify the video's channel before embedding.** `curl -sL "https://www.youtube.com/watch?v=<id>" | grep -oE '"author":"[^"]*"'` and confirm it is the studio/publisher's own account. Fan reuploads and outlet reuploads (IGN, Entertainment Tonight) don't go on the site.

**No AI-generated images, ever.** Real existing art only.

**Never reuse an image across articles**, and **the photo must depict what its section is actually about**. A Spider-Man still under a heading called "The X-Men question" is not acceptable, however well the body text connects them: find Cyclops, a Sentinel, the mutant teaser. Same per carousel slide, four content slides need four distinct on-topic images, not two alternating. Reject anything with another outlet's watermark burned in (io9/Gizmodo badges, IGN bugs). Check `file <img>` for embedded EXIF, press stills often carry a "Photo courtesy of Marvel" description that confirms provenance.

Useful sources: the primary source article's `og:image`; publisher newsrooms (`cdn.marvel.com`, `blog.playstation.com`); Steam official screenshots via `https://store.steampowered.com/api/appdetails?appids=<id>`; Steam art at `https://cdn.cloudflare.steamstatic.com/steam/apps/<id>/library_hero.jpg`.

Upload with `@sanity/client` `assets.upload('image', stream, {filename})`, then patch `featuredImage` / splice the image block into `content`.

## Social copy: keywords, never hashtags

**Never put a hashtag in a caption. Not one, on any platform.** Instagram ranks captions on search keywords now, so a hashtag block does nothing but read as spam. Instead work the searchable terms into natural sentences and front-load the strongest keyword phrase in the first line:

- Bad: `Marvel dropped the slate. #LifeMeetsPixel #Marvel #MCU #ComicCon`
- Good: `The Avengers: Doomsday slate after San Diego Comic-Con 2026 is four Marvel movies in three years.`

Searchable terms worth weaving in: title, studio/publisher, platform, genre, year, event name. This applies to the `igCaption` and `fbMessage` in `lib/social.ts`, and to the social pack in `.claude/commands/draft-news.md` and `draft-review.md`. Keep all four in sync.

The CTA in an Instagram caption is always "link in bio". Never a raw URL (not clickable, and IG demotes it). Facebook links are clickable, so the full URL goes there.

## Social assets

Any carousel or reel is **rendered and sent to Telegram for review** before it counts as done. Don't describe it, don't leave PNGs in a scratchpad. Render the real slides through `/social-template` (the same route the pipeline screenshots) so what Michael approves is what ships, then `sendMediaGroup` to the bot. Posting to Instagram/Facebook still needs his explicit go for that specific item.

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

# Clerk (membership: auth + billing — optional; without keys the site runs
# with membership disabled and no auth UI renders)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...  # gates /api/clerk; without it that route 404s
                                        # Clerk dashboard > Webhooks > Add Endpoint
                                        # https://lifemeetspixel.com/api/clerk
                                        # events: user.created, user.deleted,
                                        # subscriptionItem.active/.canceled/.pastDue/
                                        # .freeTrialEnding  → pings Telegram

# Google AdSense (optional — without these no ad slots render; ad_free members
# never load the AdSense script at all)
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-...
NEXT_PUBLIC_ADSENSE_SLOT=...         # a responsive display unit's slot id

# Comments + member RSS (optional — Neon Postgres; without it those features hide)
DATABASE_URL=postgres://...          # Neon connection string
# Admin access (all member features comped + delete any comment): set the Clerk
# user's PUBLIC metadata to {"role": "admin"} in the Clerk dashboard (per instance)

# Resend (contact form)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL="Life Meets Pixel <noreply@onthedot.dev>"
CONTACT_TO_EMAIL=michael@lifemeetspixel.com   # optional

# Telegram approval bot (content pipeline)
TELEGRAM_BOT_TOKEN=...               # from @BotFather
TELEGRAM_CHAT_ID=...                 # pnpm telegram:setup -- --updates
TELEGRAM_WEBHOOK_SECRET=...          # openssl rand -hex 24; gates /api/telegram

# Radar cron (content pipeline)
CRON_SECRET=...                      # openssl rand -hex 24; gates /api/radar, /api/draft, /api/social
ANTHROPIC_API_KEY=sk-ant-...         # radar ranking + drafting agent + social copy

# Meta / Instagram + Facebook posting (optional — without these, /api/social
# delivers the rendered template + captions to Telegram for manual posting)
META_PAGE_ID=...                     # Facebook Page ID
META_IG_USER_ID=...                  # Instagram business account ID linked to the Page
META_PAGE_ACCESS_TOKEN=...           # long-lived Page token: pages_manage_posts + instagram_content_publish

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

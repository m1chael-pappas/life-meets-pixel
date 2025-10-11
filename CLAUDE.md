# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Life Meets Pixel is a Next.js 15 (App Router) review website for geek culture content (games, movies, books, anime, board games, gadgets). Content is managed via Sanity CMS, with reviews, news posts, and reviewable items stored as structured content.

## Development Commands

```bash
# Frontend (Next.js)
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run linter

# Sanity Studio (CMS)
npm run studio          # Start Sanity Studio dev server (http://localhost:3333)
npm run studio:build    # Build Sanity Studio
npm run studio:deploy   # Deploy Studio to Sanity hosting

# Data Seeding (requires SANITY_API_TOKEN in .env.local)
npm run seed:dry-run    # Preview seed data without writing
npm run seed            # Populate Sanity with sample data
```

## Architecture

### Homepage Structure
The homepage (`app/page.tsx`) is a single-page component that composes reusable section components:

- **Section Components** (`components/sections/`):
  - `hero-section.tsx` - Hero banner with site tagline
  - `featured-section.tsx` - Featured reviews from Sanity CMS
  - `news-section.tsx` - Latest news articles
  - `support-section.tsx` - Support/donation CTA
  - `gear-section.tsx` - Gaming gear recommendations (static content)
  - `reviews-section.tsx` - Latest reviews grid
  - `stats-section.tsx` - Site statistics

Each section is wrapped in React Suspense boundaries with custom loading skeletons for better perceived performance. The header with navigation is embedded directly in the page component.

### Content Types & Type System
All content types are defined in `lib/types.ts`:

- **Review** - Main review entity linking to a ReviewableItem, Author, Categories, and Tags
- **ReviewableItem** - The item being reviewed (game, movie, book, etc.) with type-specific fields
  - `itemType` field determines which fields are relevant (platforms for games, runtime for movies, etc.)
- **NewsPost** - News articles with breaking news flag
- **Author** - Content author with bio and social links
- **SiteStats** - Aggregate statistics about site content

### Sanity Integration
The Sanity Studio CMS is located in the `studio/` directory within the workspace for easier maintenance.

**Frontend Connection:**
- Sanity client is configured in `sanity/client.ts` using environment variables:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID=1ir3sv5r`
  - `NEXT_PUBLIC_SANITY_DATASET=production`
  - `NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01`
- All GROQ queries are centralized in `lib/queries.ts` with a 30-second revalidation period (`fetchOptions`)

**Studio Schema (`studio/schemaTypes/`):**
- `reviewableItem.ts` - Items that can be reviewed (games, movies, books, etc.)
- `review.ts` - Review documents linked to reviewable items
- `newPost.ts` - News articles
- `author.ts` - Content authors
- `category.ts`, `tag.ts`, `genre.ts`, `platform.ts` - Taxonomy types
- `seo.ts` - SEO metadata object

### Review System
Reviews support multiple content types through the `ReviewableItem.itemType` discriminated union:
- videogame, boardgame, movie, tvseries, anime, book, comic, gadget

Each type has specific fields (e.g., platforms for videogames, pageCount for books). The `UniversalReviewCard` component (`components/universal-review-card.tsx`) handles display logic for all types.

### UI Components
Built with shadcn/ui components in `components/ui/`:
- Radix UI primitives
- Tailwind CSS v4 styling
- Custom theme provider with dark mode support (`next-themes`)
- Custom `PixelHeartRating` component for review scores

### Styling
- Tailwind CSS v4 with CSS-first configuration
- `@tailwindcss/typography` for rich text content
- `tw-animate-css` for animations
- Monospace font (`font-mono`) used for headings and branding
- Theme colors use CSS custom properties for light/dark modes

## Key Patterns

1. **Data Fetching**: Server components fetch data directly using Sanity client and GROQ queries
2. **Image Handling**: Sanity image URLs accessed via `asset.url` (using `@sanity/image-url` package)
3. **Navigation**: Type-based filtering via URL params (`/reviews?type=videogame`)
4. **Portable Text**: Review content uses `@portabletext/types` for structured rich text

## Environment Setup

Required environment variables in `.env.local`:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Dataset name (usually "production")
- `NEXT_PUBLIC_SANITY_API_VERSION` - API version (e.g., "2024-01-01")
- `SANITY_API_TOKEN` - API token with Editor/Admin permissions (for seeding scripts only)

## Data Seeding

The `scripts/seed-sanity.ts` script programmatically populates Sanity with sample data. This is useful for:
- Initial setup and development
- Testing with realistic data
- Resetting to a known state

See `scripts/README.md` for detailed usage instructions.

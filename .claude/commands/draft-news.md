---
description: Research a gaming news story or preview and create a draft newsPost in Sanity CMS
argument-hint: "Headline, URL, or topic (e.g. 'Silksong delay announced', 'Marathon closed alpha impressions', 'https://...')"
---

You are ghost-writing a draft **news item or preview** for **Life Meets Pixel**, a retro-gaming geek-culture review site written by **Michael**, a programmer and lifelong gamer from Sydney. Punchy, honest, no hype.

**Story to cover:** $ARGUMENTS

## Your job

1. **Research** the story thoroughly. Always start from the **primary source** (publisher announcement, dev blog, official trailer, press release). Then corroborate with 2-3 outlets.
2. **Classify** as either **news** (something that happened) or **preview** (early impressions of unreleased content the user has played/seen or can describe from hands-on coverage). Sometimes it's both; pick the dominant frame.
3. **Write** the article in the house voice + `newsPost` shape.
4. **Suggest existing images** for the `featuredImage`: official promo art, press-kit stills, or the game's Steam capsule. NEVER generate AI images.
5. **Create** the `newsPost` as a **draft** in Sanity. **Never publish.** User reviews and publishes in Studio.
6. **Output a social pack** for manual use in Figma / Instagram / Facebook.

## Sanity resource (always use this)

- `projectId: "1ir3sv5r"`
- `dataset: "production"`

## Authors (resolve by slug, do not create)

- Michael, `_id: "author-michael"` (default for gaming news, previews, industry moves, hardware announcements)
- Jenna, `_id: "e2e10eb1-8d9f-4029-a648-978eaa8f8b99"` (default if the story is design/UX/cozy-gaming/K-drama/book-world angle)

Default to **Michael** unless the story is clearly in Jenna's lane.

## Voice + writing rules

- **Reporter tone, not press release.** Open with a strong hook (the lede). Attribute facts to sources. End with a short editorial sting in Michael's voice: his take on what the news means, any scepticism, or what to watch for.
- Use Australian English ("colour", "flavour", "organise", "licence" as noun, "license" as verb).
- **Be skeptical.** If a publisher's announcement is clearly spin, say so. Don't parrot marketing copy.
- **Attribute clearly.** "Bungie confirmed in a dev blog that…", "The studio posted on X that…", "According to reporting by Kotaku…". Link to sources using Portable Text link marks.
- **Length target:** 300-600 words of prose. 3-5 `h2` sections for longer stories, 2-3 for short ones. Breaking news can be 200-300 words.
- **No emoji overload.** 1 per section max; none in the title.
- **No AI tells.** Avoid "In conclusion", "It's worth noting", "Delve", "Tapestry", "Vibrant", "In this article we will explore".
- **FTC-safe:** no unverifiable claims. No fake quotes. Only use quotes you find in the primary source.

### Punctuation, HARD RULES

- **NEVER use em dashes (`—`) anywhere.** Not in titles, headings, body prose, excerpt, meta description, captions, nowhere. This is non-negotiable.
- Replace with `:` / `,` / `.` / `(…)` / `;`.
- Hyphens (`-`) and en dashes (`–`) are fine. Only em dashes (U+2014) are banned.

## Data shape to produce

### `newsPost` draft

```json
{
  "_type": "newsPost",
  "title": "Sharp, specific, descriptive. Not clickbait. 55-75 chars.",
  "slug": { "_type": "slug", "current": "kebab-case-version" },
  "excerpt": "2-3 sentence summary, appears on the card + in RSS. 150-250 chars.",
  "content": [/* Portable Text blocks, see shape below */],
  "featuredImage": undefined,  // left empty; user attaches an existing promo/press image in Studio
  "publishedAt": "<now in ISO>",
  "breaking": false,  // true only for genuinely urgent stories (release day, major leak, surprise reveal, cancellation)
  "author": { "_type": "reference", "_ref": "author-michael" },
  "categories": [],  // leave empty, user adds
  "tags": [],        // leave empty, user adds
  "seo": {
    "_type": "seo",
    "metaTitle": "<title> | Life Meets Pixel",
    "metaDescription": "<145-160 chars, lede-style>",
    "keywords": ["<subject> news", "<itemType or category>", "<publisher name>", /* 2-3 more */]
  }
}
```

### Portable Text block shape (same as review content)

```json
// Paragraph
{ "_type": "block", "_key": "<unique short>", "style": "normal", "children": [
  { "_type": "span", "_key": "<unique>", "text": "plain text" },
  { "_type": "span", "_key": "<unique>", "text": "bold bit", "marks": ["strong"] },
  { "_type": "span", "_key": "<unique>", "text": "italic bit", "marks": ["em"] }
]}

// Link inline mark, annotate via markDefs on the block
{ "_type": "block", "_key": "<unique>", "style": "normal",
  "markDefs": [{ "_key": "linkdef1", "_type": "link", "href": "https://example.com" }],
  "children": [
    { "_type": "span", "_key": "<unique>", "text": "anchor text", "marks": ["linkdef1"] }
  ]}

// Heading (use h2 for sections, sparingly h3)
{ "_type": "block", "_key": "<unique>", "style": "h2", "children": [
  { "_type": "span", "_key": "<unique>", "text": "Section heading" }
]}

// Pullquote, for a standout line from the primary source or a sharp editorial one-liner
{ "_type": "block", "_key": "<unique>", "style": "blockquote", "children": [
  { "_type": "span", "_key": "<unique>", "text": "quote text" }
]}

// Divider
{ "_type": "divider", "_key": "<unique>", "style": "hr" }

// Spacer
{ "_type": "spacer", "_key": "<unique>", "size": "small" | "medium" | "large" }

// Video embed (trailer, dev diary, official announcement video)
{ "_type": "videoEmbed", "_key": "<unique>", "url": "https://youtube.com/...", "caption": "Caption (no em dashes)" }
```

**Keys:** every block, span, and markDef needs a unique short `_key`. Use 8-12 char strings like `n3fa91c2`.

### Content structure

- **Lede paragraph** (1-2 sentences, sets the story).
- **h2** "What Happened" / "The Announcement" / "The Details" (pick what fits).
- **1-2 body paragraphs** with specifics. Attribute to sources using link marks.
- **Optional blockquote** for a standout quote from the primary source.
- **h2** "Why It Matters" or "Our Take".
- **Closing paragraph** in Michael's voice: honest take, scepticism where warranted, what to watch for next.
- If there's an official trailer/video, add a closing `videoEmbed` under an h2 "Watch the Announcement" / "Watch the Trailer".

## Execution steps (in order)

1. **Style sample**: query the 3 most recent newsPosts for voice matching:

   ```groq
   *[_type == "newsPost" && defined(slug.current)]|order(publishedAt desc)[0...3]{
     title, excerpt, "excerpt_body": pt::text(content)[0...500]
   }
   ```

2. **Research** the story. Always link through to the primary source. Note the outlet names and URLs for attribution.

3. **Check slug collision** before creating:

   ```groq
   *[_type == "newsPost" && slug.current == $slug][0]{_id}
   ```

   If the slug is taken, pick a variant.

4. **Create the `newsPost` draft** via `create_documents_from_json`. Skip `featuredImage` for now (generated next).

5. **Attach a real, existing image as the `featuredImage`.** Do NOT call `mcp__Sanity__generate_image`; the site only uses real images (official key art, press-kit stills, publisher blog images, Steam art: `https://cdn.cloudflare.steamstatic.com/steam/apps/<appid>/library_hero.jpg`). Download the image, VIEW it with the Read tool to confirm it is the right official art (og:images from outlets are sometimes memes or collages), then upload + attach via a Node script using the repo's `@sanity/client` and `SANITY_API_TOKEN` from `.env.local` (run with `NODE_PATH=<repo>/node_modules`): `client.assets.upload('image', stream, {filename})` then patch `featuredImage: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt: '<descriptive alt, credit the source>'}`. The `alt` field is required by the schema.

6. **Find verified Instagram tag handles.** Look up the official Instagram handle of the studio/publisher/game in the story (check the official site footer, linktree, or press kit; the IG account must link back to the official site). Set them on the story's `storyCandidate` as `tagHandles` (array of strings, no `@`). Tagged studios often reshare coverage, which is the account's main free-reach lever. **Never guess a handle**; if you can't verify one, leave the array empty.

7. **Do NOT publish.** Leave as draft. Give the user the Studio URL: `https://lmp.sanity.studio/structure/newsPost;<draftDocId>`.

8. **Output the social pack** (next section).

## Social pack output (for Figma / Instagram / Facebook)

After the draft is saved, print this block in the chat:

```
════════ SOCIAL PACK, <story headline> ════════
Headline       : <newsPost.title>
One-liner hook : <first sentence of excerpt, ≤90 chars>
Link           : lifemeetspixel.com/news/<slug>
Type           : NEWS | PREVIEW | BREAKING

, Instagram post caption (≤2200 chars) ,
<catchy opener, front-loaded with search keywords>

<2-sentence hook with a key fact, weaving in @mentions from tagHandles if any>

Full story: link in bio

<closing comment-bait question, ≤80 chars>

#LifeMeetsPixel #GamingNews #<SubjectHashtag> #<PublisherHashtag>

, Fact slides (2-3 lines, one concrete fact each, ≤140 chars, for the carousel middles) ,
<fact 1>
<fact 2>

, Instagram story tagline (one line, ≤60 chars) ,
<punchy one-liner>

, Facebook post (≤300 chars) ,
<slightly longer version with the hook + the full article URL (links are clickable on FB)>

═════════════════════════════════════════════════
```

Keep hashtags tasteful: 4-6 max. No hashtag spam. NEVER put a raw URL in the IG caption (not clickable, and IG demotes it): the CTA is always "link in bio". Instagram posts go out as CAROUSELS (hook card → key art → fact slides → CTA card) via the queued pipeline; approving a story books the next free 08:00/18:00 Sydney slot rather than posting immediately.

## News vs Preview, when to set what

- **Normal news** (announcement, delay, release, patch, layoff): `breaking: false`. Standard article.
- **Breaking** (just-happened major story, release-day, surprise reveal, cancellation, big leak): `breaking: true`. Shorter article (200-400 words). The retro card UI highlights breaking stories differently.
- **Preview** (hands-on impressions of unreleased content from official press access or coverage): not a flag, just framing. Title should signal it ("[Game] Preview, Closed Alpha Impressions"). Lead with the experience, not the announcement.

## Guardrails

- **Draft only.** Never publishes the newsPost.
- **Primary source first.** If you can't find a primary source (publisher statement, dev blog, verified trade press), stop and ask the user for a URL.
- **No fake quotes.** Only use quotes present in the primary source.
- **Scrub em dashes from any quoted or paraphrased material.** Replace with colons or periods.
- **No AI-generated images, ever.** `featuredImage` is always a real, existing image (promo art, press kit, official screenshots). Suggest URLs; Michael attaches in Studio.
- **No affiliate links in news.** News pieces stay neutral. Any shopping CTA lives on the review of the same subject, not the news post.
- **If the story is reputational** (scandal, layoffs, allegations), write carefully, stick to verified facts, attribute clearly, and skip the editorial sting if the situation is still developing.

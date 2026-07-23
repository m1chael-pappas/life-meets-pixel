// Server-only radar pipeline: fetch RSS sources, then have Claude dedupe,
// classify, and rank a shortlist of storyCandidates. Used by /api/radar.

import Anthropic from '@anthropic-ai/sdk';
import Parser from 'rss-parser';

import sourcesConfig from './news-radar-sources.json';

export interface RadarSource {
  name: string;
  url: string;
  focus?: string;
}

export interface FeedItem {
  title: string;
  url: string;
  publishedAt: string;
  summary: string;
  sourceName: string;
}

export interface FeedHealth {
  name: string;
  ok: boolean;
  items: number;
  error?: string;
}

export interface RankedStory {
  headline: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  alsoCoveredBy: string[];
  storyType: 'breaking' | 'news' | 'preview' | 'feature';
  pillLabel: string;
  suggestedAuthor: 'michael' | 'jenna';
}

const WINDOW_HOURS = 48;
const MAX_ITEMS_PER_FEED = 8;
// Bumped from 8 when the anime/manga feeds were added: the source pool roughly
// doubled, and 8 slots meant a busy anime day squeezed out gaming entirely.
const MAX_STORIES = 10;

export function getRadarSources(): RadarSource[] {
  // NB: sourcesConfig._upcoming is deliberately excluded. It holds HTML release
  // calendars for /preview-radar, not RSS feeds, and rss-parser chokes on them.
  const groups: unknown[] = [
    sourcesConfig.press,
    sourcesConfig.anime,
    sourcesConfig.publishers,
    sourcesConfig.youtube,
  ];
  return groups
    .flat()
    .filter(
      (s): s is RadarSource =>
        typeof s === 'object' && s !== null && typeof (s as RadarSource).url === 'string'
    );
}

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'LifeMeetsPixel-Radar/1.0 (+https://lifemeetspixel.com)' },
});

export async function fetchRecentItems(
  source: RadarSource
): Promise<{ items: FeedItem[]; health: FeedHealth }> {
  try {
    const feed = await parser.parseURL(source.url);
    const cutoff = Date.now() - WINDOW_HOURS * 60 * 60 * 1000;
    const items = (feed.items || [])
      .map((item) => ({
        title: item.title?.trim() || '',
        url: item.link || '',
        publishedAt: item.isoDate || item.pubDate || '',
        summary: (item.contentSnippet || item.summary || '').slice(0, 400),
        sourceName: source.name,
      }))
      .filter((item) => {
        if (!item.title || !item.url) return false;
        const ts = Date.parse(item.publishedAt);
        return !Number.isNaN(ts) && ts >= cutoff;
      })
      .slice(0, MAX_ITEMS_PER_FEED);
    return { items, health: { name: source.name, ok: true, items: items.length } };
  } catch (err) {
    return {
      items: [],
      health: { name: source.name, ok: false, items: 0, error: String(err).slice(0, 120) },
    };
  }
}

const RANKING_SCHEMA = {
  type: 'object',
  properties: {
    stories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          headline: { type: 'string', description: 'Sharp, specific, as it would appear on the site. No em dashes.' },
          summary: { type: 'string', description: '1-2 sentences, punchy and lightly skeptical. No em dashes.' },
          sourceUrl: { type: 'string', description: 'URL of the item with the richest coverage of this story' },
          sourceName: { type: 'string' },
          alsoCoveredBy: { type: 'array', items: { type: 'string' }, description: 'Other outlets covering the same story' },
          storyType: { type: 'string', enum: ['breaking', 'news', 'preview', 'feature'] },
          pillLabel: {
            type: 'string',
            description: 'Category pill for the social template, e.g. "Gaming News", "Anime News", "Movie News", "Tech News"',
          },
          suggestedAuthor: { type: 'string', enum: ['michael', 'jenna'] },
        },
        required: [
          'headline', 'summary', 'sourceUrl', 'sourceName',
          'alsoCoveredBy', 'storyType', 'pillLabel', 'suggestedAuthor',
        ],
        additionalProperties: false,
      },
    },
  },
  required: ['stories'],
  additionalProperties: false,
} as const;

const RANKING_SYSTEM = `You are the news radar for Life Meets Pixel, a geek-culture review site covering games, movies, books, anime, manga, board games, and tech (indie-leaning, PC-forward, Australian). You receive raw RSS items from the last ${WINDOW_HOURS} hours and produce a ranked shortlist of story candidates.

Rules:
- Deduplicate: when multiple outlets cover the same story, output ONE entry. Pick the outlet with the richest coverage as sourceUrl/sourceName and list the rest in alsoCoveredBy. Anime feeds overlap heavily: Anime News Network, MyAnimeList, and LiveChart routinely run the same adaptation announcement within an hour of each other. Collapse those aggressively.
- Classify: breaking (release day, surprise reveal, cancellation, major leak, layoffs, acquisition, <12h old), news (announcement, update, patch, roadmap), preview (hands-on, playtest, closed alpha), feature (long-form, interview, op-ed; lowest priority).
- Rank by recency, uniqueness, and fit for the site's angle. Breaking first, previews next, news, then features.
- Aim for a mixed slate. Do not return eight gaming stories when the anime feeds carried something good: if strong anime or manga candidates exist, give them roughly a third of the slots. Conversely, do not force anime in when the day's anime signal is genuinely weak.
- Anime and manga specifics. Include: new anime adaptations of manga or light novels, premiere and air dates, season and cour announcements, studio and key staff reveals, key visuals and trailers, English licensing and simulcast news, notable manga launches and finales, delays and cancellations. Exclude: episode-by-episode recaps, weekly ranking churn, merchandise and figure drops, seasonal poll results, and voice-actor social media drama.
- Exclude: deals/sales roundups, top-10 listicles, esports match results (unless a championship final), mobile gacha outrage cycles, other outlets' reviews, opinion pieces without a new argument.
- Respect embargoes: if a summary mentions a future embargo time, drop the story.
- Skip any story whose URL appears in the excludeUrls list: those were already proposed on previous runs.
- suggestedAuthor: michael (default: PC gaming, strategy, RPG, platform moves, tech, industry, shonen and seinen anime, action and mecha) or jenna (cozy, design-forward, UX, K-content, books, party games, slice-of-life and josei anime, manga craft and art-book angles).
- pillLabel for anime and manga items: "Anime News" for anime, "Manga News" for manga-only stories.
- Output at most ${MAX_STORIES} stories. Fewer is fine when signal is low. Do not pad.
- NEVER use em dashes (the U+2014 character) anywhere in your output. Use colons, commas, or periods.`;

export async function rankStories(
  items: FeedItem[],
  excludeUrls: string[]
): Promise<RankedStory[]> {
  const client = new Anthropic();
  const response = await client.messages.create({
    // Sonnet, not Opus: ranking/dedupe is classification work, and this runs
    // daily whether or not anything gets drafted — Opus here was the single
    // biggest fixed cost in the pipeline (2026-07-16 cost review).
    model: 'claude-sonnet-5',
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system: RANKING_SYSTEM,
    output_config: { format: { type: 'json_schema', schema: RANKING_SCHEMA } },
    messages: [
      {
        role: 'user',
        content: JSON.stringify({ items, excludeUrls }),
      },
    ],
  });

  if (response.stop_reason === 'max_tokens') {
    throw new Error('Radar ranking truncated: raise max_tokens');
  }
  const text = response.content.find((block) => block.type === 'text');
  if (!text) {
    throw new Error(`Radar ranking returned no text (stop_reason: ${response.stop_reason})`);
  }
  const parsed = JSON.parse(text.text) as { stories: RankedStory[] };
  return parsed.stories.slice(0, MAX_STORIES);
}

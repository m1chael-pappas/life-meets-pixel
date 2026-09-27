// Server-only Meta Graph API helpers: publish a photo to the Instagram
// business account and the Facebook Page. Requires META_IG_USER_ID,
// META_PAGE_ID, and META_PAGE_ACCESS_TOKEN (long-lived Page token from an
// app with pages_manage_posts + instagram_content_publish).

const GRAPH = 'https://graph.facebook.com/v21.0';

const IG_USER_ID = process.env.META_IG_USER_ID;
const PAGE_ID = process.env.META_PAGE_ID;
const ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;

export function metaConfigured() {
  return Boolean(IG_USER_ID && PAGE_ID && ACCESS_TOKEN);
}

export type SocialPlatform = 'instagram' | 'facebook';

const HASHTAG = /(?:^|[^\p{L}\p{N}_&#])#[\p{L}\p{N}_]*\p{L}[\p{L}\p{N}_]*/u;
const EM_DASH = /\u2014/;
const RAW_URL = /https?:\/\/|\bwww\.|\b[\w-]+\.(?:com|net|org|au|io|gg|tv|co)\/\S/i;
const SITE_LINK = /\b(?:https?:\/\/)?(?:www\.)?lifemeetspixel\.com\/\S+/;
/** Instagram Graph API caption limit. */
const IG_CAPTION_MAX = 2200;

/**
 * Every house-rule violation in a caption (CLAUDE.md "Social copy"), as
 * readable reasons; empty when the copy is clean. Both platforms: no hashtag,
 * no em dash. Instagram: no raw URL, a "link in bio" CTA, at most 2200
 * characters. Facebook: a lifemeetspixel.com article link (Facebook makes it clickable).
 */
export function captionViolations(text: string, platform: SocialPlatform): string[] {
  const problems: string[] = [];
  const hashtag = text.match(HASHTAG);
  if (hashtag) problems.push(`has a hashtag (${hashtag[0].trim()})`);
  if (EM_DASH.test(text)) problems.push('has an em dash');
  if (platform === 'instagram') {
    if (RAW_URL.test(text)) problems.push('has a raw URL, which Instagram will not link; use "link in bio"');
    if (!/link in bio/i.test(text)) problems.push('is missing the "link in bio" call to action');
    if (text.length > IG_CAPTION_MAX) problems.push(`is ${text.length} characters, over Instagram's ${IG_CAPTION_MAX}`);
  } else if (!SITE_LINK.test(text)) {
    problems.push('is missing the lifemeetspixel.com article link');
  }
  return problems;
}

/** Throws, naming every violation, when `text` breaks a house rule for `platform`. */
export function assertCaptionRules(text: string, platform: SocialPlatform): void {
  const problems = captionViolations(text, platform);
  if (problems.length > 0) {
    const label = platform === 'instagram' ? 'Instagram caption' : 'Facebook post';
    throw new Error(`${label} ${problems.join('; ')}`);
  }
}

async function graph<T = Record<string, unknown>>(
  path: string,
  payload: Record<string, string>
): Promise<T> {
  const res = await fetch(`${GRAPH}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ ...payload, access_token: ACCESS_TOKEN! }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Graph ${path} failed: ${data.error?.message || res.status}`);
  }
  return data as T;
}

// Two-step publish: create a media container, wait for it to finish
// processing the image (it's asynchronous; publishing too early fails with
// "Media ID is not available"), then publish it.
export async function postToInstagram(imageUrl: string, caption: string): Promise<string> {
  assertCaptionRules(caption, 'instagram');
  const container = await graph<{ id: string }>(`${IG_USER_ID}/media`, {
    image_url: imageUrl,
    caption,
  });
  await waitForContainer(container.id);
  return publishContainer(container.id);
}

// Carousel publish: one container per slide (is_carousel_item), then a parent
// CAROUSEL container referencing the children. IG allows 2-10 slides.
export async function postCarouselToInstagram(
  imageUrls: string[],
  caption: string
): Promise<string> {
  assertCaptionRules(caption, 'instagram');
  if (imageUrls.length < 2) return postToInstagram(imageUrls[0], caption);
  const children: string[] = [];
  for (const url of imageUrls.slice(0, 10)) {
    const child = await graph<{ id: string }>(`${IG_USER_ID}/media`, {
      image_url: url,
      is_carousel_item: 'true',
    });
    await waitForContainer(child.id);
    children.push(child.id);
  }
  const parent = await graph<{ id: string }>(`${IG_USER_ID}/media`, {
    media_type: 'CAROUSEL',
    children: children.join(','),
    caption,
  });
  await waitForContainer(parent.id);
  return publishContainer(parent.id);
}

async function publishContainer(creationId: string): Promise<string> {
  const published = await graph<{ id: string }>(`${IG_USER_ID}/media_publish`, {
    creation_id: creationId,
  });
  try {
    const res = await fetch(
      `${GRAPH}/${published.id}?fields=permalink&access_token=${ACCESS_TOKEN}`
    );
    const media = await res.json();
    if (media.permalink) return media.permalink;
  } catch {
    // permalink is cosmetic; fall through
  }
  return 'https://www.instagram.com/';
}

async function waitForContainer(creationId: string) {
  for (let i = 0; i < 30; i++) {
    const res = await fetch(
      `${GRAPH}/${creationId}?fields=status_code&access_token=${ACCESS_TOKEN}`
    );
    const data = await res.json();
    const status = data.status_code;
    if (status === 'FINISHED') return;
    if (status === 'ERROR' || status === 'EXPIRED') {
      throw new Error(`IG media container ${status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error('IG media container not ready after 60s');
}

export async function postToFacebook(imageUrl: string, message: string): Promise<string> {
  assertCaptionRules(message, 'facebook');
  const post = await graph<{ post_id?: string; id: string }>(`${PAGE_ID}/photos`, {
    url: imageUrl,
    message,
  });
  return `https://www.facebook.com/${post.post_id || post.id}`;
}

// Multi-photo Page post: upload each photo unpublished, then create a feed
// post that attaches them all.
export async function postPhotosToFacebook(
  imageUrls: string[],
  message: string
): Promise<string> {
  assertCaptionRules(message, 'facebook');
  if (imageUrls.length < 2) return postToFacebook(imageUrls[0], message);
  const mediaIds: string[] = [];
  for (const url of imageUrls.slice(0, 10)) {
    const photo = await graph<{ id: string }>(`${PAGE_ID}/photos`, {
      url,
      published: 'false',
    });
    mediaIds.push(photo.id);
  }
  const post = await graph<{ id: string }>(`${PAGE_ID}/feed`, {
    message,
    attached_media: JSON.stringify(mediaIds.map((id) => ({ media_fbid: id }))),
  });
  return `https://www.facebook.com/${post.id}`;
}

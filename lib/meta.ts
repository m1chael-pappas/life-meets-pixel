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
  const container = await graph<{ id: string }>(`${IG_USER_ID}/media`, {
    image_url: imageUrl,
    caption,
  });
  await waitForContainer(container.id);
  const published = await graph<{ id: string }>(`${IG_USER_ID}/media_publish`, {
    creation_id: container.id,
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
  const post = await graph<{ post_id?: string; id: string }>(`${PAGE_ID}/photos`, {
    url: imageUrl,
    message,
  });
  return `https://www.facebook.com/${post.post_id || post.id}`;
}

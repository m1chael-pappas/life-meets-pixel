# Meta (Instagram + Facebook) posting setup

One-time setup for the pipeline's auto-posting. Prerequisite: the Life Meets
Pixel Facebook Page with the Instagram business/creator account linked to it
(already in place).

## 1. Create the app

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps) → **Create App** → type **Business**.
2. Name it e.g. `LMP Pipeline`. No review needed: the app stays in dev mode since it only posts to assets you own.

## 2. Get a long-lived Page access token

1. Open [Graph API Explorer](https://developers.facebook.com/tools/explorer/), select the app.
2. **Generate Access Token** and grant: `pages_show_list`, `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`. Log in as the Page admin.
3. Exchange the short-lived user token for a long-lived one (60 days):
   `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=<APP_ID>&client_secret=<APP_SECRET>&fb_exchange_token=<SHORT_TOKEN>`
4. Get the **Page** token (Page tokens derived from a long-lived user token do not expire):
   `https://graph.facebook.com/v21.0/me/accounts?access_token=<LONG_LIVED_USER_TOKEN>`
   → copy the `access_token` of the Life Meets Pixel page → this is `META_PAGE_ACCESS_TOKEN`, and `id` is `META_PAGE_ID`.

## 3. Get the Instagram user ID

`https://graph.facebook.com/v21.0/<PAGE_ID>?fields=instagram_business_account&access_token=<PAGE_TOKEN>`
→ `instagram_business_account.id` is `META_IG_USER_ID`.

## 4. Wire it up

Add to `.env.local` AND Vercel production (then redeploy):

```
META_PAGE_ID=...
META_IG_USER_ID=...
META_PAGE_ACCESS_TOKEN=...
```

Until these exist, `/api/social` renders the template and delivers it +
captions to Telegram for manual posting. Once set, the same route posts to
both platforms automatically after the Publish button.

Test with an already-published candidate:

```
curl "https://lifemeetspixel.com/api/social?candidateId=<id>&secret=<CRON_SECRET>"
```

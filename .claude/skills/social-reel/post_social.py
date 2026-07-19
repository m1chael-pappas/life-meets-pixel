#!/usr/bin/env python3
"""Post an approved reel to Instagram and/or Facebook. Read ../SKILL.md first.

ONLY run this after Michael has explicitly approved THIS specific video.

The Instagram Graph API will not accept a file upload for Reels, only a public
`video_url`, so the mp4 is first uploaded to the Sanity CDN (assets are public)
and that URL is handed to Meta. Facebook reuses the same URL.

Usage:
    python3 post_social.py --video reel.mp4 --caption caption.txt [--fb-caption fb.txt]
                           [--ig] [--fb] [--check-only]

Notes:
  * Instagram captions have NO clickable links. Facebook does, so put the full
    review URL in the FB copy (--fb-caption).
  * Tag the developer/publisher on IG (e.g. @slugdisco); it helps reach. Facebook
    does not permit API mentions of other Pages, so name them in plain text.
  * --check-only lists recent posts so you can confirm there is no duplicate and
    see whether an older version still needs deleting.
"""
import argparse, json, os, sys, time, urllib.error, urllib.parse, urllib.request

REPO = "/home/michael_pappas/code/life-meets-pixel"
GRAPH = "https://graph.facebook.com/v21.0"


def load_env():
    env = {}
    for line in open(f"{REPO}/.env.local", encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip("\"'")
    return env


def get(url):
    with urllib.request.urlopen(url, timeout=120) as r:
        return json.load(r)


def post(url, fields):
    data = urllib.parse.urlencode(fields).encode()
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=data), timeout=300) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        print("HTTP", e.code, e.read().decode()[:900])
        raise


def upload_to_sanity(env, video):
    """Sanity file assets are public, which gives Meta a URL it can fetch."""
    url = (f"https://{env['NEXT_PUBLIC_SANITY_PROJECT_ID']}.api.sanity.io/v2024-01-01"
           f"/assets/files/{env['NEXT_PUBLIC_SANITY_DATASET']}"
           f"?filename={os.path.basename(video)}")
    req = urllib.request.Request(
        url, data=open(video, "rb").read(),
        headers={"Authorization": f"Bearer {env['SANITY_API_TOKEN']}",
                 "Content-Type": "video/mp4"}, method="POST")
    with urllib.request.urlopen(req, timeout=900) as r:
        asset = json.load(r)["document"]
    print(f"  uploaded {os.path.getsize(video)/1_048_576:.1f} MB -> {asset['url']}")
    return asset["url"]


def recent(env):
    tok = urllib.parse.quote(env["META_PAGE_ACCESS_TOKEN"])
    print("recent Instagram media:")
    for m in get(f"{GRAPH}/{env['META_IG_USER_ID']}/media"
                 f"?fields=id,timestamp,permalink&limit=5&access_token={tok}").get("data", []):
        print("  ", m["timestamp"], m["permalink"])
    print("recent Page videos:")
    for v in get(f"{GRAPH}/{env['META_PAGE_ID']}/videos"
                 f"?fields=id,title,created_time&limit=5&access_token={tok}").get("data", []):
        print("  ", v.get("created_time"), v.get("id"), (v.get("title") or "")[:50])


def post_instagram(env, video_url, caption):
    tok = env["META_PAGE_ACCESS_TOKEN"]
    ig = env["META_IG_USER_ID"]
    print("instagram: creating container…")
    cid = post(f"{GRAPH}/{ig}/media", {
        "media_type": "REELS", "video_url": video_url, "caption": caption,
        "share_to_feed": "true", "access_token": tok})["id"]
    for attempt in range(40):
        time.sleep(10)
        st = get(f"{GRAPH}/{cid}?fields=status_code&access_token={urllib.parse.quote(tok)}")
        code = st.get("status_code")
        print(f"  [{attempt+1}] {code}")
        if code == "FINISHED":
            break
        if code == "ERROR":
            sys.exit(f"instagram transcode failed: {json.dumps(st)[:500]}")
    else:
        sys.exit("instagram transcode timed out")
    mid = post(f"{GRAPH}/{ig}/media_publish",
               {"creation_id": cid, "access_token": tok})["id"]
    link = get(f"{GRAPH}/{mid}?fields=permalink&access_token={urllib.parse.quote(tok)}")
    print("  PUBLISHED", link.get("permalink"))
    return mid


def post_facebook(env, video_url, title, description):
    tok = env["META_PAGE_ACCESS_TOKEN"]
    print("facebook: posting video…")
    vid = post(f"{GRAPH}/{env['META_PAGE_ID']}/videos", {
        "file_url": video_url, "title": title,
        "description": description, "access_token": tok})["id"]
    for attempt in range(30):
        time.sleep(8)
        st = get(f"{GRAPH}/{vid}?fields=status,permalink_url"
                 f"&access_token={urllib.parse.quote(tok)}")
        phase = (st.get("status") or {}).get("video_status")
        print(f"  [{attempt+1}] {phase}")
        if phase in ("ready", "processing_complete"):
            print("  PUBLISHED https://www.facebook.com" + (st.get("permalink_url") or ""))
            return vid
        if phase == "error":
            sys.exit(f"facebook processing failed: {json.dumps(st)[:500]}")
    print("  still processing; video id:", vid)
    return vid


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video")
    ap.add_argument("--caption", help="file containing the Instagram caption")
    ap.add_argument("--fb-caption", help="file containing the Facebook copy (may include links)")
    ap.add_argument("--title", default="", help="Facebook video title")
    ap.add_argument("--ig", action="store_true")
    ap.add_argument("--fb", action="store_true")
    ap.add_argument("--check-only", action="store_true")
    a = ap.parse_args()

    env = load_env()
    if a.check_only:
        recent(env)
        return
    if not (a.ig or a.fb):
        sys.exit("nothing to do: pass --ig and/or --fb")
    if not a.video or not a.caption:
        sys.exit("--video and --caption are required")

    ig_caption = open(a.caption, encoding="utf-8").read().strip()
    fb_caption = (open(a.fb_caption, encoding="utf-8").read().strip()
                  if a.fb_caption else ig_caption)

    print("checking for existing posts first…")
    recent(env)
    print()

    video_url = upload_to_sanity(env, a.video)
    if a.ig:
        post_instagram(env, video_url, ig_caption)
    if a.fb:
        post_facebook(env, video_url, a.title, fb_caption)

    print("\nDone. Now: read the live captions back to verify, and delete any "
          "superseded video assets from Sanity.")


if __name__ == "__main__":
    main()

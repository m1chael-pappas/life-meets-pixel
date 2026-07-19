---
name: social-reel
description: Build a vertical 1080x1920 reel from an official game/film trailer for Instagram and Facebook, with pixel-font text beats, and post it. Use when asked to "make a reel", "make a short", "make a video for socials", or to promote a review on Instagram/Facebook with video.
---

# Social reel pipeline

End-to-end recipe for turning an official trailer into a Life Meets Pixel reel. Every rule below exists because it broke something in production. Follow the order.

**Golden rule: ONE CONTINUOUS TAKE.** Never stitch separate parts of a trailer together. See "Choose the take".

**Never post without explicit approval for that specific item.** Send to Telegram, wait for Michael's go, then post.

---

## 0. Tooling (no sudo on this machine)

`apt install ffmpeg` is not available. Use pip, which ships a static ffmpeg 7.0:

```bash
pip3 install --quiet yt-dlp imageio-ffmpeg
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
```

That build has **no `drawtext`** despite `--enable-libfreetype` in its buildconf. It does have libass, so all text is rendered as an ASS subtitle file. This is better anyway: real styling, `\pos()`, `\fad()`, per-line colour overrides.

Fonts: libass needs TTF/OTF and the app only ships woff2, so fetch Press Start 2P:

```bash
curl -sSL -o PressStart2P.ttf \
  https://github.com/google/fonts/raw/main/ofl/pressstart2p/PressStart2P-Regular.ttf
```

---

## 1. Find the trailer

1. **Steam** is the best source for games. `https://store.steampowered.com/api/appdetails?appids=<appid>&cc=au&l=en` returns `data.movies[]` (trailer name + thumbnail) and `data.screenshots[].path_full`. Note Steam's own trailer URLs are **DASH/HLS only** and will not download simply, so use them only to confirm a trailer exists.
2. **Get the publisher's YouTube upload** and download from there. Search `"<title>" launch trailer <publisher>`.
3. **Verify the URL actually is the right video** before using it: fetch the page and check the title. Do not trust a search snippet.

```bash
python3 -m yt_dlp --ffmpeg-location "$FF" \
  -f "bv*[height<=1080]+ba/b[height<=1080]" --merge-output-format mp4 \
  -o "trailer.%(ext)s" "<youtube url>"
```

## 2. Normalise the source

yt-dlp merges AV1 video + Opus audio into mp4, which seeks badly. Convert once to H.264 + AAC with a keyframe every second:

```bash
"$FF" -i trailer.mp4 -c:v libx264 -preset veryfast -crf 18 -r 30 -g 30 \
  -keyint_min 30 -sc_threshold 0 -pix_fmt yuv420p \
  -c:a aac -b:a 256k -ar 48000 -ac 2 trailer_norm.mp4
```

## 3. Choose the take — THE MOST IMPORTANT STEP

Pick **one unbroken 20-30s window**. Do not assemble the reel from multiple trailer segments.

Cutting between disjoint segments hard-cuts the **music** as well as the scene, so a few seconds in, the reel lurches into unrelated audio over unrelated gameplay. It reads as broken no matter how clean the encode is, and it is not fixable downstream. This single mistake caused every "the audio is broken" round of feedback on the Pathogenic reel.

Find the window with data, not by guessing:

```bash
# per-second brightness: frame 0 must be bright enough to work as a thumbnail
"$FF" -nostats -ss 44 -t 40 -i trailer_norm.mp4 \
  -vf "fps=1,signalstats,metadata=print:key=lavfi.signalstats.YAVG" -f null -

# contact sheet: reject windows containing the trailer's own marketing text
"$FF" -ss 57 -t 23 -i trailer_norm.mp4 -vf "fps=1/2,scale=300:-1,tile=6x2" -frames:v 1 win.jpg
```

Then **look at `win.jpg` with the Read tool.** Requirements: bright opening frame, no baked-in marketing captions ("EVOLVE YOUR PATHOGEN", "OUT NOW"), visually varied action. In-game HUD and boss name plates are fine. Skip the publisher end card if reaching it needs a jump.

## 4. Build

Use `build_reel.py` in this skill directory. Set `SRC`, `START`, `TOTAL` and the `BEATS` list, then run it. It cuts the take, writes the ASS, does two-pass loudness, renders, and **hard-fails on any timestamp fault**.

### Layout (1080x1920)

Blurred fill behind, gameplay centred, text above and below:

```
[0:v]split=2[bg][fg];
[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,
    gblur=sigma=40,eq=brightness=-0.30:saturation=1.15[bgb];
[fg]scale=1080:-2[fgs];
[bgb][fgs]overlay=x=0:y=(H-h)/2,format=yuv420p,setsar=1[vv]
```

### Text rules

All overlay text is **Press Start 2P**, top and bottom, with outlines (`BorderStyle=1`) and never background boxes. A proportional font in a box reads as burnt-in subtitles, which Michael has rejected.

Press Start 2P advances roughly **one character per point of size**, so width ≈ chars × size and 1080 is the ceiling. Write copy to fit the font; do not shrink the font to fit copy. Break long lower lines with `\N` instead.

| Element | Size | Max chars/line |
|---|---|---|
| Hook lines (beat 1) | 70 | ~10 |
| Headline lines | 50 | ~16 |
| Lower line | 36 | ~25 |
| End CTA | 50 | ~18 |
| Score number | 96 | short |

### Beat structure

1. **Hook** — a claim, not a title card. `CHECK THIS` / `NEW GEM!` / `<TITLE>`. Gets `\fad(0,200)` so it is **fully drawn on frame 0** and works as a thumbnail. Never apply `fade=t=in` to the video.
2-5. **Body beats**, ~3.8s each: premise, mechanic, variety, then the honest caveat.
6. **Close** — `OUR SCORE:` above the big number, then the CTA.

Frame the caveat as a tease that resolves ("rough for a few hours / but it gets better / as you evolve"), never a flat negative. It must still match the review's real criticism.

The end CTA gets its own large treatment, three stacked lines at ~50px:

```
READ OUR FULL
REVIEW ON:
{\c&H6BFF6B&}lifemeetspixel.com
```

### Audio

- Keep the trailer's own audio. There is **no ElevenLabs key** in `.env.local`, so no voiceover unless one is added.
- **`loudnorm` is DYNAMIC in single-pass mode.** It spends the first second converging on a gain, which audibly warbles the opening. Always two-pass: measure with `print_format=json`, then re-apply with `measured_I`/`measured_TP`/`measured_LRA`/`measured_thresh`/`offset` and `linear=true`.
- **Never add `aresample=first_pts=0`.** It pads the stream start and silences the opening segment.
- Target `I=-14:TP=-1.5`. Tail fade only; a single take needs no fade-in.

## 5. Verify — do not skip, do not substitute

Two production posts shipped broken because the check measured the wrong property.

**Decoding audio to WAV writes samples contiguously and therefore completely hides timestamp faults.** An RMS/silence check will happily pass a file whose audio plays at 4.7x speed. Required:

1. **Timestamps.** Parse `pts_time` from `-af ashowinfo` / `-vf showinfo`. Fail on any gap >60ms, any backwards step, or a first frame later than 0.05s. `build_reel.py` does this and exits non-zero.
2. **Envelope correlation** against the source window: expect >0.95 at a small constant lag, checked per-quarter so drift shows. A deliberately sped-up control should score near zero — if it doesn't, the test cannot detect the fault.
3. **Frames.** Extract one frame per beat, tile them, and Read the image. If libass cannot find the font it silently substitutes a default.

**Match the measurement to the symptom.** "Speeds up", "cuts out", "out of sync" are timing faults; loudness cannot detect them.

## 6. Approval, then post

Copy to `~/Downloads/` and send to Telegram with a cover frame from `t=0`. Then **wait**.

Note: the Bash sandbox may not read from `~/Downloads`; upload from the scratchpad path.

Once approved, use `post_social.py`. Key constraint: **the Instagram Graph API will not accept a file upload for Reels, only a public `video_url`.** Upload the mp4 to the Sanity CDN (assets are public) and hand Instagram that URL.

- IG: `POST /{ig-user-id}/media` with `media_type=REELS`, `video_url`, `caption`, `share_to_feed=true` → poll `status_code` until `FINISHED` → `POST /{ig-user-id}/media_publish`.
- FB: `POST /{page-id}/videos` with `file_url`, `title`, `description` → poll until `ready`.
- **Instagram captions have no clickable links**; Facebook does, so put the full review URL in the FB copy.
- **Tag the developer/publisher on IG** — it helps reach. Slug Disco is `@slugdisco`. API mentions of other *Pages* are not permitted on Facebook, so name them in plain text there.
- Afterwards: verify by reading the live caption back, check for duplicates before posting, and delete superseded video assets from Sanity.

---

## Pitfalls, ranked by how much time they cost

| Symptom | Cause | Fix |
|---|---|---|
| Audio and scene lurch a few seconds in | Reel assembled from disjoint trailer segments | One continuous take |
| Audio speeds up then drops out | `-ss` + `concat` in one filter graph bunches audio PTS (141 frames crammed into 0.64s) | Cut each segment to its own file first; better, use one take |
| Opening music warbles | Single-pass `loudnorm` converging | Two-pass with measured values, `linear=true` |
| First segment silent after ~0.75s | `aresample=first_pts=0` | Remove it |
| Verification passes but video is broken | Checked levels, not timestamps | Check `pts_time` gaps |
| Reel opens on black | Trailer fades from black + `fade=t=in` | Bright start frame, no video fade-in |
| Text looks like subtitles | Proportional font in a background box | Press Start 2P with outlines |
| Text runs off frame | Press Start 2P is ~1 char per point of size | Shorten copy or `\N` |
| `ERR_MODULE_NOT_FOUND` in Node upload scripts | ESM ignores `NODE_PATH` | Run the script from the repo root |

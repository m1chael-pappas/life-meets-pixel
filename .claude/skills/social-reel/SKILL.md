---
name: social-reel
description: Build a vertical 1080x1920 reel from an official game/film trailer for Instagram and Facebook, with pixel-font text beats, and post it. Use when asked to "make a reel", "make a short", "make a video for socials", or to promote a review on Instagram/Facebook with video.
---

# Social reel pipeline

End-to-end recipe for turning an official trailer into a Life Meets Pixel reel. Every rule below exists because it broke something in production. Follow the order.

**Golden rule: ONE CONTINUOUS TAKE, unless there is a voiceover.** Never stitch separate parts of a trailer together *when the trailer's own audio is the soundtrack*. See "Choose the take". The rule exists because stitching hard-cuts the MUSIC, and that is the only reason. A VO-led reel takes its bed from a single continuous audio pull with the voice on top, so the music never cuts however the picture is assembled, and the picture is then free to follow the script. See "Voiceover-led reels".

**Golden rule: HOOK FIRST, NAME LAST.** Beat 1 is a hook that opens a curiosity gap, and it must NOT name the game. Reveal the game's name (with the score or release date, and the CTA) on the FINAL beat, over the last frame. The unanswered "what is this?" is what carries a viewer to the end, so nobody should be able to name the game before the reveal. The thumbnail (frame 0) sells the hook, not the title. See "Beat structure".

**Golden rule: SCRIPT APPROVED BEFORE RENDER.** Never build a video until Michael has approved the wording. Post the full beat script in chat, wait for his go, then render. See "Get the script approved".

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

## 3b. Get the script approved — BEFORE you render

Rendering is the expensive step and rewording after the fact means a full rebuild plus a re-verify. Worse, a weak hook is not visible in the pipeline output: every check passes and the reel is still bad. So the wording gets signed off in chat first, every time, including for a re-cut of a reel that was already built.

Post the complete script as a table and stop:

```
BEAT   TIME        TOP LINE 1 / TOP LINE 2      LOWER LINE
hook   0.0-3.8     <l1> / <l2>                  <low>
2      3.8-7.6     ...
...
reveal 19.0-23.0   <TITLE> + <score or date>    <CTA> / lifemeetspixel.com
```

Include, so he can judge it without watching anything: the take window and why, what each beat's footage actually shows, and the character count of any line near the width ceiling.

**Do not render, do not "build it so he can see it", do not send a draft to Telegram to illustrate the wording.** Wait for the go.

### The hook is the one line worth arguing about

OpusClip's analysis of 50M ads ranks hook types by 3-second retention, and the spread is enormous:

| Hook type | Retention | Shape |
|---|---|---|
| Specific outcome | 45% | a concrete, quantified result |
| POV realism | 42% | `POV: YOU ...` puts the viewer in it |
| Contrarian / unpopular opinion | 38% | attack a thing the audience believes |
| Question | 28% | ask something they cannot answer |
| **Generic product reveal** | **~12%** | **"MAKE YOUR OWN SPELLS"** |

A hook that *describes a feature* is a generic product reveal and is the worst-performing category by a factor of nearly four. `MAKE YOUR OWN SPELLS` and `BUILD YOUR OWN X` are exactly this trap: accurate, on-message, and dead. The other three consistently viral 2026 formulas are the Contrarian Claim, the Mistake Warning ("most people get this wrong") and the List Tease ("three nodes, one broken run").

Also: Instagram penalises slow intros harder than TikTok, so the hook must land by **1.0s** and the promise be complete by **3.0s**, and ~60% of viewers are sound-off, so the text overlay is carrying the whole hook on its own.

Never invent a number to manufacture a specific-outcome hook. Pull real figures out of the game's own UI (damage values, stack counts, node names) which the footage will back up on screen.

**Michael's house preference is the DEMONSTRATIVE hook**: `LOOK WHAT / ONE SPELL DOES`, `CHECK THIS`, "look what you can do in this game". He has asked for this shape twice. Do not read that as licence to write an empty attention-grab, which is the same generic-reveal trap in a different costume. The rule that satisfies both him and the data: **point the demonstrative line at something concrete, and carry the specific payoff on the lower line.**

```
LOOK WHAT              <- demonstrative pull, invites the viewer to look
ONE SPELL DOES         <- aimed at a specific thing, not "this game"
burn, on a boomerang   <- the concrete promise lives here
```

Best of all is when the hook describes what is literally on screen in beat 1, so the footage is the proof rather than mere illustration. Pick the take window first, then write the hook to the opening frame.

## 4. Build

Use `build_reel.py` in this skill directory. Set `SRC`, `START`, `TOTAL` and the `BEATS` list, then run it. It cuts the take, writes the ASS, does two-pass loudness, renders, and **hard-fails on any timestamp fault**.

### Layout (1080x1920)

Blurred fill behind, gameplay centred, text above and below:

```
[0:v]split=2[bg][fg];
[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,
    gblur=sigma=40,eq=brightness=-0.30:saturation=1.15[bgb];
[fg]scale=1500:-2,crop=1080:844[fgs];
[bgb][fgs]overlay=x=0:y=(H-h)/2,format=yuv420p,setsar=1[vv]
```

**The gameplay block is 844px tall. Do not ship 607.** 16:9 at 1080 wide is only 607 tall, so the height only grows by zooming: scale to 1500 wide, then centre-crop back to 1080. `scale=1080:-2` gives the old, too-small block and gets rejected on review every time.

### Text rules

All overlay text is **Press Start 2P**, top and bottom, with outlines (`BorderStyle=1`) and never background boxes. A proportional font in a box reads as burnt-in subtitles, which Michael has rejected.

Press Start 2P advances roughly **one character per point of size**, so width ≈ chars × size and 1080 is the ceiling. Write copy to fit the font; do not shrink the font to fit copy. Break long lower lines with `\N` instead.

| Element | Size | Max chars/line |
|---|---|---|
| Hook lines (beat 1) | 70 | ~10 |
| Headline lines | 50 | ~16 |
| Lower line (`Sub`) | 50 | ~21 |
| End CTA | 54 | ~20 |
| Name reveal (last beat) | 84-90 | short |
| Score line (last beat) | 40 | ~26 |

These sizes are settled. `Sub` was raised 36 -> 50 and `Cta` 50 -> 54 because the lower line was unreadable on a phone. Do not lower them to make longer copy fit.

**The lower line is top-anchored with `\an8` at a single shared `LOW_Y` (1450).** The styles are `Alignment=5` (middle-centre), which centres a text block on its `\pos()`, so a 2- or 3-line lower line pushes its first line *upward* and visibly stops matching the single-line beats. The platform beat and the end CTA are the two that always have extra lines, so they are the two that always drifted. Top-anchoring pins every beat's first line to the same y regardless of line count. **Do not override `low_y` per beat**, or they stop aligning again.

### Beat structure

1. **Hook** — a claim that opens a curiosity gap, not a title card, and it must NOT name the game. `CHECK THIS` / `NEW GEM!` / `IT STARTED AS A MEME`, with a lower line that teases rather than labels ("you have not played this"). Gets `\fad(0,200)` so it is **fully drawn on frame 0** and works as a thumbnail. Never apply `fade=t=in` to the video.
2-5. **Body beats**, ~3.8s each: premise, mechanic, variety, then a payoff beat.
6. **Close / reveal** — the game's NAME lands here for the first time, big and centred **over** the gameplay strip, so the whole reel is a "what is this?" that only resolves on the last frame. Pair the name with `OUR SCORE  8.2 / 10` for a review, or with the release date for a preview/launch. The CTA sits underneath on the lower line.

**Never put the name in beat 1**, including as the lower line. `low=TITLE` on the hook beat is the exact mistake the reference script used to ship: it answers the question the reel is supposed to be asking.

**The beat-5 slot is a payoff, not an obligatory negative.** Do not manufacture a caveat for every review. "Your time will evaporate" is a perfectly good beat 5. Only include a criticism when the review genuinely leads with one, and even then frame it as a tease that resolves, never a flat negative. For a not-yet-scored preview, swap it for social proof (wishlists, demo rating).

The reveal beat stacks the name over the score, with the CTA as the lower line:

```
PATHOGENIC                          <- 86px, y690, over the footage
OUR SCORE  8.2 / 10                 <- 40px, y812
READ OUR FULL REVIEW                <- Cta style on the shared LOW_Y
{\c&H6BFF6B&}lifemeetspixel.com
```

### Voiceover (optional)

There is still **no ElevenLabs key** in `.env.local`, and you do not need one. Two local models are installed and both are licensed for commercial use:

```bash
pip install kokoro-onnx espeakng-loader soundfile        # Kokoro, Apache 2.0
pip install torch torchaudio chatterbox-tts              # Chatterbox, MIT (needs the 4090)
curl -sL -O https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -sL -O https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
```

Kokoro needs `espeak-ng` and there is no sudo on this machine, so use the **`espeakng-loader` pip wheel**, which ships the shared library: set `ESPEAK_DATA_PATH` and `PHONEMIZER_ESPEAK_LIBRARY` from it before importing. Do not `pip install kokoro` (the non-ONNX package): its `misaki` -> `spacy` chain fails to build on Python 3.13.

**Voice: `bm_fable`, not `bm_lewis`.** Lewis was the earlier default and Michael called the read a "continuous monotone". Measuring pitch spread (autocorrelation F0, p10-p90) across the British and American male voices settled it: fable 82 Hz, george 77, lewis 62, michael 55, daniel 50. Pair it with one clip per sentence and a real 0.3-0.55s silence between them, longest before a punchline: generating the whole script as one clip is what made it run together in the first place.

**There is no Australian voice. Do not go looking for one again.** Chatterbox has no voice bank at all: one default American voice, and everything else is zero-shot cloning from an audio prompt (`SUPPORTED_LANGUAGES` is languages, not accents). Kokoro's 54 voices cover American, British, Spanish, French, Hindi, Italian, Japanese, Portuguese and Chinese only. **`bm_lewis`** (British male) is the settled default: it reads far less wrong than American on an Australian site, and it was the only British voice whose lines all fit inside a 3.8s beat at speed 1.0. Cloning Michael's own voice with Chatterbox is the only real route to an Australian accent and needs him to record a sample first.

Budget roughly **8 to 10 words per 3.8s beat**, generate each line separately, and assert every clip fits its beat before mixing.

### Audio

- Keep the trailer's own audio as the bed. With VO, normalise the music to **-17 LUFS** rather than -14 so the voice has somewhere to sit.
- **Duck and mix in numpy, not in ffmpeg.** `sidechaincompress` into `amix` silently truncated the mixed stream by ~0.55s on this build, which cut the tail off the name reveal, and `apad` would only have hidden it. Build the duck envelope yourself (-9dB under each line, 15ms attack / 350ms release), add the VO, limit, then `assert len(mix) == int(TOTAL*SR)`.
- **With VO, the tail fade goes on the MUSIC ONLY.** The reveal line runs to ~22.95s and the music fade starts at 21.8s, so fading the mixed bus swallows the game's name, which is the one thing the reel exists to deliver. Apply the fade to the music array before adding the voice, then put a 120ms safety fade on the very end.
- **Set the VO gain from the MEASURED ducked bed, never a fixed multiplier.** Kokoro's output is quiet, and `vo * 1.30` over a -17 LUFS bed ducked 9 dB left only **1.8 dB** of separation, which is a voice fighting the music. Measure and solve for the gain, targeting 13 dB:
  ```python
  bed_rms = rms(music[active] * env[active])
  vo_gain = bed_rms * 10 ** (13 / 20) / rms(vo[active])
  ```
- **Keep `loudnorm` out of the render chain entirely, and solve for the gain instead.** The numpy mix lands near -18 LUFS, which plays quiet in feed, but the obvious fix is a trap three ways over:
  - **`loudnorm` rewrites timestamps even with `linear=true`.** It is documented as a constant gain in that mode and it is not timestamp-neutral: on a 33s reel it shifted one PTS by 50ms near the end (30.635 → 30.706) with the frame count unchanged, and step 5 correctly refused to ship it. Isolated by encoding `mix.wav` three ways: limiter alone was clean, `loudnorm` alone reproduced the gap.
  - **Matching -14 LUFS by gain alone backfires.** Reel material has a high crest factor, so it reaches the ceiling before the target: gaining to -14 put the peak at 0.99 and gave the limiter 4 dB of work, which came straight back off programme loudness. Measured result on a file aimed at -14: **-18.4**.
  - **Peak-capping undershoots.** Capping the gain so the true peak lands at 0.85 measured **-19.5**.

  What works: normalise to unity peak, measure what the limiter actually produces, then solve. Post-limiter loudness moves about **0.8 LU per dB of input gain**, measured across a 1.0 to 2.2 sweep, so one probe encode gives you the gain. Target -15.0 LUFS to match what already shipped. Both build scripts do this; `build_reel.py` uses `volume=NdB` in the filter chain, `build_vo_reel.py` applies it to the numpy array.

  | gain | limit 0.90 | limit 0.72 |
  |---|---|---|
  | 1.0 | -18.14 LUFS, -0.89 dBTP | -18.32, -2.76 |
  | 1.4 | -15.40, -0.34 | -15.91, -2.30 |
  | 1.8 | -13.43, +0.08 | -14.13, -1.88 |
  | 2.2 | -11.91, +0.74 | -12.87, -0.57 |
- **The Kokoro model files are not persisted** between sessions. `kokoro-v1.0.onnx` (325 MB) and `voices-v1.0.bin` need re-downloading into the working directory each time.
- **`loudnorm` is DYNAMIC in single-pass mode.** It spends the first second converging on a gain, which audibly warbles the opening. Always two-pass: measure with `print_format=json`, then re-apply with `measured_I`/`measured_TP`/`measured_LRA`/`measured_thresh`/`offset` and `linear=true`.
- **Never add `aresample=first_pts=0`.** It pads the stream start and silences the opening segment.
- Target `I=-14:TP=-1.5`. Tail fade only; a single take needs no fade-in.

## 4b. Voiceover-led reels (the How Many Dudes shape)

Michael's preferred format as of the How Many Dudes reel: **gameplay fills the frame, there are no big text cards at all until the reveal, and the captions render word by word along the bottom as the voice speaks.** He rejected the static top/bottom beat-card layout as "just random words" that reads like a mid-video explainer. Working reference: **`build_vo_reel.py`** in this directory, driven by a `config.py` (copy `config.example.py`). It takes the timeline from the measured VO clip lengths plus an explicit silence after each sentence, and hard-fails on timestamp faults the same way `build_reel.py` does.

Write the spoken track as **one continuous paragraph a person would actually say**, then chop it into sentences. Do not write five disconnected stat lines and call it a script. Read it aloud before you build it. Open a loop in the first sentence and close it near the end.

**The hook is the exception to "no big lettering".** Michael asked for the opener back in big type at the top, and he is right: 60% of viewers are sound-off and a 44pt bottom line does not stop a scroll. So the first one or two spoken lines get a **big top card that builds in time with the voice** (68pt, `\an8` at y=300, each new line landing green with a pop and the previous ones settling to white), and everything after reverts to the small bottom captions. What he rejected was the body being a slideshow of cards, not a strong opener. The card's display text is a **headline, not a transcript**: `WE ALWAYS / WONDERED / HOW MANY DUDES / BEAT A GORILLA` drops "it takes to" that the voice still says, and that is fine. Weight the build by the *spoken* fragment anyway so it tracks the voice.

**End a hook card on the next spoken line, not on the cut boundary.** Holding `NOW WE KNOW` to `CUTS[1][1]` left it on screen while the bottom karaoke had already started the following sentence and the two competed. Use `VO[n+1]["t0"] - 0.10`.

The picture is then **assembled to serve the script**, one cut per idea, because the gorilla, the dude-select screen, the trinket screen and the nuke live in four different parts of the trailer. Still cut each segment to its own file before concatenating.

**Never use `-t` after `-i` on a segment.** It caps OUTPUT duration, so on a `setpts`-stretched slow-mo segment it clips the result back to the source length and the reel silently comes out short. Use `-frames:v`, derived from cumulative reel time so the concatenated total is exact:

```python
nframes = int(round(t1 * 30)) - int(round(t0 * 30))
```

**Karaoke captions.** One ASS Dialogue event per word-state: the words so far, with the newest one popped (`\fscx72\fscy72\t(0,110,\fscx100\fscy100)`) and tinted `&H6BFF6B&`. Words not yet spoken are simply not drawn, so the line grows. Generate one VO clip per sentence so line boundaries are exact, then split each sentence's duration across its chunks and words by **spoken** character count, not displayed: "42" is two characters on screen and nine in the mouth, so weight it with the spoken fragment or the highlight drifts.

Caption style is `Press Start 2P` 44pt, top-anchored at a single y below the gameplay block. At 44pt the ceiling is ~24 characters, so chunks run 2-4 words.

**Layout.** Gameplay at `scale=1600:-2,crop=1080:900` overlaid at `y=420`, captions at `y=1470`. Do not ask for a 1000px-tall block from a 1600-wide scale: 16:9 at 1600 is only 900 tall and `crop` hard-fails. Cropping taller means cropping narrower, and the game's roster and trinket UI already lose their outer columns at 67.5% width, so 900 is the practical ceiling for this game. Lighten the blurred fill to `brightness=-0.18:saturation=1.25` for a VO reel, since there is no longer a wall of text to sit against.

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
| Timestamp check fails on an otherwise clean render | `loudnorm` in the render chain, even with `linear=true` | Solve the gain and use `volume` + `alimiter`; see Audio |
| Reel plays quiet in feed after removing `loudnorm` | Gained to -14 on high-crest material, so the limiter ate it | Solve against measured post-limiter loudness, target -15 |
| Reel opens on black | Trailer fades from black + `fade=t=in` | Bright start frame, no video fade-in |
| Text looks like subtitles | Proportional font in a background box | Press Start 2P with outlines |
| Text runs off frame | Press Start 2P is ~1 char per point of size | Shorten copy or `\N` |
| `ERR_MODULE_NOT_FOUND` in Node upload scripts | ESM ignores `NODE_PATH` | Run the script from the repo root |

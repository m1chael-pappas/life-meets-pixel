#!/usr/bin/env python3
"""Build a 1080x1920 vertical reel from ONE CONTINUOUS TAKE of an official trailer.

Read ../SKILL.md first. The short version of why this script looks like it does:

  * One take, never concatenated segments. Cutting between disjoint parts of a
    trailer hard-cuts the MUSIC as well as the scene and reads as broken.
  * Text is ASS subtitles, because this ffmpeg build has libass but no drawtext.
  * Loudness is two-pass, because single-pass loudnorm is dynamic and warbles the
    first second while it converges on a gain.
  * It verifies TIMESTAMPS and exits non-zero on a fault. Decoding audio to WAV
    hides timing faults completely, so a level check is not a substitute.

Usage:
    WORKDIR=/path/to/scratch python3 build_reel.py

Expects <WORKDIR>/trailer_norm.mp4 (see SKILL.md step 2) and
<WORKDIR>/PressStart2P.ttf. Writes <WORKDIR>/reel.mp4.
"""
import json, os, re, subprocess, imageio_ffmpeg

# ---------------------------------------------------------------- configure --
D = os.environ.get("WORKDIR", os.getcwd())
FF = imageio_ffmpeg.get_ffmpeg_exe()
SRC = f"{D}/trailer_norm.mp4"
CUT = f"{D}/take.mp4"
ASS = f"{D}/reel.ass"
OUT = f"{D}/reel.mp4"

# Pick START with the luma scan + contact sheet from SKILL.md step 3. It must be
# a bright frame (works as the thumbnail) and the window must contain none of the
# trailer's own marketing captions. 20-30s is the useful range.
START, TOTAL = 57.0, 23.0

# Beat copy. Press Start 2P advances ~1 char per point of size, so at these sizes:
# hook <=10 chars/line, headline <=16, lower line <=25, CTA <=18. Break with \\N.
SITE = "lifemeetspixel.com"
TITLE = "PATHOGENIC"
SCORE = "8.2 / 10"
BEATS = [
    # hook: \fad(0,...) via no_fade_in so it is fully drawn on frame 0
    dict(t0=0.0,  t1=3.8,  l1="CHECK THIS", l2="NEW GEM!",
         l1_fs=70, l2_fs=70, l1_y=312, l2_y=406, no_fade_in=True,
         low=TITLE, low_style="Title"),
    dict(t0=3.8,  t1=7.6,  l1="YOU ARE",     l2="THE DISEASE",
         low="you play the infection"),
    dict(t0=7.6,  t1=11.4, l1="KILL A CELL", l2="STEAL ITS ORGANS",
         low="120+ organelles to steal"),
    dict(t0=11.4, t1=15.2, l1="BOLT THEM",   l2="ONTO YOURSELF",
         low="no two runs the same"),
    # frame the flaw as a tease that resolves, never a flat negative
    dict(t0=15.2, t1=19.0, l1="THE CATCH?",  l2="THAT STAMINA BAR",
         low="rough for a few hours\\Nbut it gets better\\Nas you evolve", low_y=1430),
    # big pixel CTA: the URL is the conversion moment, so it gets its own size
    dict(t0=19.0, t1=TOTAL, l1="OUR SCORE:", l2=SCORE, l2_fs=96, l2_y=418,
         low=f"READ OUR FULL\\NREVIEW ON:\\N{{\\c&H6BFF6B&}}{SITE}",
         low_style="Cta", low_y=1440),
]
# ------------------------------------------------------------ end configure --


def ts(t):
    h = int(t // 3600); m = int((t % 3600) // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"


def pts_of(path, audio):
    r = subprocess.run(
        [FF, "-hide_banner", "-nostats", "-i", path, "-vn" if audio else "-an",
         "-af" if audio else "-vf", "ashowinfo" if audio else "showinfo",
         "-f", "null", "-"], capture_output=True, text=True)
    return [float(x) for x in re.findall(r"pts_time:([0-9.]+)", r.stderr)]


def check_pts(path, label, expect):
    good = True
    for audio in (True, False):
        p = pts_of(path, audio)
        kind = "audio" if audio else "video"
        gaps = [(round(p[i-1], 3), round(p[i], 3)) for i in range(1, len(p))
                if p[i] - p[i-1] > 0.06 or p[i] <= p[i-1]]
        span = p[-1] if p else 0
        ok = bool(p) and not gaps and p[0] < 0.05 and abs(span - expect) < 0.2
        print(f"  {label} {kind}: {len(p)}f 0..{span:.2f}s gaps={gaps[:2] or 'NONE'} "
              f"-> {'OK' if ok else 'BAD'}")
        good = good and ok
    return good


# --- step 1: cut ONE continuous take with clean timestamps --------------------
print(f"step 1: cutting single take at {START}s for {TOTAL}s")
subprocess.run([FF, "-hide_banner", "-loglevel", "error",
                "-ss", str(START), "-i", SRC, "-t", str(TOTAL),
                "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
                "-r", "30", "-g", "30", "-pix_fmt", "yuv420p",
                "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-ac", "2",
                "-avoid_negative_ts", "make_zero", "-reset_timestamps", "1",
                "-movflags", "+faststart", CUT, "-y"], check=True)
if not check_pts(CUT, "take", TOTAL):
    raise SystemExit("source take has bad timestamps")

# --- step 2: subtitles --------------------------------------------------------
header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Head,Press Start 2P,50,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,6,3,5,0,0,0,1
Style: Accent,Press Start 2P,50,&H006BFF6B,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,6,3,5,0,0,0,1
Style: Title,Press Start 2P,62,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,7,4,5,0,0,0,1
Style: Sub,Press Start 2P,36,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,6,3,5,0,0,0,1
Style: Cta,Press Start 2P,50,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,7,4,5,0,0,0,1
Style: Brand,Press Start 2P,20,&H50FFFFFF,&H000000FF,&H90000000,&H00000000,0,0,0,0,100,100,0,0,1,4,0,5,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

lines = []
for b in BEATS:
    fade = r"{\fad(0,200)}" if b.get("no_fade_in") else r"{\fad(200,200)}"
    o1 = f"{{\\fs{b['l1_fs']}}}" if b.get("l1_fs") else ""
    o2 = f"{{\\fs{b['l2_fs']}}}" if b.get("l2_fs") else ""
    y1, y2 = b.get("l1_y", 322), b.get("l2_y", 402)
    lines.append(f"Dialogue: 0,{ts(b['t0'])},{ts(b['t1'])},Head,,0,0,0,,{fade}{{\\pos(540,{y1})}}{o1}{b['l1']}")
    lines.append(f"Dialogue: 0,{ts(b['t0'])},{ts(b['t1'])},Accent,,0,0,0,,{fade}{{\\pos(540,{y2})}}{o2}{b['l2']}")
    lines.append(f"Dialogue: 0,{ts(b['t0'])},{ts(b['t1'])},{b.get('low_style','Sub')},,0,0,0,,"
                 f"{fade}{{\\pos(540,{b.get('low_y', 1412)})}}{b['low']}")
lines.append(f"Dialogue: 0,{ts(0)},{ts(TOTAL)},Brand,,0,0,0,,{{\\pos(540,1792)}}LIFE MEETS PIXEL")
open(ASS, "w", encoding="utf-8").write(header + "\n".join(lines) + "\n")

# --- step 3: measure loudness (two-pass; single-pass loudnorm warbles) --------
print("step 2: measuring loudness…")
mp = subprocess.run([FF, "-hide_banner", "-nostats", "-i", CUT,
                     "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json",
                     "-f", "null", "-"], capture_output=True, text=True)
m = json.loads(mp.stderr[mp.stderr.rindex("{"): mp.stderr.rindex("}") + 1])
print("  measured:", {k: m[k] for k in ("input_i", "input_tp", "input_lra")})
norm = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:"
        f"measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
        f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")

# --- step 4: render -----------------------------------------------------------
vf = (
    "[0:v]split=2[bg][fg];"
    "[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
    "gblur=sigma=40,eq=brightness=-0.30:saturation=1.15[bgb];"
    "[fg]scale=1080:-2[fgs];"
    "[bgb][fgs]overlay=x=0:y=(H-h)/2,format=yuv420p,setsar=1[vv];"
    f"[vv]ass='{ASS}':fontsdir='{D}',fade=t=out:st={TOTAL-0.6}:d=0.6[vout];"
    # single take: music runs unbroken, only a tail fade
    f"[0:a]{norm},afade=t=out:st={TOTAL-1.2}:d=1.2[aout]"
)
print("step 3: rendering…")
r = subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-stats", "-i", CUT,
                    "-filter_complex", vf, "-map", "[vout]", "-map", "[aout]",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "20",
                    "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", "30",
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                    "-movflags", "+faststart", OUT, "-y"],
                   capture_output=True, text=True)
if r.returncode:
    print("FFMPEG FAILED\n", r.stderr[-2500:])
    raise SystemExit(1)
print("  OK", os.path.getsize(OUT), "bytes")

# --- step 5: verify timestamps (levels alone cannot catch timing faults) ------
print("step 4: verifying…")
if not check_pts(OUT, "reel", TOTAL):
    raise SystemExit("TIMESTAMP FAULT - do not ship")
print("all checks passed")

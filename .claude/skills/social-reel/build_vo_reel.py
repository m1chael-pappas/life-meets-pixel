#!/usr/bin/env python3
"""VO-led reel builder. See SKILL.md section 4b for the format.

Copy this and `config.example.py` into a working directory, edit the config,
run it there. Expects <dir>/trailer_norm.mp4 (SKILL.md step 2), PressStart2P.ttf,
the Kokoro model files, and vo.json + vo_N.wav from the TTS step.

Timeline comes from the measured VO clip lengths plus an explicit silence after
each sentence, so the read has real pauses instead of running together.
"""
import json, os, re, subprocess, numpy as np, soundfile as sf, imageio_ffmpeg
from config import (TOTAL, BED_START, LEAD, GAPS, SEGS, CARD_GROUPS,
                    CHUNKS, SPOKEN, REVEAL_LINE, TITLE, SCORE, SITE)

D = os.path.dirname(os.path.abspath(__file__))
FF = imageio_ffmpeg.get_ffmpeg_exe()
SRC = f"{D}/trailer_norm.mp4"  # set by config if the source is named otherwise
OUT = f"{D}/reel.mp4"
ASS = f"{D}/reel.ass"
SR, FPS = 48000, 30
CAP_Y, CARD_Y = 1470, 300

VO = json.load(open(f"{D}/vo.json"))
t = LEAD
for v, gap in zip(VO, GAPS):
    v["t0"], v["t1"] = t, t + v["dur"]
    t = v["t1"] + gap
print(f"speech ends {VO[-1]['t1']:.2f}s, reel {TOTAL}s")
assert VO[-1]["t1"] < TOTAL, "VO overruns the reel"


def ts(x):
    return f"{int(x//3600)}:{int((x%3600)//60):02d}:{x%60:05.2f}"


def run(args):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode:
        print("FAILED:", " ".join(args[:8]), "\n", r.stderr[-2000:])
        raise SystemExit(1)
    return r


# --- 1. picture: one cut per idea, each to its own file first -----------------
print("step 1: cutting segments")
seg_files = []
for i, (t0, t1, src) in enumerate(SEGS):
    # frames from cumulative reel time so the concatenated total is exact
    nframes = int(round(t1 * FPS)) - int(round(t0 * FPS))
    f = f"{D}/seg{i}.mp4"
    run([FF, "-hide_banner", "-loglevel", "error", "-ss", str(src), "-i", SRC,
         "-frames:v", str(nframes), "-an",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-r", str(FPS),
         "-g", "30", "-pix_fmt", "yuv420p", "-avoid_negative_ts", "make_zero",
         "-reset_timestamps", "1", f, "-y"])
    seg_files.append(f)
    print(f"  seg{i} {t1-t0:5.2f}s ({nframes}f) from {src}s")
open(f"{D}/list.txt", "w").write("".join(f"file '{f}'\n" for f in seg_files))
run([FF, "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0",
     "-i", f"{D}/list.txt", "-c", "copy", f"{D}/picture.mp4", "-y"])

# --- 2. audio: continuous music bed + VO, mixed in numpy ----------------------
print("step 2: audio")
run([FF, "-hide_banner", "-loglevel", "error", "-ss", str(BED_START), "-i", SRC,
     "-t", str(TOTAL), "-vn", "-ac", "2", "-ar", str(SR), "-c:a", "pcm_s16le",
     f"{D}/bed_raw.wav", "-y"])
mp = subprocess.run([FF, "-hide_banner", "-nostats", "-i", f"{D}/bed_raw.wav",
                     "-af", "loudnorm=I=-17:TP=-1.5:LRA=11:print_format=json",
                     "-f", "null", "-"], capture_output=True, text=True)
m = json.loads(mp.stderr[mp.stderr.rindex("{"):mp.stderr.rindex("}") + 1])
run([FF, "-hide_banner", "-loglevel", "error", "-i", f"{D}/bed_raw.wav", "-af",
     f"loudnorm=I=-17:TP=-1.5:LRA=11:measured_I={m['input_i']}:"
     f"measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
     f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true",
     "-ac", "2", "-ar", str(SR), "-c:a", "pcm_s16le", f"{D}/bed.wav", "-y"])

N = int(round(TOTAL * SR))
bed, _ = sf.read(f"{D}/bed.wav", dtype="float32", always_2d=True)
bed = bed[:N] if len(bed) >= N else np.pad(bed, ((0, N - len(bed)), (0, 0)))

vo = np.zeros((N, 2), dtype=np.float32)
active = np.zeros(N, dtype=bool)
for v in VO:
    w, sr = sf.read(v["path"], dtype="float32", always_2d=True)
    if sr != SR:  # Kokoro renders at 24 kHz
        n_out = int(round(len(w) * SR / sr))
        w = np.stack([np.interp(np.arange(n_out) / SR, np.arange(len(w)) / sr, w[:, c])
                      for c in range(w.shape[1])], axis=1).astype(np.float32)
    if w.shape[1] == 1:
        w = np.repeat(w, 2, axis=1)
    a = int(round(v["t0"] * SR))
    b = min(a + len(w), N)
    vo[a:b] += w[:b - a]
    active[a:b] = True

# duck envelope: -9 dB under each line, 15 ms attack / 350 ms release
env = np.ones(N, dtype=np.float32)
target = np.where(active, 10 ** (-9 / 20), 1.0).astype(np.float32)
atk, rel = int(0.015 * SR), int(0.350 * SR)
cur = 1.0
for i in range(N):
    tv = target[i]
    step = (tv - cur) / (atk if tv < cur else rel)
    cur = tv if abs(tv - cur) < abs(step) else cur + step
    env[i] = cur

rms = lambda x: float(np.sqrt(np.mean(np.square(x)) + 1e-12))
bed_rms = rms(bed[active] * env[active, None])
vo_gain = bed_rms * 10 ** (15 / 20) / rms(vo[active])
print(f"  vo gain {vo_gain:.2f}")

fs, fl = int((TOTAL - 2.2) * SR), int(2.2 * SR)
music = bed * env[:, None]
music[fs:fs + fl] *= np.linspace(1, 0, fl, dtype=np.float32)[:, None]
music[fs + fl:] = 0
mix = music + vo * vo_gain
tail = int(0.12 * SR)
mix[-tail:] *= np.linspace(1, 0, tail, dtype=np.float32)[:, None]
peak = float(np.max(np.abs(mix)))
if peak > 0.98:
    mix *= 0.98 / peak
assert len(mix) == N, (len(mix), N)
sf.write(f"{D}/mix.wav", mix, SR)

# --- 3. subtitles -------------------------------------------------------------
print("step 3: subtitles")
header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Card,Press Start 2P,68,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,7,4,5,0,0,0,1
Style: Cap,Press Start 2P,44,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,6,3,5,0,0,0,1
Style: Title,Press Start 2P,76,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,8,4,5,0,0,0,1
Style: Score,Press Start 2P,40,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,6,3,5,0,0,0,1
Style: Cta,Press Start 2P,44,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,7,4,5,0,0,0,1
Style: Brand,Press Start 2P,20,&H50FFFFFF,&H000000FF,&H90000000,&H00000000,0,0,0,0,100,100,0,0,1,4,0,5,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev = []
POP = r"{\fscx72\fscy72\t(0,110,\fscx100\fscy100)}"
GREEN, WHITE = r"{\c&H6BFF6B&}", r"{\c&HFFFFFF&}"

# hook card, built line by line in time with the voice. First line is drawn on
# frame 0 so it works as the thumbnail.
# Hook cards. Each group builds line by line in time with the voice it rides,
# then clears when the next group starts, so a two-part opener does not end up
# with five lines stacked on screen at once. The very first line is drawn on
# frame 0 so it works as the thumbnail.
for gi, (li, lines) in enumerate(CARD_GROUPS):
    v = VO[li]
    weights = [len(spoken) for _, spoken in lines]
    starts, before = [], 0
    for w in weights:
        starts.append(v["t0"] + v["dur"] * before / sum(weights))
        before += w
    if gi == 0:
        starts[0] = 0.0
    if gi + 1 < len(CARD_GROUPS):
        group_end = VO[CARD_GROUPS[gi + 1][0]]["t0"]
    else:
        group_end = VO[li + 1]["t0"] - 0.10
    for i in range(len(lines)):
        txt = "\\N".join(
            (GREEN + POP + lines[k][0]) if k == i else (WHITE + lines[k][0])
            for k in range(i + 1))
        t1 = starts[i + 1] if i + 1 < len(lines) else group_end
        ev.append(f"Dialogue: 0,{ts(starts[i])},{ts(t1)},Card,,0,0,0,,"
                  f"{{\\an8}}{{\\pos(540,{CARD_Y})}}{txt}")

# bottom karaoke: one event per word-state, weighted by SPOKEN length
for idx, chunks in CHUNKS.items():
    v, spoken = VO[idx], SPOKEN[idx]
    cw = [len(s) for s in spoken]
    tcur = v["t0"]
    for ci, chunk in enumerate(chunks):
        cdur = v["dur"] * cw[ci] / sum(cw)
        words, swords = chunk.split(), spoken[ci].split()
        ww = [len(s) for s in swords] or [1]
        wt = tcur
        for wi, word in enumerate(words):
            wdur = cdur * ww[min(wi, len(ww) - 1)] / sum(ww)
            end = tcur + cdur if wi == len(words) - 1 else wt + wdur
            txt = " ".join((GREEN + POP + words[k]) if k == wi else (WHITE + words[k])
                           for k in range(wi + 1))
            ev.append(f"Dialogue: 0,{ts(wt)},{ts(end)},Cap,,0,0,0,,"
                      f"{{\\an8}}{{\\pos(540,{CAP_Y})}}{txt}")
            wt += wdur
        tcur += cdur

# reveal: the name lands for the first time, over the gameplay strip
rev = VO[REVEAL_LINE]["t0"]
ev += [
    f"Dialogue: 0,{ts(rev)},{ts(TOTAL)},Title,,0,0,0,,{{\\fad(150,0)}}{{\\pos(540,720)}}{TITLE}",
    f"Dialogue: 0,{ts(rev+0.45)},{ts(TOTAL)},Score,,0,0,0,,{{\\fad(150,0)}}{{\\pos(540,900)}}{SCORE}",
    f"Dialogue: 0,{ts(rev+0.9)},{ts(TOTAL)},Cta,,0,0,0,,{{\\fad(150,0)}}{{\\an8}}"
    f"{{\\pos(540,{CAP_Y})}}READ OUR FULL REVIEW\\N{GREEN}{SITE}",
    f"Dialogue: 0,{ts(0)},{ts(TOTAL)},Brand,,0,0,0,,{{\\pos(540,1792)}}LIFE MEETS PIXEL",
]
open(ASS, "w", encoding="utf-8").write(header + "\n".join(ev) + "\n")

# --- 4. render ----------------------------------------------------------------
print("step 4: rendering")
# Programme loudness as a constant gain applied here, NOT via the loudnorm
# filter in the render. linear=true is a constant gain by definition, but the
# filter also rewrites frame timestamps: on this build it shifted one PTS by
# 50ms near the end (30.635 -> 30.706) with the frame count unchanged, which
# the timestamp check correctly refuses to ship. Measuring and multiplying
# gives the identical gain with no timing involved.
mm = subprocess.run([FF, "-hide_banner", "-nostats", "-i", f"{D}/mix.wav",
                     "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json",
                     "-f", "null", "-"], capture_output=True, text=True)
mj = json.loads(mm.stderr[mm.stderr.rindex("{"):mm.stderr.rindex("}") + 1])
# Loudness, solved rather than guessed.
#
# The loudnorm FILTER is not used in the render: linear=true is a constant gain
# by definition, but it also rewrites timestamps, and on this build it shifted
# one PTS by 50ms near the end (30.635 -> 30.706) with the frame count
# unchanged, which the timestamp check correctly refuses to ship.
#
# Matching -14 LUFS by gain alone does not work either: this mix has a high
# crest factor, so reaching -14 puts the peak at 0.99 and hands the limiter 4 dB
# of work, which comes straight back off the programme loudness (-18.4 measured
# on the finished file). Peak-capping instead lands at -19.5, which is worse.
#
# So: normalise to unity peak, measure what the limiter actually produces, then
# solve for the gain. Post-limiter loudness moves ~0.8 LU per dB of gain here,
# measured across a 1.0 to 2.2 sweep. TARGET_LUFS matches the Big Walk reel so
# the two sit at the same level in feed.
TARGET_LUFS = -15.0
LIMITER = "alimiter=limit=0.72:attack=5:release=60:level=false"
SLOPE = 0.81  # LU of programme loudness per dB of input gain, post-limiter


def measure_limited(samples):
    sf.write(f"{D}/probe.wav", samples, SR)
    run([FF, "-i", f"{D}/probe.wav", "-af", LIMITER, "-c:a", "aac", "-b:a", "192k",
         "-ar", str(SR), f"{D}/probe.m4a", "-y", "-loglevel", "error"])
    r = subprocess.run([FF, "-hide_banner", "-nostats", "-i", f"{D}/probe.m4a",
                        "-af", "loudnorm=print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    j = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
    return float(j["input_i"]), float(j["input_tp"])


mix = mix / float(np.max(np.abs(mix)))
unity_lufs, _ = measure_limited(mix)
gain = 10 ** (((TARGET_LUFS - unity_lufs) / SLOPE) / 20)
mix = mix * gain
sf.write(f"{D}/mix.wav", mix, SR)
final_lufs, final_tp = measure_limited(mix)
print(f"  unity {unity_lufs:.2f} LUFS -> gain x{gain:.2f} -> {final_lufs:.2f} LUFS, "
      f"{final_tp:.2f} dBTP")
mix_norm = LIMITER

vf = ("[0:v]split=2[bg][fg];"
      "[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
      "gblur=sigma=40,eq=brightness=-0.18:saturation=1.25[bgb];"
      "[fg]scale=1600:-2,crop=1080:900[fgs];"
      "[bgb][fgs]overlay=x=0:y=420,format=yuv420p,setsar=1[vv];"
      f"[vv]ass='{ASS}':fontsdir='{D}',fade=t=out:st={TOTAL-0.5}:d=0.5[vout]")
run([FF, "-hide_banner", "-loglevel", "error", "-stats",
     "-i", f"{D}/picture.mp4", "-i", f"{D}/mix.wav",
     "-filter_complex", vf, "-map", "[vout]", "-map", "1:a", "-af", mix_norm,
     "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-profile:v", "high",
     "-pix_fmt", "yuv420p", "-r", str(FPS), "-c:a", "aac", "-b:a", "192k",
     "-ar", str(SR), "-movflags", "+faststart", OUT, "-y"])

# --- 5. verify timestamps -----------------------------------------------------
print("step 5: verifying")


def pts_of(path, audio):
    r = subprocess.run([FF, "-hide_banner", "-nostats", "-i", path,
                        "-vn" if audio else "-an", "-af" if audio else "-vf",
                        "ashowinfo" if audio else "showinfo", "-f", "null", "-"],
                       capture_output=True, text=True)
    return [float(x) for x in re.findall(r"pts_time:([0-9.]+)", r.stderr)]


ok = True
for audio in (True, False):
    p = pts_of(OUT, audio)
    gaps = [(round(p[i-1], 3), round(p[i], 3)) for i in range(1, len(p))
            if p[i] - p[i-1] > 0.06 or p[i] <= p[i-1]]
    span = p[-1] if p else 0
    good = bool(p) and not gaps and p[0] < 0.05 and abs(span - TOTAL) < 0.25
    print(f"  {'audio' if audio else 'video'}: {len(p)}f 0..{span:.2f}s "
          f"gaps={gaps[:2] or 'NONE'} -> {'OK' if good else 'BAD'}")
    ok = ok and good
if not ok:
    raise SystemExit("TIMESTAMP FAULT - do not ship")
print("  size", os.path.getsize(OUT), "bytes")
print("all checks passed")

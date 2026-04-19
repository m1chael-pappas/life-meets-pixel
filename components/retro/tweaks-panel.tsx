"use client";

import { useEffect, useState } from "react";

import { getSound } from "./sound-engine";

type Palette = "midnight" | "gameboy" | "amber" | "candy";

const PALETTES: Array<{ id: Palette; label: string }> = [
  { id: "midnight", label: "MIDNIGHT" },
  { id: "gameboy", label: "GAMEBOY" },
  { id: "amber", label: "AMBER" },
  { id: "candy", label: "CANDY" },
];

const LS_PALETTE = "lmp_palette";
const LS_SCANLINES = "lmp_scanlines";

export function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState<Palette>("midnight");
  const [scanlines, setScanlines] = useState(false);
  const [muted, setMuted] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const p = (localStorage.getItem(LS_PALETTE) as Palette) || "midnight";
    const s = localStorage.getItem(LS_SCANLINES) === "on";
    setPalette(p);
    setScanlines(s);
    document.documentElement.dataset.palette = p;
    document.body.dataset.scanlines = s ? "on" : "off";
    setMuted(getSound().isMuted());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.palette = palette;
    localStorage.setItem(LS_PALETTE, palette);
  }, [palette, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.body.dataset.scanlines = scanlines ? "on" : "off";
    localStorage.setItem(LS_SCANLINES, scanlines ? "on" : "off");
  }, [scanlines, mounted]);

  const sound = getSound();

  function handleUnmute() {
    sound.setMuted(false);
    setMuted(false);
    sound.powerup();
  }

  function handleMute() {
    sound.setMuted(true);
    setMuted(true);
  }

  if (!open) {
    return (
      <button
        type="button"
        className="tweaks-btn"
        onClick={() => {
          sound.click();
          setOpen(true);
        }}
        onMouseEnter={() => sound.hover()}
        aria-label="Open display tweaks"
      >
        ► TWEAKS
      </button>
    );
  }

  return (
    <div className="tweaks" role="dialog" aria-label="Display tweaks">
      <div className="tweaks__head">
        <span>► TWEAKS</span>
        <button
          type="button"
          className="x"
          onClick={() => {
            sound.click();
            setOpen(false);
          }}
          aria-label="Close tweaks"
        >
          [X]
        </button>
      </div>

      <div className="tweaks__row">
        <label>PALETTE</label>
        <div className="tweaks__opts">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`tweaks__opt ${palette === p.id ? "is-on" : ""}`}
              onClick={() => {
                sound.select();
                setPalette(p.id);
              }}
              onMouseEnter={() => sound.hover()}
              aria-pressed={palette === p.id}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tweaks__row">
        <label>SCANLINES</label>
        <div className="tweaks__opts">
          <button
            type="button"
            className={`tweaks__opt ${scanlines ? "is-on" : ""}`}
            onClick={() => {
              sound.click();
              setScanlines(true);
            }}
            aria-pressed={scanlines}
          >
            ON
          </button>
          <button
            type="button"
            className={`tweaks__opt ${!scanlines ? "is-on" : ""}`}
            onClick={() => {
              sound.click();
              setScanlines(false);
            }}
            aria-pressed={!scanlines}
          >
            OFF
          </button>
        </div>
      </div>

      <div className="tweaks__row">
        <label>SOUND</label>
        <div className="tweaks__opts">
          <button
            type="button"
            className={`tweaks__opt ${!muted ? "is-on" : ""}`}
            onClick={handleUnmute}
            aria-pressed={!muted}
          >
            ON
          </button>
          <button
            type="button"
            className={`tweaks__opt ${muted ? "is-on" : ""}`}
            onClick={handleMute}
            aria-pressed={muted}
          >
            OFF
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 8,
          background: "var(--bg-2)",
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 10,
          color: "var(--ink-mute)",
          lineHeight: 1.5,
        }}
      >
        TIP: try the Konami code
        <br />
        ↑↑↓↓←→←→ B A
      </div>
    </div>
  );
}

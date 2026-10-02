"use client";

import { useEffect, useState } from "react";

import { getSound } from "./sound-engine";

type Palette = "midnight" | "amber" | "candy";

const PALETTES: Array<{ id: Palette; label: string }> = [
  { id: "midnight", label: "MIDNIGHT" },
  { id: "amber", label: "AMBER" },
  { id: "candy", label: "CANDY" },
];

const LS_PALETTE = "lmp_palette";
const LS_SCANLINES = "lmp_scanlines";

/** Saved palette when it is still offered; otherwise `midnight`, as on the server. */
function readPalette(): Palette {
  if (typeof window === "undefined") return "midnight";
  const saved = localStorage.getItem(LS_PALETTE);
  return PALETTES.find((p) => p.id === saved)?.id ?? "midnight";
}

/** Saved scanline preference; `false` on the server. */
function readScanlines(): boolean {
  return typeof window !== "undefined" && localStorage.getItem(LS_SCANLINES) === "on";
}

export function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState<Palette>(readPalette);
  const [scanlines, setScanlines] = useState(readScanlines);
  const [muted, setMuted] = useState(() => typeof window === "undefined" || getSound().isMuted());

  useEffect(() => {
    document.documentElement.dataset.palette = palette;
    localStorage.setItem(LS_PALETTE, palette);
  }, [palette]);

  useEffect(() => {
    document.body.dataset.scanlines = scanlines ? "on" : "off";
    localStorage.setItem(LS_SCANLINES, scanlines ? "on" : "off");
  }, [scanlines]);

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

  return (
    <>
      <button
        type="button"
        className="tweaks-btn"
        onClick={() => {
          sound.click();
          setOpen((o) => !o);
        }}
        onMouseEnter={() => sound.hover()}
        aria-expanded={open}
        aria-controls="tweaks-panel"
      >
        ► TWEAKS
      </button>
      {open && (
        <div id="tweaks-panel" className="tweaks" role="dialog" aria-label="Display tweaks">
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
              fontSize: 11,
              color: "var(--ink-mute)",
              lineHeight: 1.5,
            }}
          >
            TIP: try the Konami code
            <br />
            ↑↑↓↓←→←→ B A
          </div>
        </div>
      )}
    </>
  );
}

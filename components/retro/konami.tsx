"use client";

import { useEffect, useRef, useState } from "react";

import { getSound } from "./sound-engine";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiEasterEgg() {
  const [shown, setShown] = useState(false);
  const buffer = useRef<string[]>([]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ignore when typing into an input/textarea so the form doesn't trigger the easter egg.
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer.current.push(k);
      if (buffer.current.length > SEQUENCE.length) buffer.current.shift();
      if (SEQUENCE.every((s, i) => buffer.current[i] === s)) {
        const sound = getSound();
        // Auto-unmute sounds + flip scanlines on as a reward
        sound.setMuted(false);
        sound.powerup();
        document.body.dataset.scanlines = "on";
        try {
          localStorage.setItem("lmp_scanlines", "on");
        } catch {
          // ignore
        }
        setShown(true);
        buffer.current = [];
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!shown) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cheat code accepted"
      onClick={() => setShown(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.85)",
        zIndex: 10001,
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-1)",
          border: "4px solid var(--neon-3)",
          padding: 32,
          textAlign: "center",
          maxWidth: 480,
          boxShadow: "8px 8px 0 #000",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-press-start-2p)",
            fontSize: 18,
            color: "var(--neon-3)",
            marginBottom: 12,
          }}
        >
          ★ CHEAT CODE ACCEPTED ★
        </h2>
        <div
          style={{
            fontFamily: "var(--font-press-start-2p)",
            fontSize: 48,
            color: "var(--neon-1)",
            margin: "16px 0",
            animation: "blink 0.6s steps(2) infinite",
          }}
        >
          +30 LIVES
        </div>
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 14,
            color: "var(--ink-dim)",
            marginBottom: 16,
          }}
        >
          You&apos;ve unlocked the secret. CRT scanlines are now on. Sound effects too.
          Welcome to the inner circle.
        </p>
        <button
          type="button"
          className="retro-btn retro-btn--lime"
          onClick={() => setShown(false)}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}

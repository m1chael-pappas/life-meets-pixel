"use client";

type LmpSound = {
  setMuted: (m: boolean) => void;
  isMuted: () => boolean;
  init: () => void;
  hover: () => void;
  click: () => void;
  select: () => void;
  powerup: () => void;
};

const LS_KEY = "lmp_muted";

function createEngine(): LmpSound {
  let ctx: AudioContext | null = null;
  let muted = true;

  function ensure() {
    if (ctx || typeof window === "undefined") return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) ctx = new AC();
  }

  function beep(freq = 440, dur = 0.06, type: OscillatorType = "square", vol = 0.05) {
    if (muted) return;
    ensure();
    if (!ctx) return;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = vol;
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.stop(ctx.currentTime + dur + 0.01);
  }

  return {
    setMuted(m) {
      muted = m;
      if (typeof window !== "undefined") {
        localStorage.setItem(LS_KEY, m ? "1" : "0");
      }
    },
    isMuted: () => muted,
    init() {
      if (typeof window === "undefined") return;
      muted = localStorage.getItem(LS_KEY) !== "0";
    },
    hover: () => beep(880, 0.03, "square", 0.02),
    click: () => beep(660, 0.06, "square", 0.04),
    select() {
      beep(880, 0.05);
      setTimeout(() => beep(1320, 0.06), 50);
    },
    powerup() {
      [523, 659, 784, 1047].forEach((f, i) =>
        setTimeout(() => beep(f, 0.08, "square", 0.05), i * 60),
      );
    },
  };
}

// Lazy singleton — only constructed on the client
let engine: LmpSound | null = null;

export function getSound(): LmpSound {
  if (typeof window === "undefined") {
    return {
      setMuted: () => {},
      isMuted: () => true,
      init: () => {},
      hover: () => {},
      click: () => {},
      select: () => {},
      powerup: () => {},
    };
  }
  if (!engine) {
    engine = createEngine();
    engine.init();
  }
  return engine;
}

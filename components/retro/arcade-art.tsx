import { Fragment, type CSSProperties, type SVGProps } from "react";

type ArtProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children">;

/**
 * Left side bearing of the Press Start 2P glyphs that do not start at the
 * edge of their cell, in eighths of an em.
 */
const LEFT_BEARING: Record<string, number> = { I: 1, L: 1, T: 1, Y: 1, "1": 1, "-": 1, '"': 1, "'": 2, ":": 2, "(": 2, "!": 2 };

/**
 * The words of an `.extruded-title`, one `.extruded-word` each. `data-text`
 * feeds the word's gradient face, and `--bearing` pulls a word whose first
 * glyph has a left side bearing back to the cell edge.
 */
export function MarqueeWords({ text }: { text: string }) {
  return text
    .trim()
    .split(/\s+/)
    .map((word, i) => {
      const bearing = LEFT_BEARING[word.charAt(0).toUpperCase()];
      return (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="extruded-word" data-text={word} style={bearing ? ({ "--bearing": bearing } as CSSProperties) : undefined}>
            {word}
          </span>
        </Fragment>
      );
    });
}

/**
 * The LMP arcade cabinet mascot, sword raised in its left hand. Source art:
 * `public/art/cab-arcade-boss.svg`; the sword replaces the source's pointing
 * hand.
 *
 * Decorative (`aria-hidden`). Colours are palette tokens (`--pop-*` accents, `--art-paper`,
 * `--art-shade`), except the `#fff` glints. Sized by CSS width; height follows the 470:530 viewBox.
 */
export function CabArcadeBoss(props: ArtProps) {
  return (
    <svg viewBox="-40 0 470 530" aria-hidden="true" focusable="false" {...props}>
      <path d="M150 440 C148 470 138 480 126 494 M250 440 C252 470 262 480 276 494" fill="none" stroke="var(--art-paper)" strokeWidth={24} strokeLinecap="round" />
      <path d="M150 440 C148 470 138 480 126 494 M250 440 C252 470 262 480 276 494" fill="none" stroke="var(--shadow-hard)" strokeWidth={15} strokeLinecap="round" />
      <ellipse cx="112" cy="500" rx="44" ry="18" fill="var(--shadow-hard)" stroke="var(--art-paper)" strokeWidth={5} />
      <ellipse cx="292" cy="500" rx="44" ry="18" fill="var(--shadow-hard)" stroke="var(--art-paper)" strokeWidth={5} />
      <path d="M98 250 C50 240 30 200 18 172 M338 250 C380 236 396 196 382 150" fill="none" stroke="var(--art-paper)" strokeWidth={24} strokeLinecap="round" />
      <path d="M98 250 C50 240 30 200 18 172 M338 250 C380 236 396 196 382 150" fill="none" stroke="var(--shadow-hard)" strokeWidth={15} strokeLinecap="round" />
      <path d="M90 60 L310 60 L346 80 L340 140 L340 440 L300 454 L100 454 L100 342 L70 342 L100 300 L100 120 L82 120 Z" fill="none" stroke="var(--art-paper)" strokeWidth={14} strokeLinejoin="round" />
      <path d="M300 120 L340 140 L340 440 L300 454 Z" fill="var(--art-shade)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M100 120 L300 120 L300 454 L100 454 Z" fill="var(--bg-3)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M112 130 L112 444" stroke="var(--pop-2)" strokeWidth={4} opacity={0.6} />
      <path d="M310 60 L346 80 L340 140 L318 120 Z" fill="var(--neon-4-deep)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M90 60 L310 60 L318 120 L82 120 Z" fill="var(--pop-4)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <text x="200" y="104" textAnchor="middle" fontFamily="var(--font-press-start-2p), monospace" fontSize={28} fill="var(--on-accent)">
        LMP
      </text>
      <rect x="120" y="138" width="160" height="146" rx="18" fill="var(--art-shade)" stroke="var(--shadow-hard)" strokeWidth={6} />
      <rect x="132" y="150" width="136" height="122" rx="14" fill="var(--pop-2)" />
      <path d="M136 170 H264 M136 186 H264 M136 202 H264 M136 218 H264 M136 234 H264 M136 250 H264" stroke="var(--neon-2-deep)" strokeWidth={2} opacity={0.5} />
      <path d="M144 160 L166 160 L144 190 Z" fill="#fff" opacity={0.6} />
      <path d="M150 176 L184 190 M250 176 L216 190" stroke="var(--on-accent)" strokeWidth={8} strokeLinecap="round" />
      <ellipse cx="172" cy="206" rx="11" ry="16" fill="var(--on-accent)" />
      <ellipse cx="228" cy="206" rx="11" ry="16" fill="var(--on-accent)" />
      <path d="M172 206 L178 192 L182 199 Z M228 206 L234 192 L238 199 Z" fill="#fff" />
      <path d="M150 228 L250 228 Q248 264 200 266 Q152 264 150 228 Z" fill="var(--on-accent)" />
      <path d="M156 229 H244 V240 H156 Z" fill="var(--art-paper)" />
      <path d="M178 229 V240 M200 229 V240 M222 229 V240" stroke="var(--on-accent)" strokeWidth={2.5} />
      <path d="M176 256 Q200 242 224 256 Q200 266 176 256 Z" fill="var(--pop-1)" />
      <path d="M100 300 L300 300 L330 342 L70 342 Z" fill="var(--bg-2)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M144 322 L144 284" stroke="var(--shadow-hard)" strokeWidth={7} strokeLinecap="round" />
      <circle cx="144" cy="280" r="13" fill="var(--pop-1)" stroke="var(--shadow-hard)" strokeWidth={5} />
      <ellipse cx="144" cy="324" rx="18" ry="6" fill="var(--shadow-hard)" />
      <circle cx="226" cy="320" r="10" fill="var(--pop-1)" stroke="var(--shadow-hard)" strokeWidth={4} />
      <circle cx="256" cy="324" r="10" fill="var(--pop-3)" stroke="var(--shadow-hard)" strokeWidth={4} />
      <circle cx="286" cy="320" r="10" fill="var(--pop-4)" stroke="var(--shadow-hard)" strokeWidth={4} />
      <rect x="166" y="370" width="68" height="56" fill="var(--bg-1)" stroke="var(--shadow-hard)" strokeWidth={5} />
      <rect x="182" y="386" width="12" height="20" fill="var(--pop-4)" stroke="var(--shadow-hard)" strokeWidth={3} />
      <rect x="206" y="386" width="12" height="20" fill="var(--pop-4)" stroke="var(--shadow-hard)" strokeWidth={3} />
      <g transform="rotate(8 14 172)">
        <path d="M2 142 L2 34 L14 12 L26 34 L26 142 Z" fill="var(--art-paper)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
        <path d="M14 34 L14 134" stroke="var(--pop-2)" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
        <path d="M14 152 L14 204" stroke="var(--shadow-hard)" strokeWidth={18} strokeLinecap="round" />
        <path d="M14 152 L14 204" stroke="var(--pop-1)" strokeWidth={8} strokeLinecap="round" />
        <circle cx="14" cy="212" r="9" fill="var(--pop-4)" stroke="var(--shadow-hard)" strokeWidth={5} />
        <rect x="-16" y="138" width="60" height="14" rx="4" fill="var(--pop-4)" stroke="var(--shadow-hard)" strokeWidth={6} />
        <circle cx="14" cy="178" r="22" fill="var(--art-paper)" stroke="var(--shadow-hard)" strokeWidth={6} />
        <path d="M1 170 H27 M0 179 H28 M2 188 H26" stroke="var(--shadow-hard)" strokeWidth={4} strokeLinecap="round" />
      </g>
      <circle cx="382" cy="138" r="24" fill="var(--art-paper)" stroke="var(--shadow-hard)" strokeWidth={6} />
      <path d="M370 128 H394 M370 138 H394 M372 148 H392" stroke="var(--shadow-hard)" strokeWidth={4} strokeLinecap="round" />
      <path d="M400 100 Q412 92 418 104 M404 84 Q420 70 430 86" fill="none" stroke="var(--pop-4)" strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}

/**
 * 36-point score starburst with an `--art-shade` disc in the middle. Source art:
 * `public/art/score-starburst.svg`, cropped to a 200x200 viewBox so the disc
 * is centred. Decorative (`aria-hidden`).
 */
export function ScoreStarburst(props: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M100.0,4.0 L112.8,27.1 L132.8,9.8 L137.0,35.9 L161.7,26.5 L156.7,52.4 L183.1,52.0 L169.5,74.7 L194.5,83.3 L174.0,100.0 L194.5,116.7 L169.5,125.3 L183.1,148.0 L156.7,147.6 L161.7,173.5 L137.0,164.1 L132.8,190.2 L112.8,172.9 L100.0,196.0 L87.2,172.9 L67.2,190.2 L63.0,164.1 L38.3,173.5 L43.3,147.6 L16.9,148.0 L30.5,125.3 L5.5,116.7 L26.0,100.0 L5.5,83.3 L30.5,74.7 L16.9,52.0 L43.3,52.4 L38.3,26.5 L63.0,35.9 L67.2,9.8 L87.2,27.1 Z"
        fill="var(--pop-3)"
        stroke="var(--shadow-hard)"
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <circle cx="100" cy="100" r="66" fill="var(--art-shade)" stroke="var(--shadow-hard)" strokeWidth={4} />
    </svg>
  );
}

/** Outline of the four-point twinkle, in a 40x40 box. */
const TWINKLE_PATH = "M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z";

/**
 * Four-point twinkle in `--pop-4`. Source art: `public/art/twinkle-star.svg`,
 * cropped to a 40x40 viewBox. Decorative (`aria-hidden`).
 */
export function TwinkleStar(props: ArtProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" {...props}>
      <path
        d={TWINKLE_PATH}
        fill="var(--pop-4)"
        stroke="var(--shadow-hard)"
        strokeWidth={3}
      />
    </svg>
  );
}

/**
 * Fourteen-ray sunburst centred in a square viewBox, filled with
 * `currentColor`. Source art: `public/art/sunburst.svg`. Decorative
 * (`aria-hidden`).
 */
export function Sunburst(props: ArtProps) {
  return (
    <svg viewBox="-800 -800 1600 1600" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M0,0L1100,0L1072,245ZM0,0L991,477L860,686ZM0,0L686,860L477,991ZM0,0L245,1072L0,1100ZM0,0L-245,1072L-477,991ZM0,0L-686,860L-860,686ZM0,0L-991,477L-1072,245ZM0,0L-1100,0L-1072,-245ZM0,0L-991,-477L-860,-686ZM0,0L-686,-860L-477,-991ZM0,0L-245,-1072L-0,-1100ZM0,0L245,-1072L477,-991ZM0,0L686,-860L860,-686ZM0,0L991,-477L1072,-245Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * The waving P2 heart. Source art: `public/art/heart-waving.svg` in the dark
 * body, `--pop-2` highlight and light face of
 * `public/art/heart-p2-controller.svg`, without the controller. Decorative
 * (`aria-hidden`). Sized by CSS width; height follows the 230:270 viewBox.
 */
export function HeartPlayerTwo(props: ArtProps) {
  return (
    <svg viewBox="0 0 230 270" aria-hidden="true" focusable="false" {...props}>
      <path d="M95 158 C92 190 86 205 80 236 M125 158 C130 190 136 205 142 236" fill="none" stroke="var(--art-paper)" strokeWidth={17} strokeLinecap="round" />
      <path d="M95 158 C92 190 86 205 80 236 M125 158 C130 190 136 205 142 236" fill="none" stroke="var(--shadow-hard)" strokeWidth={10} strokeLinecap="round" />
      <ellipse cx="70" cy="240" rx="22" ry="11" fill="var(--shadow-hard)" stroke="var(--art-paper)" strokeWidth={3.5} />
      <ellipse cx="152" cy="240" rx="22" ry="11" fill="var(--shadow-hard)" stroke="var(--art-paper)" strokeWidth={3.5} />
      <path d="M44 92 C18 86 10 58 22 38 M176 96 C196 112 196 130 180 140" fill="none" stroke="var(--art-paper)" strokeWidth={17} strokeLinecap="round" />
      <path d="M44 92 C18 86 10 58 22 38 M176 96 C196 112 196 130 180 140" fill="none" stroke="var(--shadow-hard)" strokeWidth={10} strokeLinecap="round" />
      <circle cx="23" cy="26" r="16" fill="var(--art-paper)" stroke="var(--shadow-hard)" strokeWidth={5} />
      <path d="M17 18 L17 28 M24 15 L24 27 M31 19 L30 28" stroke="var(--shadow-hard)" strokeWidth={3} strokeLinecap="round" />
      <circle cx="176" cy="146" r="14" fill="var(--art-paper)" stroke="var(--shadow-hard)" strokeWidth={5} />
      <path d="M110 170 C50 125 28 95 36 66 C44 36 82 30 110 58 C138 30 176 36 184 66 C192 95 170 125 110 170 Z" fill="none" stroke="var(--art-paper)" strokeWidth={14} strokeLinejoin="round" />
      <path d="M110 170 C50 125 28 95 36 66 C44 36 82 30 110 58 C138 30 176 36 184 66 C192 95 170 125 110 170 Z" fill="var(--art-shade)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M52 66 Q55 50 71 45" fill="none" stroke="var(--pop-2)" strokeWidth={5} strokeLinecap="round" />
      <ellipse cx="92" cy="88" rx="9" ry="15" fill="var(--art-paper)" />
      <ellipse cx="128" cy="88" rx="9" ry="15" fill="var(--art-paper)" />
      <path d="M92 88 L98 74 L102 81 Z M128 88 L134 74 L138 81 Z" fill="var(--art-shade)" />
      <path d="M88 110 Q110 140 132 110 Q110 121 88 110 Z" fill="var(--art-paper)" />
    </svg>
  );
}

/**
 * Smiling cloud in `--art-paper` with `--pop-1` cheeks. Source art:
 * `public/art/cloud-smiling.svg`, cropped to its outline. Decorative
 * (`aria-hidden`). Height follows the 190:92 viewBox.
 */
export function SmilingCloud(props: ArtProps) {
  return (
    <svg viewBox="8 4 190 92" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M30 90 Q10 90 12 70 Q14 52 34 54 Q36 28 64 30 Q76 8 104 14 Q128 4 144 26 Q172 22 176 48 Q196 52 192 74 Q190 92 170 90 Z"
        fill="var(--art-paper)"
        stroke="var(--shadow-hard)"
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path d="M80 58 Q88 50 96 58 M116 58 Q124 50 132 58 M94 70 Q106 82 118 70" fill="none" stroke="var(--shadow-hard)" strokeWidth={5} strokeLinecap="round" />
      <circle cx="74" cy="72" r="6" fill="color-mix(in srgb, var(--pop-1) 55%, var(--art-paper))" />
      <circle cx="138" cy="72" r="6" fill="color-mix(in srgb, var(--pop-1) 55%, var(--art-paper))" />
    </svg>
  );
}

/**
 * Smiling hill in `--pop-3`. Source art: `public/art/hill-smiling.svg`.
 * Carries a calm face and a surprised face (`.hill-face--calm`,
 * `.hill-face--surprised`); CSS shows one. Decorative (`aria-hidden`). Height follows the 400:220 viewBox; the base
 * sits on the bottom edge.
 */
export function SmilingHill(props: ArtProps) {
  return (
    <svg viewBox="0 0 400 220" aria-hidden="true" focusable="false" {...props}>
      <path className="hill-body" d="M10 223 Q60 30 200 30 Q340 30 390 223 Z" fill="var(--pop-3)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M60 150 Q90 60 170 50" fill="none" stroke="color-mix(in srgb, var(--pop-3) 45%, var(--art-paper))" strokeWidth={10} strokeLinecap="round" />
      <path className="hill-face hill-face--calm" d="M160 110 Q172 98 184 110 M216 110 Q228 98 240 110 M176 136 Q200 158 224 136" fill="none" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinecap="round" />
      <g className="hill-face hill-face--surprised">
        <path d="M158 88 Q172 78 186 88 M214 88 Q228 78 242 88" fill="none" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinecap="round" />
        <circle cx="172" cy="110" r="11" fill="var(--shadow-hard)" />
        <circle cx="228" cy="110" r="11" fill="var(--shadow-hard)" />
        <path d="M172 110 L178 100 L181 106 Z M228 110 L234 100 L237 106 Z" fill="#fff" />
        <ellipse cx="200" cy="148" rx="11" ry="14" fill="var(--shadow-hard)" />
      </g>
      <circle cx="160" cy="134" r="8" fill="var(--neon-3-deep)" />
      <circle cx="240" cy="134" r="8" fill="var(--neon-3-deep)" />
    </svg>
  );
}

/**
 * Smiling gamepad: the body, face, d-pad and buttons of
 * `public/art/pad-gamepad-running.svg` in a 224x172 viewBox, with a right arm
 * and two twinkles that only show during its wave loop. The loop is CSS
 * (`.pad-*` in globals.css): the body pulses, the pad leans, the arm slides
 * out and waves, the eyes squint and the twinkles rise. The arm and twinkles
 * draw outside the viewBox, so the element needs `overflow: visible`.
 * Decorative (`aria-hidden`).
 */
export function SmilingGamepad(props: ArtProps) {
  return (
    <svg viewBox="0 0 224 172" aria-hidden="true" focusable="false" {...props}>
      <g className="pad-spark pad-spark--left">
        <path d={TWINKLE_PATH} transform="translate(-20 -20)" fill="var(--pop-4)" stroke="var(--shadow-hard)" strokeWidth={3} />
      </g>
      <g className="pad-spark pad-spark--right">
        <path d={TWINKLE_PATH} transform="translate(-20 -20)" fill="var(--pop-4)" stroke="var(--shadow-hard)" strokeWidth={3} />
      </g>
      <g className="pad-lean">
        <g className="pad-arm">
          <path d="M198 60 V90" fill="none" stroke="var(--art-paper)" strokeWidth={20} strokeLinecap="round" />
          <path d="M198 60 V90" fill="none" stroke="var(--shadow-hard)" strokeWidth={12} strokeLinecap="round" />
          <circle cx="198" cy="99" r="18" fill="var(--art-paper)" stroke="var(--shadow-hard)" strokeWidth={6} />
        </g>
        <g className="pad-body">
          <g transform="translate(-38 -90)">
            <path
              d="M64 136 C64 104 96 98 124 104 L176 104 C204 98 236 104 236 136 L248 214 C254 246 226 258 206 236 L188 216 L112 216 L94 236 C74 258 46 246 52 214 Z"
              fill="var(--art-paper)"
              stroke="var(--shadow-hard)"
              strokeWidth={8}
              strokeLinejoin="round"
            />
            <g className="pad-face">
              <g className="pad-eyes">
                <ellipse cx="136" cy="142" rx="12" ry="21" fill="var(--shadow-hard)" />
                <ellipse cx="172" cy="142" rx="12" ry="21" fill="var(--shadow-hard)" />
                <path d="M136 142 L144 123 L149 133 Z M172 142 L180 123 L185 133 Z" fill="#fff" />
              </g>
              <path d="M124 172 Q154 206 184 172 Q154 184 124 172 Z" fill="var(--shadow-hard)" />
            </g>
            <rect x="75" y="188" width="22" height="7" fill="var(--pop-2)" stroke="var(--shadow-hard)" strokeWidth={2} />
            <rect x="82.5" y="180.5" width="7" height="22" fill="var(--pop-2)" stroke="var(--shadow-hard)" strokeWidth={2} />
            <circle cx="212" cy="186" r="7" fill="var(--pop-1)" stroke="var(--shadow-hard)" strokeWidth={3} />
            <circle cx="226" cy="200" r="7" fill="var(--pop-3)" stroke="var(--shadow-hard)" strokeWidth={3} />
          </g>
        </g>
      </g>
    </svg>
  );
}

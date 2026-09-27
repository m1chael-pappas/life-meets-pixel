import type { SVGProps } from "react";

type ArtProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children">;

/**
 * The LMP arcade cabinet mascot. Source art: `public/art/cab-arcade-boss.svg`.
 *
 * Decorative (`aria-hidden`). Colours are palette tokens, except the `#fff`
 * glints. Sized by CSS width; height follows the 470:530 viewBox.
 */
export function CabArcadeBoss(props: ArtProps) {
  return (
    <svg viewBox="-40 0 470 530" aria-hidden="true" focusable="false" {...props}>
      <path d="M150 440 C148 470 138 480 126 494 M250 440 C252 470 262 480 276 494" fill="none" stroke="var(--ink)" strokeWidth={24} strokeLinecap="round" />
      <path d="M150 440 C148 470 138 480 126 494 M250 440 C252 470 262 480 276 494" fill="none" stroke="var(--shadow-hard)" strokeWidth={15} strokeLinecap="round" />
      <ellipse cx="112" cy="500" rx="44" ry="18" fill="var(--shadow-hard)" stroke="var(--ink)" strokeWidth={5} />
      <ellipse cx="292" cy="500" rx="44" ry="18" fill="var(--shadow-hard)" stroke="var(--ink)" strokeWidth={5} />
      <path d="M98 250 C50 240 30 200 18 172 M338 250 C380 236 396 196 382 150" fill="none" stroke="var(--ink)" strokeWidth={24} strokeLinecap="round" />
      <path d="M98 250 C50 240 30 200 18 172 M338 250 C380 236 396 196 382 150" fill="none" stroke="var(--shadow-hard)" strokeWidth={15} strokeLinecap="round" />
      <path d="M90 60 L346 80 L340 440 L300 456 L96 456 L70 340 L100 300 L100 120 L82 120 Z" fill="none" stroke="var(--ink)" strokeWidth={14} strokeLinejoin="round" />
      <path d="M300 120 L340 140 L340 440 L300 454 Z" fill="var(--bg-0)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M100 120 L300 120 L300 454 L100 454 Z" fill="var(--bg-3)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M112 130 L112 444" stroke="var(--neon-2)" strokeWidth={4} opacity={0.6} />
      <path d="M310 60 L346 80 L340 140 L318 120 Z" fill="var(--neon-4-deep)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M90 60 L310 60 L318 120 L82 120 Z" fill="var(--neon-4)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <text x="200" y="104" textAnchor="middle" fontFamily="var(--font-press-start-2p), monospace" fontSize={28} fill="var(--on-accent)">
        LMP
      </text>
      <rect x="120" y="138" width="160" height="146" rx="18" fill="var(--bg-0)" stroke="var(--shadow-hard)" strokeWidth={6} />
      <rect x="132" y="150" width="136" height="122" rx="14" fill="var(--neon-2)" />
      <path d="M136 170 H264 M136 186 H264 M136 202 H264 M136 218 H264 M136 234 H264 M136 250 H264" stroke="var(--neon-2-deep)" strokeWidth={2} opacity={0.5} />
      <path d="M144 160 L166 160 L144 190 Z" fill="#fff" opacity={0.6} />
      <path d="M150 176 L184 190 M250 176 L216 190" stroke="var(--on-accent)" strokeWidth={8} strokeLinecap="round" />
      <ellipse cx="172" cy="206" rx="11" ry="16" fill="var(--on-accent)" />
      <ellipse cx="228" cy="206" rx="11" ry="16" fill="var(--on-accent)" />
      <path d="M172 206 L178 192 L182 199 Z M228 206 L234 192 L238 199 Z" fill="#fff" />
      <path d="M150 228 L250 228 Q248 264 200 266 Q152 264 150 228 Z" fill="var(--on-accent)" />
      <path d="M156 229 H244 V240 H156 Z" fill="var(--ink)" />
      <path d="M178 229 V240 M200 229 V240 M222 229 V240" stroke="var(--on-accent)" strokeWidth={2.5} />
      <path d="M176 256 Q200 242 224 256 Q200 266 176 256 Z" fill="var(--neon-1)" />
      <path d="M100 300 L300 300 L330 342 L70 342 Z" fill="var(--bg-2)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M144 322 L144 284" stroke="var(--shadow-hard)" strokeWidth={7} strokeLinecap="round" />
      <circle cx="144" cy="280" r="13" fill="var(--neon-1)" stroke="var(--shadow-hard)" strokeWidth={5} />
      <ellipse cx="144" cy="324" rx="18" ry="6" fill="var(--shadow-hard)" />
      <circle cx="226" cy="320" r="10" fill="var(--neon-1)" stroke="var(--shadow-hard)" strokeWidth={4} />
      <circle cx="256" cy="324" r="10" fill="var(--neon-3)" stroke="var(--shadow-hard)" strokeWidth={4} />
      <circle cx="286" cy="320" r="10" fill="var(--neon-4)" stroke="var(--shadow-hard)" strokeWidth={4} />
      <rect x="166" y="370" width="68" height="56" fill="var(--bg-1)" stroke="var(--shadow-hard)" strokeWidth={5} />
      <rect x="182" y="386" width="12" height="20" fill="var(--neon-4)" stroke="var(--shadow-hard)" strokeWidth={3} />
      <rect x="206" y="386" width="12" height="20" fill="var(--neon-4)" stroke="var(--shadow-hard)" strokeWidth={3} />
      <circle cx="14" cy="172" r="24" fill="var(--ink)" stroke="var(--shadow-hard)" strokeWidth={6} />
      <path d="M4 160 L-26 156 Q-36 164 -26 172 L2 174" fill="var(--ink)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M4 184 L22 184 M8 192 L22 192" stroke="var(--shadow-hard)" strokeWidth={4} strokeLinecap="round" />
      <circle cx="382" cy="138" r="24" fill="var(--ink)" stroke="var(--shadow-hard)" strokeWidth={6} />
      <path d="M370 128 H394 M370 138 H394 M372 148 H392" stroke="var(--shadow-hard)" strokeWidth={4} strokeLinecap="round" />
      <path d="M400 100 Q412 92 418 104 M404 84 Q420 70 430 86" fill="none" stroke="var(--neon-4)" strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}

/**
 * 36-point score starburst with a `--bg-0` disc in the middle. Source art:
 * `public/art/score-starburst.svg`, cropped to a 200x200 viewBox so the disc
 * is centred. Decorative (`aria-hidden`).
 */
export function ScoreStarburst(props: ArtProps) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M100.0,4.0 L112.8,27.1 L132.8,9.8 L137.0,35.9 L161.7,26.5 L156.7,52.4 L183.1,52.0 L169.5,74.7 L194.5,83.3 L174.0,100.0 L194.5,116.7 L169.5,125.3 L183.1,148.0 L156.7,147.6 L161.7,173.5 L137.0,164.1 L132.8,190.2 L112.8,172.9 L100.0,196.0 L87.2,172.9 L67.2,190.2 L63.0,164.1 L38.3,173.5 L43.3,147.6 L16.9,148.0 L30.5,125.3 L5.5,116.7 L26.0,100.0 L5.5,83.3 L30.5,74.7 L16.9,52.0 L43.3,52.4 L38.3,26.5 L63.0,35.9 L67.2,9.8 L87.2,27.1 Z"
        fill="var(--neon-3)"
        stroke="var(--shadow-hard)"
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <circle cx="100" cy="100" r="56" fill="var(--bg-0)" stroke="var(--shadow-hard)" strokeWidth={4} />
    </svg>
  );
}

/**
 * Four-point twinkle in `--neon-4`. Source art: `public/art/twinkle-star.svg`,
 * cropped to a 40x40 viewBox. Decorative (`aria-hidden`).
 */
export function TwinkleStar(props: ArtProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z"
        fill="var(--neon-4)"
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
 * body, `--neon-2` highlight and light face of
 * `public/art/heart-p2-controller.svg`, without the controller. Decorative
 * (`aria-hidden`). Sized by CSS width; height follows the 230:270 viewBox.
 */
export function HeartPlayerTwo(props: ArtProps) {
  return (
    <svg viewBox="0 0 230 270" aria-hidden="true" focusable="false" {...props}>
      <path d="M95 158 C92 190 86 205 80 236 M125 158 C130 190 136 205 142 236" fill="none" stroke="var(--ink)" strokeWidth={17} strokeLinecap="round" />
      <path d="M95 158 C92 190 86 205 80 236 M125 158 C130 190 136 205 142 236" fill="none" stroke="var(--shadow-hard)" strokeWidth={10} strokeLinecap="round" />
      <ellipse cx="70" cy="240" rx="22" ry="11" fill="var(--shadow-hard)" stroke="var(--ink)" strokeWidth={3.5} />
      <ellipse cx="152" cy="240" rx="22" ry="11" fill="var(--shadow-hard)" stroke="var(--ink)" strokeWidth={3.5} />
      <path d="M44 92 C18 86 10 58 22 38 M176 96 C196 112 196 130 180 140" fill="none" stroke="var(--ink)" strokeWidth={17} strokeLinecap="round" />
      <path d="M44 92 C18 86 10 58 22 38 M176 96 C196 112 196 130 180 140" fill="none" stroke="var(--shadow-hard)" strokeWidth={10} strokeLinecap="round" />
      <circle cx="23" cy="26" r="16" fill="var(--ink)" stroke="var(--shadow-hard)" strokeWidth={5} />
      <path d="M17 18 L17 28 M24 15 L24 27 M31 19 L30 28" stroke="var(--shadow-hard)" strokeWidth={3} strokeLinecap="round" />
      <circle cx="176" cy="146" r="14" fill="var(--ink)" stroke="var(--shadow-hard)" strokeWidth={5} />
      <path d="M110 170 C50 125 28 95 36 66 C44 36 82 30 110 58 C138 30 176 36 184 66 C192 95 170 125 110 170 Z" fill="none" stroke="var(--ink)" strokeWidth={14} strokeLinejoin="round" />
      <path d="M110 170 C50 125 28 95 36 66 C44 36 82 30 110 58 C138 30 176 36 184 66 C192 95 170 125 110 170 Z" fill="var(--bg-0)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M52 66 Q55 50 71 45" fill="none" stroke="var(--neon-2)" strokeWidth={5} strokeLinecap="round" />
      <ellipse cx="92" cy="88" rx="9" ry="15" fill="var(--ink)" />
      <ellipse cx="128" cy="88" rx="9" ry="15" fill="var(--ink)" />
      <path d="M92 88 L98 74 L102 81 Z M128 88 L134 74 L138 81 Z" fill="var(--bg-0)" />
      <path d="M88 110 Q110 140 132 110 Q110 121 88 110 Z" fill="var(--ink)" />
    </svg>
  );
}

/**
 * Smiling cloud in `--ink` with `--neon-1` cheeks. Source art:
 * `public/art/cloud-smiling.svg`, cropped to its outline. Decorative
 * (`aria-hidden`). Height follows the 190:92 viewBox.
 */
export function SmilingCloud(props: ArtProps) {
  return (
    <svg viewBox="8 4 190 92" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M30 90 Q10 90 12 70 Q14 52 34 54 Q36 28 64 30 Q76 8 104 14 Q128 4 144 26 Q172 22 176 48 Q196 52 192 74 Q190 92 170 90 Z"
        fill="var(--ink)"
        stroke="var(--shadow-hard)"
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path d="M80 58 Q88 50 96 58 M116 58 Q124 50 132 58 M94 70 Q106 82 118 70" fill="none" stroke="var(--shadow-hard)" strokeWidth={5} strokeLinecap="round" />
      <circle cx="74" cy="72" r="6" fill="color-mix(in srgb, var(--neon-1) 55%, var(--ink))" />
      <circle cx="138" cy="72" r="6" fill="color-mix(in srgb, var(--neon-1) 55%, var(--ink))" />
    </svg>
  );
}

/**
 * Smiling hill in `--neon-3`. Source art: `public/art/hill-smiling.svg`.
 * Decorative (`aria-hidden`). Height follows the 400:220 viewBox; the base
 * sits on the bottom edge.
 */
export function SmilingHill(props: ArtProps) {
  return (
    <svg viewBox="0 0 400 220" aria-hidden="true" focusable="false" {...props}>
      <path d="M10 223 Q60 30 200 30 Q340 30 390 223 Z" fill="var(--neon-3)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M60 150 Q90 60 170 50" fill="none" stroke="color-mix(in srgb, var(--neon-3) 45%, var(--ink))" strokeWidth={10} strokeLinecap="round" />
      <path d="M160 110 Q172 98 184 110 M216 110 Q228 98 240 110 M176 136 Q200 158 224 136" fill="none" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinecap="round" />
      <circle cx="160" cy="134" r="8" fill="var(--neon-3-deep)" />
      <circle cx="240" cy="134" r="8" fill="var(--neon-3-deep)" />
    </svg>
  );
}

/**
 * Smiling gamepad: the body, face, d-pad and buttons of
 * `public/art/pad-gamepad-running.svg`, without the arms and legs, cropped
 * to a 224x172 viewBox. Decorative (`aria-hidden`).
 */
export function SmilingGamepad(props: ArtProps) {
  return (
    <svg viewBox="38 90 224 172" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M64 136 C64 104 96 98 124 104 L176 104 C204 98 236 104 236 136 L248 214 C254 246 226 258 206 236 L188 216 L112 216 L94 236 C74 258 46 246 52 214 Z"
        fill="var(--ink)"
        stroke="var(--shadow-hard)"
        strokeWidth={8}
        strokeLinejoin="round"
      />
      <ellipse cx="136" cy="142" rx="12" ry="21" fill="var(--shadow-hard)" />
      <ellipse cx="172" cy="142" rx="12" ry="21" fill="var(--shadow-hard)" />
      <path d="M136 142 L144 123 L149 133 Z M172 142 L180 123 L185 133 Z" fill="#fff" />
      <path d="M124 172 Q154 206 184 172 Q154 184 124 172 Z" fill="var(--shadow-hard)" />
      <rect x="75" y="188" width="22" height="7" fill="var(--neon-2)" stroke="var(--shadow-hard)" strokeWidth={2} />
      <rect x="82.5" y="180.5" width="7" height="22" fill="var(--neon-2)" stroke="var(--shadow-hard)" strokeWidth={2} />
      <circle cx="212" cy="186" r="7" fill="var(--neon-1)" stroke="var(--shadow-hard)" strokeWidth={3} />
      <circle cx="226" cy="200" r="7" fill="var(--neon-3)" stroke="var(--shadow-hard)" strokeWidth={3} />
    </svg>
  );
}

/**
 * Walking cartridge character in `--neon-3`. Source art:
 * `public/art/cart-cartridge-walking.svg`. Decorative (`aria-hidden`).
 * Height follows the 230:290 viewBox.
 */
export function WalkingCartridge(props: ArtProps) {
  return (
    <svg viewBox="0 0 230 290" aria-hidden="true" focusable="false" {...props}>
      <path d="M84 210 C80 236 66 248 52 262 M136 210 C146 236 162 244 180 250" fill="none" stroke="var(--ink)" strokeWidth={18} strokeLinecap="round" />
      <path d="M84 210 C80 236 66 248 52 262 M136 210 C146 236 162 244 180 250" fill="none" stroke="var(--shadow-hard)" strokeWidth={11} strokeLinecap="round" />
      <ellipse cx="44" cy="266" rx="26" ry="12" fill="var(--shadow-hard)" stroke="var(--ink)" strokeWidth={4} />
      <ellipse cx="190" cy="252" rx="26" ry="12" fill="var(--shadow-hard)" stroke="var(--ink)" strokeWidth={4} />
      <path d="M50 120 C24 130 20 160 34 178 M170 110 C196 96 202 64 190 40" fill="none" stroke="var(--ink)" strokeWidth={18} strokeLinecap="round" />
      <path d="M50 120 C24 130 20 160 34 178 M170 110 C196 96 202 64 190 40" fill="none" stroke="var(--shadow-hard)" strokeWidth={11} strokeLinecap="round" />
      <circle cx="36" cy="186" r="16" fill="var(--ink)" stroke="var(--shadow-hard)" strokeWidth={5} />
      <circle cx="190" cy="30" r="16" fill="var(--ink)" stroke="var(--shadow-hard)" strokeWidth={5} />
      <path d="M60 30 H160 V66 H172 V200 Q172 216 156 216 H64 Q48 216 48 200 V66 H60 Z" fill="none" stroke="var(--ink)" strokeWidth={14} strokeLinejoin="round" />
      <path d="M60 30 H160 V66 H172 V200 Q172 216 156 216 H64 Q48 216 48 200 V66 H60 Z" fill="var(--neon-3)" stroke="var(--shadow-hard)" strokeWidth={6} strokeLinejoin="round" />
      <path d="M76 40 V58 M92 40 V58 M108 40 V58 M124 40 V58 M140 40 V58" stroke="var(--neon-3-deep)" strokeWidth={5} strokeLinecap="round" />
      <rect x="64" y="80" width="92" height="96" rx="8" fill="var(--ink)" stroke="var(--shadow-hard)" strokeWidth={5} />
      <ellipse cx="94" cy="118" rx="9" ry="15" fill="var(--shadow-hard)" />
      <ellipse cx="126" cy="118" rx="9" ry="15" fill="var(--shadow-hard)" />
      <path d="M94 118 L100 104 L104 111 Z M126 118 L132 104 L136 111 Z" fill="#fff" />
      <path d="M86 142 L134 142 Q132 166 110 168 Q88 166 86 142 Z" fill="var(--shadow-hard)" />
      <path d="M98 158 Q110 150 122 158 Q110 164 98 158 Z" fill="var(--neon-1)" />
      <circle cx="76" cy="140" r="6" fill="color-mix(in srgb, var(--neon-1) 55%, var(--ink))" />
      <circle cx="144" cy="140" r="6" fill="color-mix(in srgb, var(--neon-1) 55%, var(--ink))" />
    </svg>
  );
}

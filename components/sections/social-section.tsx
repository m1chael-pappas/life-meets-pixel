import type { SVGProps } from "react";

import { Sunburst, WalkingCartridge } from "@/components/retro/arcade-art";
import { RSS_CHANNEL, SOCIAL_CHANNELS } from "@/lib/site/constants";

/**
 * Game cartridge outline that stretches to fill its box
 * (`preserveAspectRatio="none"`, non-scaling strokes). The shell takes
 * `currentColor`; the label window is `--bg-0`. Decorative (`aria-hidden`).
 */
function CartridgeShell(props: Omit<SVGProps<SVGSVGElement>, "viewBox" | "children">) {
  return (
    <svg viewBox="0 0 220 270" preserveAspectRatio="none" className="cart-tile__shell" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M24 6 H196 V52 H212 V252 Q212 264 200 264 H20 Q8 264 8 252 V52 H24 Z"
        fill="currentColor"
        stroke="var(--shadow-hard)"
        strokeWidth={6}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M50 16 V40 M74 16 V40 M98 16 V40 M122 16 V40 M146 16 V40 M170 16 V40"
        stroke="var(--shadow-hard)"
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.35}
        vectorEffect="non-scaling-stroke"
      />
      <rect
        x="28"
        y="70"
        width="164"
        height="170"
        rx="8"
        fill="var(--bg-0)"
        stroke="var(--shadow-hard)"
        strokeWidth={5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** `handle` with a zero-width space after every underscore, so long handles wrap at word joins. */
function breakableHandle(handle: string): string {
  return handle.replaceAll("_", "_\u200B");
}

/**
 * The social cartridges: every channel in `SOCIAL_CHANNELS`, then the RSS
 * feed, each a link in its channel's `color`. Rendered on the homepage and the
 * contact page.
 */
export function SocialTiles() {
  return (
    <ul className="cart-grid">
      {[...SOCIAL_CHANNELS, RSS_CHANNEL].map((channel) => (
        <li key={channel.label}>
          <a
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="cart-tile"
            style={{ color: channel.color }}
          >
            <CartridgeShell />
            <span className="cart-tile__label">
              <span className="cart-tile__code">{channel.mark}</span>
              <span className="cart-tile__name">{channel.label.toUpperCase()}</span>
              <span className="cart-tile__handle">{breakableHandle(channel.handle)}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * The homepage's "03 · Connect with us" section: a full-bleed `--bg-1` band
 * with faint rays, the walking cartridge beside the title, and the cartridges.
 */
export default function SocialSection() {
  return (
    <section className="lmp-section multiplayer-band" aria-labelledby="mp-title">
      <div className="multiplayer-band__ground" aria-hidden="true">
        <Sunburst className="multiplayer-band__rays" />
      </div>
      <div className="lmp-container">
        <div className="multiplayer-band__head">
          <div>
            <p className="section-kicker">03 · CONNECT WITH US</p>
            <h2 id="mp-title" className="extruded-title extruded-title--lime multiplayer-title">
              MULTIPLAYER
            </h2>
          </div>
          <WalkingCartridge className="multiplayer-band__walker" />
        </div>
        <SocialTiles />
      </div>
    </section>
  );
}

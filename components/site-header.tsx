"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import { NavGlyph, type NavGlyphName } from "@/components/retro/sprites";

// NEXT_PUBLIC_* is inlined at build time; without Clerk keys the auth
// controls simply don't render and no Clerk context is required.
const CLERK_ENABLED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const AuthControls = CLERK_ENABLED
  ? dynamic(() => import("@/components/auth-controls"))
  : null;

type PageKey =
  | "home"
  | "reviews"
  | "news"
  | "membership"
  | "contact"
  | "author";

interface SiteHeaderProps {
  currentPage?: PageKey;
}

const LINKS: Array<{
  id: PageKey;
  label: string;
  icon: NavGlyphName;
  href: string;
}> = [
  { id: "home", label: "HOME", icon: "home", href: "/" },
  { id: "reviews", label: "REVIEWS", icon: "star", href: "/reviews" },
  { id: "news", label: "NEWS", icon: "news", href: "/news" },
  { id: "membership", label: "JOIN", icon: "heart", href: "/membership" },
  { id: "contact", label: "CONTACT", icon: "mail", href: "/contact" },
];

function formatClock(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function SiteHeader({ currentPage = "home" }: SiteHeaderProps) {
  const [time, setTime] = useState<string>("");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setTime(formatClock(new Date()));
    const t = setInterval(() => setTime(formatClock(new Date())), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="lmp-header">
      <a href="#main-content" className="skip-link">
        SKIP TO CONTENT
      </a>
      <div className="lmp-header__topbar">
        <div className="lmp-container">
          <div className="lmp-header__status">
            <span>
              <span className="dot" aria-hidden="true"></span>SYSTEM ONLINE
            </span>
            <span>P1 READY</span>
            <span>HI-SCORE 999900</span>
          </div>
          <div className="lmp-header__status">
            <span suppressHydrationWarning>{time || "--:--:--"}</span>
            <span>v2.6.18</span>
            <span style={{ color: "var(--neon-3)" }}>EST. 2026</span>
          </div>
        </div>
      </div>
      <div className="lmp-header__main">
        <div className="lmp-container">
          <Link href="/" className="lmp-logo" aria-label="Life Meets Pixel home">
            <div className="lmp-logo__mark">
              <svg
                width="20"
                height="20"
                viewBox="0 0 8 8"
                shapeRendering="crispEdges"
                aria-hidden="true"
              >
                <rect x="1" y="2" width="2" height="2" fill="var(--neon-1)" />
                <rect x="5" y="2" width="2" height="2" fill="var(--neon-1)" />
                <rect x="2" y="3" width="4" height="2" fill="var(--neon-1)" />
                <rect x="3" y="5" width="2" height="1" fill="var(--neon-1)" />
              </svg>
            </div>
            <span className="lmp-logo__name">
              <span className="top">LIFE MEETS</span>
              <span className="bot">► PIXEL</span>
            </span>
          </Link>

          <button
            type="button"
            className="lmp-nav-toggle"
            aria-label={navOpen ? "Close menu" : "Menu"}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((v) => !v)}
          >
            {navOpen ? "[X]" : "☰ MENU"}
          </button>

          <nav className={`lmp-nav ${navOpen ? "is-open" : ""}`}>
            {LINKS.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                className={currentPage === l.id ? "is-active" : ""}
                onClick={() => setNavOpen(false)}
              >
                <span className="lmp-nav__icon" aria-hidden="true">
                  <NavGlyph name={l.icon} />
                </span>
                {l.label}
              </Link>
            ))}
            {AuthControls && (
              <AuthControls onNavigate={() => setNavOpen(false)} />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

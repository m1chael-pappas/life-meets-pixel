"use client";

import { useState } from "react";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ModeToggle } from "@/components/ui/mode-toggle";

interface SiteHeaderProps {
  currentPage?: "home" | "reviews" | "news" | "author" | "contact";
}

export function SiteHeader({ currentPage }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "🏠 HOME", key: "home" },
    { href: "/reviews", label: "📝 REVIEWS", key: "reviews" },
    { href: "/news", label: "📰 NEWS", key: "news" },
    { href: "/contact", label: "✉️ CONTACT", key: "contact" },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity flex items-center gap-3"
          >
            <Image
              src="/logo.svg"
              alt="Life Meets Pixel"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-mono">
              LIFE MEETS PIXEL
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`font-mono text-lg transition-colors ${
                  currentPage === item.key
                    ? "text-primary hover:text-primary/80"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-2">
              <ModeToggle />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        <nav
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "max-h-64 opacity-100 mt-4 pt-4 border-t border-border"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item, index) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-mono text-md transition-all py-2 ${
                  currentPage === item.key
                    ? "text-primary hover:text-primary/80"
                    : "text-foreground hover:text-primary"
                }`}
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 50}ms` : "0ms",
                  transform: mobileMenuOpen
                    ? "translateX(0)"
                    : "translateX(-10px)",
                  opacity: mobileMenuOpen ? 1 : 0,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

import Image from 'next/image';
import Link from 'next/link';

import { ModeToggle } from '@/components/ui/mode-toggle';

export default function NotFound() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity flex items-center gap-3"
            >
              <Image
                src="/logo.png"
                alt="Life Meets Pixel"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <h1 className="text-3xl font-bold text-primary font-mono">
                LIFE MEETS PIXEL
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-foreground hover:text-primary font-mono text-sm transition-colors"
              >
                🏠 HOME
              </Link>
              <Link
                href="/reviews"
                className="text-foreground hover:text-primary font-mono text-sm transition-colors"
              >
                📝 REVIEWS
              </Link>
              <Link
                href="/news"
                className="text-foreground hover:text-primary font-mono text-sm transition-colors"
              >
                📰 NEWS
              </Link>
              <div className="ml-2">
                <ModeToggle />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* 404 Content */}
      <main className="container mx-auto max-w-4xl px-4 py-20 text-center">
        {/* Error Code with Retro Style */}
        <div className="mb-8">
          <div className="text-9xl font-bold font-mono text-primary mb-4 animate-pulse">
            404
          </div>
          <div className="text-2xl font-mono text-muted-foreground mb-2">
            ERROR: PAGE_NOT_FOUND
          </div>
        </div>

        {/* Nerdy ASCII Art */}
        <pre className="text-primary font-mono text-xs md:text-sm mb-8 inline-block text-left bg-muted/20 p-6 rounded-lg border border-border overflow-x-auto">
          {`    _______________
   /               \\
  /   O       O     \\
 |                   |
 |    \\___________/  |
  \\                 /
   \\_____________/

     404 ERROR
  PIXEL NOT FOUND`}
        </pre>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-foreground font-mono">
            OOPS! LOOKS LIKE THIS PIXEL GLITCHED OUT
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The page you&apos;re looking for has either been moved, deleted, or
            never existed in this reality. Maybe it&apos;s in another dimension?
            🌌
          </p>
        </div>

        {/* Nerdy Error Details */}
        <div className="bg-muted/20 rounded-lg p-6 mb-8 max-w-2xl mx-auto border border-border">
          <div className="font-mono text-left space-y-2 text-sm">
            <div className="text-red-500">
              <span className="text-muted-foreground">{">"}</span>{" "}
              console.error(
              <span className="text-yellow-500">
                &quot;Route not found&quot;
              </span>
              );
            </div>
            <div className="text-muted-foreground">
              <span className="text-muted-foreground">{">"}</span> Status:{" "}
              <span className="text-primary">404</span>
            </div>
            <div className="text-muted-foreground">
              <span className="text-muted-foreground">{">"}</span> Message:{" "}
              <span className="text-orange-500">
                &quot;The requested pixel does not exist&quot;
              </span>
            </div>
            <div className="text-muted-foreground">
              <span className="text-muted-foreground">{">"}</span> Suggestion:{" "}
              <span className="text-green-500">
                &quot;Try navigating back home&quot;
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-mono hover:bg-primary/90 transition-colors text-lg"
          >
            🏠 RETURN HOME
          </Link>
          <Link
            href="/reviews"
            className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-mono hover:bg-secondary/90 transition-colors text-lg"
          >
            📝 BROWSE REVIEWS
          </Link>
          <Link
            href="/news"
            className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-mono hover:bg-accent/90 transition-colors text-lg"
          >
            📰 READ NEWS
          </Link>
        </div>

        {/* Easter Egg */}
        <div className="mt-12 text-xs text-muted-foreground font-mono">
          <p>
            {"//"} Debug Info: If this keeps happening, the simulation might be
            broken 🤖
          </p>
          <p>
            {"//"} Error Code: 0x80040404 | Stack Trace: nowhere_to_be_found.tsx
          </p>
        </div>
      </main>
    </div>
  );
}

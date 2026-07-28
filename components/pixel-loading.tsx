// Shared retro loading skeleton.
//
// This used to be app/loading.tsx. At the root it wrapped every page in an
// implicit Suspense boundary, so Next flushed a 200 status before any page
// body ran. Any notFound() after that could no longer change the status, and
// every bogus /news/* and /reviews/* URL answered 200 with the not-found UI:
// a soft 404 that search engines index as a real page.
//
// It now lives only in (listing) route groups, which exclude the [slug]
// segments that call notFound(). Do NOT add a loading.tsx to a segment that
// has a notFound()-calling child, or the soft 404s come straight back.

export function PixelLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Pixel Heart Loading Animation */}
        <div className="relative">
          <div className="text-6xl animate-pulse">❤️</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground font-mono animate-pulse">
            LOADING PIXELS...
          </h2>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0ms]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:150ms]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:300ms]"></div>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-primary animate-pulse"></div>
        </div>

        {/* Nerdy Loading Messages */}
        <p className="text-sm text-muted-foreground font-mono">
          {"//"} Compiling awesome content...
        </p>
      </div>
    </div>
  );
}

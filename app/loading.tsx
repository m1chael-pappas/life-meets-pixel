export default function Loading() {
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

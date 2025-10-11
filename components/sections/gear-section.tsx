export default function GearSection() {
  const gearItems = [
    {
      id: 1,
      name: "Gaming Headset",
      description: "Crystal clear audio for immersive gaming",
      emoji: "🎧",
    },
    {
      id: 2,
      name: "Gaming Mouse",
      description: "Precision and comfort for long gaming sessions",
      emoji: "🖱️",
    },
    {
      id: 3,
      name: "Gaming Chair",
      description: "Ergonomic support for marathon gaming",
      emoji: "🪑",
    },
    {
      id: 4,
      name: "Gaming Monitor",
      description: "High refresh rate for competitive edge",
      emoji: "🖥️",
    },
  ];

  return (
    <section className="my-12">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-bold text-foreground font-mono">
          GAMING GEAR WE LOVE
        </h3>
        <div className="h-px bg-accent/30 flex-1"></div>
        <span className="text-xs text-muted-foreground font-mono">
          Affiliate Links
        </span>
      </div>

      {/* Under Construction Notice */}
      <div className="bg-muted/20 border-2 border-dashed border-primary/30 rounded-lg p-6 mb-6 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h4 className="text-lg font-bold text-foreground font-mono mb-2">
          WORK IN PROGRESS
        </h4>
        <p className="text-sm text-muted-foreground font-mono">
          // We're building something awesome here...
          <br />
          // Check back later for our gear recommendations!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {gearItems.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-lg p-4 opacity-50 cursor-not-allowed relative overflow-hidden"
          >
            {/* Disabled Overlay */}
            <div className="absolute inset-0 bg-muted/10 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="text-3xl">🚧</span>
            </div>

            <div className="aspect-square bg-muted/20 rounded-md mb-3 flex items-center justify-center">
              <span className="text-2xl grayscale">{item.emoji}</span>
            </div>
            <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
            <p className="text-xs text-muted-foreground mb-2">
              {item.description}
            </p>
            <span className="text-xs text-muted-foreground font-mono">
              Coming Soon...
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

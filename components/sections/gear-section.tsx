export default function GearSection() {
  const gearItems = [
    {
      id: 1,
      name: "Gaming Headset",
      description: "Crystal clear audio for immersive gaming",
      emoji: "🎧",
      link: "https://amazon.com/your-affiliate-link", // Replace with actual affiliate links
    },
    {
      id: 2,
      name: "Gaming Mouse",
      description: "Precision and comfort for long gaming sessions",
      emoji: "🖱️",
      link: "https://amazon.com/your-affiliate-link",
    },
    {
      id: 3,
      name: "Gaming Chair",
      description: "Ergonomic support for marathon gaming",
      emoji: "🪑",
      link: "https://amazon.com/your-affiliate-link",
    },
    {
      id: 4,
      name: "Gaming Monitor",
      description: "High refresh rate for competitive edge",
      emoji: "🖥️",
      link: "https://amazon.com/your-affiliate-link",
    },
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-bold text-foreground font-mono">
          GAMING GEAR WE LOVE
        </h3>
        <div className="h-px bg-accent/30 flex-1"></div>
        <span className="text-xs text-muted-foreground font-mono">
          Affiliate Links
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {gearItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group block"
          >
            <div className="aspect-square bg-muted/20 rounded-md mb-3 flex items-center justify-center">
              <span className="text-2xl">{item.emoji}</span>
            </div>
            <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{item.name}</h4>
            <p className="text-xs text-muted-foreground mb-2">
              {item.description}
            </p>
            <span className="text-xs text-primary hover:text-primary/80 font-mono">
              Check Price →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

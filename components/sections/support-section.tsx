export default function SupportSection() {
  return (
    <section className="mb-12">
      <div className="bg-card rounded-lg p-6 text-center border border-border card-shadow">
        <h3 className="text-2xl font-bold text-foreground mb-2 font-mono">
          SUPPORT LIFE MEETS PIXEL
        </h3>
        <p className="text-sm text-foreground font-medium mb-4">
          Enjoying our reviews? Help us keep the pixels flowing with coffee ☕
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://ko-fi.com/lifemeetspixel"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-bold font-mono hover:bg-primary/90 transition-all card-shadow"
          >
            ☕ Buy us a Coffee
          </a>
          <a
            href="https://patreon.com/lifemeetspixel"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-bold font-mono hover:bg-secondary/90 transition-all card-shadow"
          >
            💖 Become a Patron
          </a>
        </div>
      </div>
    </section>
  );
}

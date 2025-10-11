export default function SupportSection() {
  return (
    <section className="mb-12">
      <div className="bg-muted/20 rounded-lg p-6 text-center border border-primary/10">
        <h3 className="text-lg font-bold text-foreground mb-2 font-mono">
          SUPPORT LIFE MEETS PIXEL
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enjoying our reviews? Help us keep the pixels flowing with coffee ☕
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://ko-fi.com/lifemeetspixel"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-mono hover:bg-primary/90 transition-colors"
          >
            ☕ Buy us a Coffee
          </a>
          <a
            href="https://patreon.com/lifemeetspixel"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-mono hover:bg-secondary/90 transition-colors"
          >
            💖 Become a Patron
          </a>
        </div>
      </div>
    </section>
  );
}

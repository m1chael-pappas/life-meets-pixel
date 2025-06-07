import PixelHeartRating from '@/components/ui/pixel-heart-rating';

export default function HeroSection() {
  return (
    <section className="text-center mb-12 py-8">
      <h2 className="text-5xl font-bold text-foreground mb-4 font-mono">
        Latest <span className="text-primary">Game Reviews</span>
      </h2>
      <div className="flex items-center justify-center gap-2 mb-4">
        <PixelHeartRating reviewScore={10} showScore={false} size="md" />
      </div>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        Discover the best games worth your time with our in-depth reviews and
        honest ratings from the pixel world
      </p>
    </section>
  );
}

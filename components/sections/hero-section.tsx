import PixelHeartRating from '@/components/ui/pixel-heart-rating';

export default function HeroSection() {
  return (
    <section className="text-center mb-12 py-8">
      <h2 className="text-5xl font-bold text-foreground mb-4 font-mono">
        Geeky <span className="text-primary">Reviews</span> & More
      </h2>
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="text-2xl">🎮</span>
        <PixelHeartRating reviewScore={10} showScore={false} size="md" />
        <span className="text-2xl">🎬</span>
        <PixelHeartRating reviewScore={10} showScore={false} size="md" />
        <span className="text-2xl">📚</span>
      </div>
      <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
        Discover the best games, movies, books, anime, board games, and tech
        worth your time. Honest reviews from fellow geeks who know what makes
        content truly special.
      </p>
      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-lg">🎯</span>
          <span>Honest Reviews</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-lg">🤝</span>
          <span>Two Perspectives</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-lg">🔥</span>
          <span>Geeky Content</span>
        </div>
      </div>
    </section>
  );
}

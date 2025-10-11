import PixelHeartRating from "@/components/ui/pixel-heart-rating";

export default function HeroSection() {
  return (
    <section className="text-center mb-12 py-8">
      <h2 className="text-5xl font-bold text-foreground mb-4 font-mono">
        Geeky <span className="text-primary">Reviews</span> & More
      </h2>
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="text-2xl">🎮</span>
        <PixelHeartRating reviewScore={7} showScore={false} size="md" />
        <span className="text-2xl">🎬</span>
        <PixelHeartRating reviewScore={7} showScore={false} size="md" />
        <span className="text-2xl">📚</span>
      </div>
      <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
        Hello there, General Kenobi 👋(oops wrong universe) - welcome to my
        little corner of the internet. It’s just me here, sharing honest
        thoughts on the games, movies, books, and tech I love (or sometimes
        don’t). No sponsors. No PR fluff. Just real reviews from a fellow nerd.
      </p>
      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-lg">🎯</span>
          <span>Honest Reviews</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-lg">🧠</span>
          <span>Personal Insights</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-lg">🔥</span>
          <span>Geek-Centric Picks</span>
        </div>
      </div>
    </section>
  );
}

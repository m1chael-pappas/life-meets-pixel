import { scoreTone } from "@/lib/mappings";

export function ScoreBox({
  score,
  className = "",
}: {
  score: number;
  className?: string;
}) {
  const tone = scoreTone(score);
  return (
    <div
      className={`review-card__score ${tone === "low" ? "low" : tone === "mid" ? "mid" : ""} ${className}`}
    >
      {score.toFixed(1)}
    </div>
  );
}

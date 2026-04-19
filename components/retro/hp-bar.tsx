import { scoreTone } from "@/lib/mappings";

const CELLS = 20;

export function HPBar({
  label,
  score,
  max = 10,
}: {
  label: string;
  score: number;
  max?: number;
}) {
  const filled = Math.round((score / max) * CELLS);
  const tone = scoreTone(score);
  const cellClass =
    tone === "low" ? "is-low" : tone === "mid" ? "is-mid" : "is-fill";
  return (
    <div className="hp-row">
      <div className="hp-row__head">
        <span>{label}</span>
        <span>
          {score.toFixed(1)}/{max}
        </span>
      </div>
      <div className="hp-row__bar" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={max}>
        {Array.from({ length: CELLS }).map((_, i) => (
          <span
            key={i}
            className={`hp-cell ${i < filled ? cellClass : ""}`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

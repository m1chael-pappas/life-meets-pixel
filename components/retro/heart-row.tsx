import { PixelHeart } from "./sprites";

export function HeartRow({
  score,
  size = 18,
  max = 10,
}: {
  score: number;
  size?: number;
  max?: number;
}) {
  const hearts = max / 2;
  const halves = Math.round(score);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < hearts; i++) {
    const left = halves - i * 2;
    const state = left >= 2 ? "full" : left === 1 ? "half" : "empty";
    items.push(<PixelHeart key={i} state={state} size={size} />);
  }
  return <span className="hearts">{items}</span>;
}

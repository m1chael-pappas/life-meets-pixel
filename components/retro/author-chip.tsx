import { authorAccent, authorInitial } from "@/lib/content/mappings";

export function AuthorChip({
  name,
  accentColor,
}: {
  name: string;
  accentColor?: string;
}) {
  return (
    <span className="author-chip" style={{ color: authorAccent(accentColor) }}>
      <span className="author-chip__avatar">{authorInitial(name)}</span>
      {name}
    </span>
  );
}

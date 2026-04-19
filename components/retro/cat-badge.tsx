import { CAT_LABELS, type RetroCat } from "@/lib/mappings";

import { CatSprite } from "./sprites";

export function CatBadge({
  cat,
  featured = false,
}: {
  cat: RetroCat;
  featured?: boolean;
}) {
  return (
    <>
      <span className="cat-badge">
        <CatSprite cat={cat} size={14} />
        {CAT_LABELS[cat]}
      </span>
      {featured && <span className="cat-badge featured">★ FEATURED</span>}
    </>
  );
}

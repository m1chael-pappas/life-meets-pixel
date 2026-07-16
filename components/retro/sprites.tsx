import type { RetroCat } from "@/lib/mappings";

type SpriteProps = { size?: number };

function gridSvg(grid: string, palette: Record<string, string>, size: number) {
  const rows = grid.trim().split("\n").map((r) => r.trim());
  const h = rows.length;
  const w = rows[0].length;
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = palette[rows[y][x]];
      if (c) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c} />);
    }
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {cells}
    </svg>
  );
}

export function PixelHeart({
  state = "full",
  size = 18,
  color = "var(--heart)",
}: {
  state?: "full" | "half" | "empty";
  size?: number;
  color?: string;
}) {
  const palette: Record<string, string> = {
    X: "#000",
    F: color,
    H: "#ffd1de",
    E: "none",
    ".": "none",
  };
  const full = `
.XXX.XXX.
XHFFXFFFX
XHFFFFFFX
XFFFFFFFX
.XFFFFFX.
..XFFFX..
...XFX...
....X....`;
  const half = `
.XXX.XXX.
XHFFXEEEX
XHFFFEEEX
XFFFFEEEX
.XFFFEEX.
..XFFEX..
...XEX...
....X....`;
  const empty = `
.XXX.XXX.
XEEEXEEEX
XEEEEEEEX
XEEEEEEEX
.XEEEEEX.
..XEEEX..
...XEX...
....X....`;
  const g = state === "full" ? full : state === "half" ? half : empty;
  return gridSvg(g, palette, size);
}

// Category sprites — simplified pixel icons per category
function GameSprite({ size = 14 }: SpriteProps) {
  const palette: Record<string, string> = {
    X: "#000",
    F: "var(--neon-2)",
    H: "var(--neon-1)",
    ".": "none",
  };
  const g = `
..XXXXXX..
.XFFFFFFX.
XFHFFFFHFX
XFFFFFFFFX
XFHFFFFHFX
.XFFFFFFX.
..XXXXXX..`;
  return gridSvg(g, palette, size);
}

function BoardSprite({ size = 14 }: SpriteProps) {
  const palette: Record<string, string> = {
    X: "#000",
    F: "var(--neon-4)",
    H: "var(--neon-1)",
    ".": "none",
  };
  const g = `
XXXXXXXX
XFFFFFFX
XFHFHFFX
XFFFFFFX
XFHFHFFX
XFFFFFFX
XXXXXXXX`;
  return gridSvg(g, palette, size);
}

function MovieSprite({ size = 14 }: SpriteProps) {
  const palette: Record<string, string> = {
    X: "#000",
    F: "var(--heart)",
    H: "var(--ink)",
    ".": "none",
  };
  const g = `
XXXXXXXXX
XHFHFHFHX
XFFFFFFFX
XHFHFHFHX
XFFFFFFFX
XHFHFHFHX
XXXXXXXXX`;
  return gridSvg(g, palette, size);
}

function TvSprite({ size = 14 }: SpriteProps) {
  const palette: Record<string, string> = {
    X: "#000",
    F: "var(--neon-2)",
    ".": "none",
  };
  const g = `
.XXXXXXX.
XFFFFFFFX
XFFFFFFFX
XFFFFFFFX
XFFFFFFFX
XXXXXXXXX
..X...X..`;
  return gridSvg(g, palette, size);
}

function AnimeSprite({ size = 14 }: SpriteProps) {
  const palette: Record<string, string> = {
    X: "#000",
    F: "var(--neon-1)",
    H: "var(--ink)",
    ".": "none",
  };
  const g = `
.XXXXXXX.
XFHFFFHFX
XFHFFFHFX
XFFFFFFFX
XFFXXFFX.
.XFFFFFX.
..XXXXX..`;
  return gridSvg(g, palette, size);
}

function BookSprite({ size = 14 }: SpriteProps) {
  const palette: Record<string, string> = {
    X: "#000",
    F: "var(--neon-3)",
    H: "var(--ink)",
    ".": "none",
  };
  const g = `
XXXXXXXX
XFFFFFFX
XFHHHHFX
XFFFFFFX
XFHHHHFX
XFFFFFFX
XXXXXXXX`;
  return gridSvg(g, palette, size);
}

function ComicSprite({ size = 14 }: SpriteProps) {
  const palette: Record<string, string> = {
    X: "#000",
    F: "var(--neon-4)",
    H: "var(--heart)",
    ".": "none",
  };
  const g = `
XXXXXXXX
XFFHHFFX
XFFHHFFX
XHHFFHHX
XHHFFHHX
XFFHHFFX
XXXXXXXX`;
  return gridSvg(g, palette, size);
}

function TechSprite({ size = 14 }: SpriteProps) {
  const palette: Record<string, string> = {
    X: "#000",
    F: "var(--neon-2)",
    H: "var(--ink-mute)",
    ".": "none",
  };
  const g = `
.XXXXXX.
XFFFFFFX
XFHHHHFX
XFHHHHFX
XFHHHHFX
XFFFFFFX
.X.XX.X.`;
  return gridSvg(g, palette, size);
}

const CAT_SPRITE: Record<RetroCat, React.FC<SpriteProps>> = {
  game: GameSprite,
  board: BoardSprite,
  movie: MovieSprite,
  tv: TvSprite,
  anime: AnimeSprite,
  book: BookSprite,
  comic: ComicSprite,
  tech: TechSprite,
};

export function CatSprite({ cat, size = 14 }: { cat: RetroCat; size?: number }) {
  const Sprite = CAT_SPRITE[cat] ?? GameSprite;
  return <Sprite size={size} />;
}

/* 9x9 single-color glyphs for the site nav — one grid size so every icon
   renders at identical visual weight (unicode glyphs never line up). */
const NAV_GLYPHS = {
  home: `
....F....
...FFF...
..FFFFF..
.FFFFFFF.
FFFFFFFFF
.FFFFFFF.
.FF...FF.
.FF...FF.
.FFFFFFF.`,
  star: `
....F....
....F....
...FFF...
F.FFFFF.F
FFFFFFFFF
..FFFFF..
..FF.FF..
.FF...FF.
.F.....F.`,
  news: `
FFFFFFFFF
F.......F
F.FFFFF.F
F.......F
F.FFFFF.F
F.......F
F.FFF...F
F.......F
FFFFFFFFF`,
  heart: `
.........
.FF...FF.
FFFF.FFFF
FFFFFFFFF
FFFFFFFFF
.FFFFFFF.
..FFFFF..
...FFF...
....F....`,
  mail: `
.........
FFFFFFFFF
FF.....FF
F.F...F.F
F..F.F..F
F...F...F
F.......F
FFFFFFFFF
.........`,
  play: `
.F.......
.FFF.....
.FFFF....
.FFFFF...
.FFFFFF..
.FFFFF...
.FFFF....
.FFF.....
.F.......`,
  shield: `
FFFFFFFFF
FFFFFFFFF
FFFFFFFFF
FFFFFFFFF
.FFFFFFF.
.FFFFFFF.
..FFFFF..
...FFF...
....F....`,
  bubble: `
.FFFFFFF.
FFFFFFFFF
FFFFFFFFF
FFFFFFFFF
FFFFFFFFF
.FFFFFFF.
..FFF....
..FF.....
..F......`,
  rss: `
......FF.
......FF.
......FF.
...FF.FF.
...FF.FF.
FF.FF.FF.
FF.FF.FF.
FF.FF.FF.
.........`,
} as const;

export type NavGlyphName = keyof typeof NAV_GLYPHS;

export function NavGlyph({
  name,
  size = 13,
  color = "var(--neon-1)",
}: {
  name: NavGlyphName;
  size?: number;
  color?: string;
}) {
  return gridSvg(NAV_GLYPHS[name], { F: color, ".": "none" }, size);
}

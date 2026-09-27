import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";

import { config } from "@/proxy";

const ROOT = __dirname;

/** Names whose call needs clerkMiddleware() on the request, by the module they come from. */
const SESSION_READERS: Record<string, string[]> = {
  "@clerk/nextjs/server": ["auth", "currentUser"],
  "@/lib/members/membership": ["getMembership", "requireAdmin"],
};

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

function importsOf(source: string): { names: string[]; from: string }[] {
  return [...source.matchAll(/import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+["']([^"']+)["']/g)].map((m) => ({
    names: m[1].split(",").map((n) => n.trim().split(/\s+as\s+/)[0].replace(/^type\s+/, "")).filter(Boolean),
    from: m[2],
  }));
}

function resolveAlias(spec: string): string | null {
  if (!spec.startsWith("@/")) return null;
  const base = join(ROOT, spec.slice(2));
  for (const candidate of [`${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")]) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/** Server modules (not "use client") that read the Clerk session, directly or through another module. */
function sessionReadingModules(files: string[]): Set<string> {
  const server = files.filter((f) => !/^\s*["']use client["']/.test(readFileSync(f, "utf8")));
  const readers = new Set<string>();
  let grew = true;
  while (grew) {
    grew = false;
    for (const file of server) {
      if (readers.has(file)) continue;
      const hit = importsOf(readFileSync(file, "utf8")).some(({ names, from }) => {
        if (from in SESSION_READERS) return SESSION_READERS[from].some((n) => names.includes(n));
        const resolved = resolveAlias(from);
        return resolved !== null && readers.has(resolved);
      });
      if (hit) {
        readers.add(file);
        grew = true;
      }
    }
  }
  return readers;
}

/** Sample URLs a page or route file serves, with dynamic segments filled in. */
function urlsFor(file: string): string[] {
  const segments = relative(join(ROOT, "app"), file).split("/").slice(0, -1).filter((s) => !/^\(.*\)$/.test(s));
  const optionalCatchAll = segments.at(-1)?.startsWith("[[...");
  const path = segments.map((s) => (s.startsWith("[") ? "sample" : s));
  const url = `/${path.join("/")}`;
  return optionalCatchAll ? [`/${path.slice(0, -1).join("/")}`, url] : [url];
}

const files = ["app", "components", "lib"].flatMap((dir) => walk(join(ROOT, dir)));
const readers = sessionReadingModules(files);
const entryPoints = [...readers].filter((f) => /\/(page|route|layout)\.tsx?$/.test(f));

describe("proxy matcher", () => {
  it("finds the known session-reading routes, so the scan itself works", () => {
    const urls = entryPoints.flatMap(urlsFor);
    for (const known of ["/admin", "/account", "/api/rss-token", "/api/comments", "/api/comments/vote"]) {
      expect(urls).toContain(known);
    }
  });

  it.each(entryPoints.flatMap(urlsFor))("runs clerkMiddleware on %s, which reads the session", (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
  });

  it.each(["/", "/reviews/some-review", "/news/some-post", "/about", "/api/clerk", "/api/revalidate"])(
    "stays off %s, which never reads the session",
    (url) => {
      expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
    },
  );
});

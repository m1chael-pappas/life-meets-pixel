"use client";

import { useEffect, useState } from "react";

// Shown on /account for members with the full_rss feature: their personal
// full-text feed URL, with copy + rotate (rotating kills a leaked URL).
export default function RssFeedCard() {
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "no-access" | "ready">("loading");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/rss-token").then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setUrl(data.url);
        setStatus("ready");
      } else {
        setStatus("no-access");
      }
    });
  }, []);

  if (status === "loading" || status === "no-access") return null;

  const copy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rotate = async () => {
    const res = await fetch("/api/rss-token", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setUrl(data.url);
    }
  };

  return (
    <div className="rss-card">
      <h2>◉ YOUR FULL-TEXT RSS FEED</h2>
      <p>
        Complete articles in your feed reader. This URL is personal — if it
        leaks, hit regenerate and the old one stops working.
      </p>
      <code className="rss-card__url">{url}</code>
      <div className="rss-card__actions">
        <button type="button" className="retro-btn retro-btn--magenta" onClick={copy}>
          {copied ? "COPIED!" : "COPY URL"}
        </button>
        <button type="button" className="retro-btn retro-btn--lime" onClick={rotate}>
          REGENERATE
        </button>
      </div>
    </div>
  );
}

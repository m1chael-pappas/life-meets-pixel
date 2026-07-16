/**
 * Retro skin for all Clerk components (sign-in, user button, pricing table,
 * account). IMPORTANT: `variables` must be literal hex colors — Clerk derives
 * lighter/darker shades from them in JS, so CSS var() strings silently break
 * and text renders near-invisible. Values are the Midnight Neon palette
 * (Clerk chrome intentionally stays midnight even when the palette switches).
 * `elements` rules go straight to CSS, so var() is fine there.
 */
export const clerkAppearance = {
  // Both variable generations on purpose: the runtime clerk-js (CDN) reads
  // the new *Foreground names; older tooling reads colorText/colorInputText.
  variables: {
    colorPrimary: "#ff3d8b",
    colorPrimaryForeground: "#000000",
    colorBackground: "#14112e",
    colorForeground: "#f5f0ff",
    colorText: "#f5f0ff",
    colorTextSecondary: "#b9b0d8",
    colorMutedForeground: "#b9b0d8",
    colorMuted: "#1f1a3d",
    colorNeutral: "#f5f0ff",
    colorInputBackground: "#1f1a3d",
    colorInputForeground: "#f5f0ff",
    colorInputText: "#f5f0ff",
    colorBorder: "#2a2350",
    colorDanger: "#ff5275",
    colorSuccess: "#aaff3d",
    colorWarning: "#ffd23d",
    borderRadius: "0px",
    fontFamily: "var(--font-jetbrains-mono), monospace",
  },
  elements: {
    card: {
      border: "3px solid var(--bg-3)",
      boxShadow: "6px 6px 0 rgba(0, 0, 0, 0.35)",
    },
    headerTitle: {
      fontFamily: "var(--font-press-start-2p), monospace",
      fontSize: "14px",
      lineHeight: "1.6",
    },
    formButtonPrimary: {
      fontFamily: "var(--font-press-start-2p), monospace",
      fontSize: "11px",
      textTransform: "uppercase",
    },
  },
} as const;

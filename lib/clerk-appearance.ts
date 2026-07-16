/**
 * Retro skin for all Clerk components (sign-in, user button, pricing table,
 * account). Clerk renders in the normal DOM, so palette CSS variables apply
 * and the Tweaks panel palette switch carries through.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "var(--neon-1)",
    colorBackground: "var(--bg-1)",
    colorText: "var(--ink)",
    colorTextSecondary: "var(--ink-dim)",
    colorMutedForeground: "var(--ink-dim)",
    colorInputBackground: "var(--bg-2)",
    colorInputText: "var(--ink)",
    colorDanger: "var(--heart)",
    colorSuccess: "var(--neon-3)",
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

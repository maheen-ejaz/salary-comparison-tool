export type GlassTheme = "dark" | "light" | "beige";

export function getTheme(theme: GlassTheme = "dark") {
  if (theme === "beige") return beige;
  if (theme === "light") return light;
  return dark;
}

const dark = {
  // Glass card surfaces
  cardBg: "rgba(0, 0, 0, 0.2)",
  cardBgHover: "rgba(0, 0, 0, 0.3)",
  cardBorder: "rgba(255, 255, 255, 0.1)",
  cardBorderHover: "rgba(255, 255, 255, 0.15)",
  cardShadow:
    "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
  cardShadowHover:
    "0 6px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)",

  // Text
  textPrimary: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textMuted: "rgba(255, 255, 255, 0.6)",
  textSubtle: "rgba(255, 255, 255, 0.5)",
  textFaint: "rgba(255, 255, 255, 0.4)",

  // Badge
  badgeBg: "rgba(0, 0, 0, 0.2)",
  badgeText: "rgba(255, 255, 255, 0.8)",
  badgeBorder: "rgba(255, 255, 255, 0.1)",

  // CTA / buttons
  ctaBg: "rgba(0, 0, 0, 0.2)",
  ctaBgHover: "rgba(0, 0, 0, 0.3)",
  ctaText: "#ffffff",
  ctaBorder: "rgba(255, 255, 255, 0.1)",
  ctaBorderHover: "rgba(255, 255, 255, 0.15)",
  ctaShadow:
    "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
  ctaShadowHover:
    "0 6px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)",

  // Divider line
  dividerGradient:
    "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)",
  dividerGlow:
    "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.15), transparent)",

  // Image overlay gradient (GlassDestinationCard)
  imageOverlay:
    "linear-gradient(to top, rgba(10, 15, 26, 0.85), rgba(10, 15, 26, 0.5) 40%, transparent 70%)",
  imageCardText: "#ffffff",

  // Card outer shadow (destination cards)
  cardOuterShadow: "0 0 40px -15px rgba(0,0,0,0.5)",
  cardOuterShadowHover: "0 0 60px -15px rgba(255,255,255,0.15)",

  // Feature card accents
  accentTeal: "#2dd4bf",
  accentTealSubtle: "rgba(13, 148, 136, 0.5)",
  accentNeutral: "rgba(255, 255, 255, 0.7)",
  accentNeutralSubtle: "rgba(255, 255, 255, 0.2)",
  featureHoverBorderTeal: "rgba(45, 212, 191, 0.3)",
  featureHoverBorderNeutral: "rgba(255, 255, 255, 0.2)",

  // Footer
  footerDivider: "rgba(255, 255, 255, 0.15)",
  socialIconBg: "rgba(0, 0, 0, 0.2)",
  socialIconBgHover: "rgba(0, 0, 0, 0.3)",
  socialIconBorder: "rgba(255, 255, 255, 0.1)",
  socialIconBorderHover: "rgba(255, 255, 255, 0.15)",

  // Orbs
  orbOpacityMultiplier: 1,
  noiseOpacity: "0.03",
  noiseBlendMode: "overlay" as const,
} as const;

// White background — gray-tinted glass to avoid white-on-white blending
const light = {
  // Glass card surfaces — light gray tint so they stand out on white
  cardBg: "rgba(245, 245, 245, 0.6)",
  cardBgHover: "rgba(240, 240, 240, 0.75)",
  cardBorder: "rgba(0, 0, 0, 0.1)",
  cardBorderHover: "rgba(0, 0, 0, 0.16)",
  cardShadow:
    "0 4px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
  cardShadowHover:
    "0 8px 32px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.9)",

  // Text
  textPrimary: "#111827",
  textSecondary: "#374151",
  textMuted: "#4b5563",
  textSubtle: "#6b7280",
  textFaint: "#9ca3af",

  // Badge
  badgeBg: "rgba(245, 245, 245, 0.7)",
  badgeText: "#374151",
  badgeBorder: "rgba(0, 0, 0, 0.1)",

  // CTA / buttons
  ctaBg: "rgba(245, 245, 245, 0.6)",
  ctaBgHover: "rgba(240, 240, 240, 0.8)",
  ctaText: "#111827",
  ctaBorder: "rgba(0, 0, 0, 0.12)",
  ctaBorderHover: "rgba(0, 0, 0, 0.18)",
  ctaShadow:
    "0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
  ctaShadowHover:
    "0 6px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 1)",

  // Divider line
  dividerGradient:
    "linear-gradient(to right, transparent, rgba(0, 0, 0, 0.15), transparent)",
  dividerGlow:
    "linear-gradient(to right, transparent, rgba(0, 0, 0, 0.06), transparent)",

  // Image overlay gradient (GlassDestinationCard)
  imageOverlay:
    "linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent 40%)",
  imageCardText: "#ffffff",

  // Card outer shadow (destination cards)
  cardOuterShadow: "0 0 40px -15px rgba(0,0,0,0.12)",
  cardOuterShadowHover: "0 0 60px -15px rgba(0,0,0,0.18)",

  // Feature card accents
  accentTeal: "#0d9488",
  accentTealSubtle: "rgba(13, 148, 136, 0.3)",
  accentNeutral: "#4b5563",
  accentNeutralSubtle: "rgba(0, 0, 0, 0.1)",
  featureHoverBorderTeal: "rgba(13, 148, 136, 0.35)",
  featureHoverBorderNeutral: "rgba(0, 0, 0, 0.15)",

  // Footer
  footerDivider: "rgba(0, 0, 0, 0.1)",
  socialIconBg: "rgba(245, 245, 245, 0.6)",
  socialIconBgHover: "rgba(240, 240, 240, 0.8)",
  socialIconBorder: "rgba(0, 0, 0, 0.1)",
  socialIconBorderHover: "rgba(0, 0, 0, 0.14)",

  // Orbs
  orbOpacityMultiplier: 0.45,
  noiseOpacity: "0.02",
  noiseBlendMode: "multiply" as const,
} as const;

// Warm cream background — white glass cards pop naturally against the warm base
const beige = {
  ...light,

  // White glass on cream = natural contrast, no tinting needed
  cardBg: "rgba(255, 255, 255, 0.5)",
  cardBgHover: "rgba(255, 255, 255, 0.65)",
  cardBorder: "rgba(0, 0, 0, 0.06)",
  cardBorderHover: "rgba(0, 0, 0, 0.1)",
  cardShadow:
    "0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
  cardShadowHover:
    "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)",

  // Badge — white glass
  badgeBg: "rgba(255, 255, 255, 0.6)",
  badgeBorder: "rgba(0, 0, 0, 0.06)",

  // CTA — white glass
  ctaBg: "rgba(255, 255, 255, 0.5)",
  ctaBgHover: "rgba(255, 255, 255, 0.7)",
  ctaBorder: "rgba(0, 0, 0, 0.08)",
  ctaBorderHover: "rgba(0, 0, 0, 0.12)",
  ctaShadow:
    "0 4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
  ctaShadowHover:
    "0 6px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1)",

  // Card outer shadow
  cardOuterShadow: "0 0 40px -15px rgba(0,0,0,0.1)",
  cardOuterShadowHover: "0 0 60px -15px rgba(0,0,0,0.15)",

  // Social — white glass
  socialIconBg: "rgba(255, 255, 255, 0.5)",
  socialIconBgHover: "rgba(255, 255, 255, 0.7)",
  socialIconBorder: "rgba(0, 0, 0, 0.06)",
  socialIconBorderHover: "rgba(0, 0, 0, 0.1)",

  // Orbs slightly stronger — warm-cool interplay looks richer on cream
  orbOpacityMultiplier: 0.5,
} as const;

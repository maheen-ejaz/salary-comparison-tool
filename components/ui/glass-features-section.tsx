"use client";

import { type GlassTheme, getTheme } from "@/lib/glass-theme";

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

type AccentColor = "teal" | "white";

export function GlassFeaturesSection({
  features,
  accentColor = "teal",
  label,
  theme = "dark",
}: {
  features: Feature[];
  accentColor?: AccentColor;
  label?: string;
  theme?: GlassTheme;
}) {
  const t = getTheme(theme);
  const isTeal = accentColor === "teal";

  return (
    <section
      className="relative snap-start min-h-dvh flex flex-col items-center justify-center py-20 md:py-24 px-6"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 backdrop-blur-xl"
            style={{
              background: t.badgeBg,
              color: t.badgeText,
              border: `1px solid ${t.badgeBorder}`,
            }}
          >
            {label || "What You Get"}
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight leading-snug mt-4 mb-4"
            style={{ color: t.textPrimary }}
          >
            What you&apos;ll see for each country
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: t.textMuted }}
          >
            Detailed breakdowns to help you make an informed decision about your career abroad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {features.map((feature) => (
            <GlassFeatureCard
              key={feature.title}
              feature={feature}
              isTeal={isTeal}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GlassFeatureCard({
  feature,
  isTeal,
  theme = "dark",
}: {
  feature: Feature;
  isTeal: boolean;
  theme?: GlassTheme;
}) {
  const t = getTheme(theme);

  const hoverBorderColor = isTeal
    ? t.featureHoverBorderTeal
    : t.featureHoverBorderNeutral;

  return (
    <div
      className="group/feature relative rounded-2xl p-6 backdrop-blur-xl shadow-2xl transition-all duration-300"
      style={{
        background: t.cardBg,
        borderColor: t.cardBorder,
        border: `1px solid ${t.cardBorder}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = t.cardBgHover;
        e.currentTarget.style.borderColor = hoverBorderColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = t.cardBg;
        e.currentTarget.style.borderColor = t.cardBorder;
      }}
    >
      {/* Icon */}
      <div
        className="mb-4 [&_svg]:w-6 [&_svg]:h-6"
        style={{ color: isTeal ? t.accentTeal : t.accentNeutral }}
      >
        {feature.icon}
      </div>

      {/* Title with accent bar */}
      <div className="text-lg font-bold mb-2 relative pl-0">
        <div
          className="absolute -left-6 top-0 w-1 rounded-tr-full rounded-br-full transition-all duration-200 h-6 group-hover/feature:h-8"
          style={{
            backgroundColor: isTeal
              ? t.accentTealSubtle
              : t.accentNeutralSubtle,
          }}
        />
        <span
          className="group-hover/feature:translate-x-2 transition duration-200 inline-block"
          style={{ color: t.textPrimary }}
        >
          {feature.title}
        </span>
      </div>

      <p className="text-sm" style={{ color: t.textMuted }}>
        {feature.description}
      </p>

      <style jsx>{`
        .group\\/feature:hover div[class*="-left-6"] {
          background-color: ${isTeal ? t.accentTeal : t.accentNeutral} !important;
        }
      `}</style>
    </div>
  );
}

"use client";

import { ArrowRight } from "lucide-react";
import { type GlassTheme, getTheme } from "@/lib/glass-theme";

export function GlassHeroAccents({ theme = "dark" }: { theme?: GlassTheme }) {
  const t = getTheme(theme);

  return (
    <section
      className="relative w-full snap-start"
      style={{ height: "100dvh" }}
    >
      {/* Content */}
      <div className="relative z-[3] h-full flex flex-col px-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 backdrop-blur-xl"
            style={{
              background: t.badgeBg,
              color: t.badgeText,
              border: `1px solid ${t.badgeBorder}`,
            }}
          >
            Free Tool &middot; No Subscription Required
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.05] tracking-tight"
            style={{ color: t.textPrimary }}
          >
            How much can you save
            <br className="hidden md:block" /> as an Indian doctor abroad?
          </h1>
          <p
            className="text-lg md:text-xl leading-snug max-w-2xl mx-auto mb-10"
            style={{ color: t.textSecondary }}
          >
            See your real take-home pay after tax, cost of living, and exactly
            how long it takes to recover migration costs.
          </p>

          {/* Glass divider line */}
          <div className="w-48 mb-10 relative">
            <div
              className="h-px w-full rounded-full"
              style={{ background: t.dividerGradient }}
            />
            <div
              className="absolute inset-0 h-px w-full rounded-full blur-sm"
              style={{ background: t.dividerGlow }}
            />
          </div>

          {/* Frosted glass CTA */}
          <a
            href="#countries"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: t.ctaBg,
              color: t.ctaText,
              border: `1px solid ${t.ctaBorder}`,
              backdropFilter: "blur(24px)",
              boxShadow: t.ctaShadow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = t.ctaBgHover;
              e.currentTarget.style.borderColor = t.ctaBorderHover;
              e.currentTarget.style.boxShadow = t.ctaShadowHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = t.ctaBg;
              e.currentTarget.style.borderColor = t.ctaBorder;
              e.currentTarget.style.boxShadow = t.ctaShadow;
            }}
          >
            Explore Countries <ArrowRight size={18} />
          </a>
        </div>

        <div className="pb-8" />
      </div>
    </section>
  );
}

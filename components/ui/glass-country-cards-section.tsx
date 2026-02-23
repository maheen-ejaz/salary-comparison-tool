"use client";

import { COUNTRIES } from "@/lib/config/countries";
import { GlassDestinationCard } from "@/components/ui/glass-card-21";
import { type GlassTheme, getTheme } from "@/lib/glass-theme";

const COUNTRY_IMAGES: Record<string, string> = {
  uk: "/countries/uk.jpeg",
  au: "/countries/au.jpeg",
  ca: "/countries/ca.jpeg",
  ae: "/countries/ae.jpeg",
  nz: "/countries/nz.png",
  de: "/countries/de.jpeg",
};

export function GlassCountryCardsSection({ theme = "dark" }: { theme?: GlassTheme }) {
  const t = getTheme(theme);
  const countries = COUNTRIES.filter((c) => c.available);

  return (
    <section
      className="relative snap-start flex flex-col justify-center min-h-dvh py-16 px-6"
    >
      <div id="countries" className="max-w-5xl mx-auto w-full scroll-mt-8 relative z-10">
        <div className="text-center mb-10">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: t.textFaint }}
          >
            Explore salary data for
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight leading-snug mb-4"
            style={{ color: t.textPrimary }}
          >
            Choose your destination
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: t.textMuted }}
          >
            Select a country to see detailed salary breakdowns, tax
            calculations, and savings estimates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
          {countries.map((country) => (
            <div
              key={country.code}
              className="group/frame w-full max-w-[320px] h-[450px]"
            >
              {/* Glass frame */}
              <GlassFrame theme={theme}>
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <GlassDestinationCard
                    imageUrl={COUNTRY_IMAGES[country.code]}
                    location={country.name}
                    flag={country.flag}
                    href={`/${country.code}`}
                    theme={theme}
                    className="!rounded-xl"
                  />
                </div>
              </GlassFrame>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GlassFrame({ theme = "dark", children }: { theme?: GlassTheme; children: React.ReactNode }) {
  const t = getTheme(theme);

  return (
    <div
      className="w-full h-full rounded-2xl p-2.5 backdrop-blur-xl shadow-2xl transition-all duration-500"
      style={{
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = t.cardBgHover;
        e.currentTarget.style.borderColor = t.cardBorderHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = t.cardBg;
        e.currentTarget.style.borderColor = t.cardBorder;
      }}
    >
      {children}
    </div>
  );
}

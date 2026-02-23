import { COUNTRIES } from "@/lib/config/countries";
import { DestinationCard } from "@/components/ui/card-21";

const COUNTRY_IMAGES: Record<string, string> = {
  uk: "/countries/uk.webp",
  au: "/countries/au.webp",
  ca: "/countries/ca.webp",
  ae: "/countries/ae.webp",
  nz: "/countries/nz.webp",
  de: "/countries/de.webp",
};

const COUNTRY_THEME_COLORS: Record<string, string> = {
  uk: "220 60% 30%",
  au: "45 80% 40%",
  ca: "0 70% 40%",
  ae: "145 50% 30%",
  nz: "210 40% 25%",
  de: "40 90% 35%",
};

export function CountryCardsSection() {
  const countries = COUNTRIES.filter((c) => c.available);

  return (
    <section
      className="snap-start flex flex-col justify-center min-h-dvh py-16 px-6"
      style={{ background: "var(--neutral-50)" }}
    >
      <div id="countries" className="max-w-5xl mx-auto w-full scroll-mt-8">
        <div className="text-center mb-10">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--neutral-300)" }}
          >
            Explore salary data for
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight leading-snug mb-4"
            style={{ color: "var(--primary-900)" }}
          >
            Choose your destination
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "var(--neutral-600)" }}
          >
            Select a country to see detailed salary breakdowns, tax
            calculations, and savings estimates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
          {countries.map((country) => (
            <div
              key={country.code}
              className="w-full max-w-[320px] h-[450px]"
            >
              <DestinationCard
                imageUrl={COUNTRY_IMAGES[country.code]}
                location={country.name}
                flag={country.flag}
                stats={country.migrationRoute}
                href={`/${country.code}`}
                themeColor={COUNTRY_THEME_COLORS[country.code]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COUNTRIES } from "@/lib/config/countries";

const COUNTRY_IMAGES: Record<string, string> = {
  uk: "/countries/uk.jpeg",
  au: "/countries/au.png",
  ca: "/countries/ca.png",
  ae: "/countries/ae.jpeg",
  nz: "/countries/nz.jpeg",
  de: "/countries/de.jpeg",
};

export function CountryCardsSection() {
  const countries = COUNTRIES.filter((c) => c.available);

  return (
    <section
      className="flex flex-col justify-center min-h-dvh py-16 px-6"
      style={{ background: "var(--neutral-50)" }}
    >
      <div id="countries" className="max-w-6xl mx-auto w-full scroll-mt-8">
        <div className="text-center mb-10">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--neutral-300)" }}
          >
            Explore salary data for
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {countries.map((country) => (
            <Link
              key={country.code}
              href={`/${country.code}`}
              className="group"
            >
              <div className="relative h-64 md:h-72 overflow-hidden rounded-xl">
                <Image
                  src={COUNTRY_IMAGES[country.code]}
                  alt={country.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="mb-1 text-xl font-semibold">
                    <span className="mr-2">{country.flag}</span>
                    {country.name}
                  </div>
                  <div className="mb-4 text-sm text-white/80">
                    {country.migrationRoute}
                  </div>
                  <div className="flex items-center text-sm font-medium opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    Explore{" "}
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Banknote, BarChart3, Home, BadgeIndianRupee, Timer, Globe } from "lucide-react";
import { HeroSection } from "@/components/hero/HeroSection";
import { CountryCardsSection } from "@/components/ui/country-cards-section";
import { FeaturesSectionWithHoverEffects, type Feature } from "@/components/ui/feature-section-with-hover-effects";
import { FooterSection } from "@/components/ui/footer-section";

const features: Feature[] = [
  {
    title: "Gross Salary",
    description: "By career stage (FY1 to Consultant) and NHS vs Private sector",
    icon: <Banknote />,
  },
  {
    title: "Full Tax Breakdown",
    description: "Income Tax, National Insurance, and NHS Pension contributions",
    icon: <BarChart3 />,
  },
  {
    title: "Cost of Living",
    description: "Rent, transport, groceries by city, lifestyle, and accommodation type",
    icon: <Home />,
  },
  {
    title: "Monthly Savings in INR",
    description: "Real take-home minus expenses, converted to INR at live exchange rates",
    icon: <BadgeIndianRupee />,
  },
  {
    title: "Break-Even Timeline",
    description: "How long to recover PLAB/visa/exam costs from your monthly savings",
    icon: <Timer />,
  },
  {
    title: "Country Comparison",
    description: "Side-by-side summary across all countries (more countries coming soon)",
    icon: <Globe />,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--neutral-50)" }}>

      {/* Hero (full viewport, Ken Burns background images) */}
      <HeroSection />

      {/* Country cards */}
      <CountryCardsSection />

      {/* Features */}
      <section id="features" className="py-20 md:py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">What You Get</span>
            <h2
              className="text-3xl md:text-4xl font-bold mt-4 mb-4"
              style={{ color: "var(--primary-900)" }}
            >
              What you&apos;ll see for each country
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "var(--neutral-600)" }}
            >
              Detailed breakdowns to help you make an informed decision about your career abroad.
            </p>
          </div>
          <FeaturesSectionWithHoverEffects features={features} />
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}

import { Banknote, BarChart3, Home, BadgeIndianRupee, Timer, Globe } from "lucide-react";
import { HeroSection } from "@/components/hero/HeroSection";
import { GlassCountryCardsSection } from "@/components/ui/glass-country-cards-section";
import { GlassFeaturesSection, type Feature } from "@/components/ui/glass-features-section";
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
      <GlassCountryCardsSection theme="light" />

      {/* Features */}
      <div id="features">
        <GlassFeaturesSection features={features} theme="light" />
      </div>

      {/* Footer */}
      <FooterSection />
    </main>
  );
}

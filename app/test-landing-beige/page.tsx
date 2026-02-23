import { Banknote, BarChart3, Home, BadgeIndianRupee, Timer, Globe } from "lucide-react";
import { GlassHeroAccents } from "@/components/hero/GlassHeroAccents";
import { GlassCountryCardsSection } from "@/components/ui/glass-country-cards-section";
import { GlassFeaturesSection, type Feature } from "@/components/ui/glass-features-section";
import { GlassFooterSection } from "@/components/ui/glass-footer-section";


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

export default function TestLandingBeigePage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#faf7f2" }}
    >
      {/* Hero */}
      <GlassHeroAccents theme="beige" />

      {/* Country cards */}
      <GlassCountryCardsSection theme="beige" />

      {/* Features */}
      <GlassFeaturesSection features={features} accentColor="white" theme="beige" />

      {/* Footer */}
      <GlassFooterSection theme="beige" />
    </main>
  );
}

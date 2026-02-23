import { Banknote, BarChart3, Home, BadgeIndianRupee, Timer, Globe } from "lucide-react";
import { GlassHeroAccents } from "@/components/hero/GlassHeroAccents";
import { GlassCountryCardsSection } from "@/components/ui/glass-country-cards-section";
import { GlassFeaturesSection, type Feature } from "@/components/ui/glass-features-section";
import { GlassFooterSection } from "@/components/ui/glass-footer-section";
import { PageOrbs } from "@/components/ui/page-orbs";

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

export default function TestLandingLightPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 80% 40% at 15% 8%, rgba(13, 148, 136, 0.14) 0%, transparent 70%),
          radial-gradient(ellipse 70% 35% at 85% 5%, rgba(6, 182, 212, 0.07) 0%, transparent 60%),
          radial-gradient(ellipse 60% 30% at 50% 22%, rgba(5, 150, 105, 0.09) 0%, transparent 65%),
          radial-gradient(ellipse 80% 40% at 80% 20%, rgba(37, 99, 235, 0.10) 0%, transparent 70%),
          radial-gradient(ellipse 70% 35% at 25% 42%, rgba(37, 99, 235, 0.09) 0%, transparent 65%),
          radial-gradient(ellipse 60% 30% at 75% 38%, rgba(13, 148, 136, 0.10) 0%, transparent 70%),
          radial-gradient(ellipse 50% 30% at 50% 55%, rgba(5, 150, 105, 0.07) 0%, transparent 60%),
          radial-gradient(ellipse 70% 35% at 20% 68%, rgba(6, 182, 212, 0.05) 0%, transparent 55%),
          radial-gradient(ellipse 60% 30% at 80% 72%, rgba(13, 148, 136, 0.07) 0%, transparent 65%),
          radial-gradient(ellipse 50% 25% at 40% 88%, rgba(37, 99, 235, 0.05) 0%, transparent 60%),
          radial-gradient(ellipse 60% 30% at 70% 95%, rgba(6, 182, 212, 0.04) 0%, transparent 55%),
          #ffffff
        `,
      }}
    >
      {/* Page-level floating orbs + noise texture */}
      <PageOrbs theme="light" />

      {/* Hero */}
      <GlassHeroAccents theme="light" />

      {/* Country cards */}
      <GlassCountryCardsSection theme="light" />

      {/* Features */}
      <GlassFeaturesSection features={features} accentColor="white" theme="light" />

      {/* Footer */}
      <GlassFooterSection theme="light" />
    </main>
  );
}

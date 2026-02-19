import Link from "next/link";
import { COUNTRIES } from "@/lib/config/countries";
import { ArrowRight, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--neutral-50)" }}>
      {/* Header */}
      <header className="px-6 py-4" style={{ background: "var(--primary-900)" }}>
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "var(--accent-400)", color: "var(--primary-900)" }}
          >
            GC
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            GCWorld Salary Comparison Tool
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
          style={{ background: "var(--accent-100)", color: "var(--accent-600)" }}
        >
          Free Tool · No Subscription Required
        </span>
        <h1
          className="text-4xl md:text-5xl font-bold mb-5 leading-tight"
          style={{ color: "var(--primary-900)" }}
        >
          How much can you save
          <br className="hidden md:block" /> as an Indian doctor abroad?
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-12" style={{ color: "var(--neutral-600)" }}>
          See your real take-home pay after tax, cost of living, and exactly how long
          it takes to recover migration costs — by career stage, city, and lifestyle.
        </p>

        {/* Country Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {COUNTRIES.map((country) =>
            country.available ? (
              <Link
                key={country.code}
                href={`/${country.code}`}
                className="group relative rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-white"
                style={{ border: "1.5px solid var(--primary-200)" }}
              >
                <div className="text-4xl mb-3">{country.flag}</div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--primary-900)" }}>
                  {country.name}
                </h2>
                <p className="text-sm mb-4" style={{ color: "var(--neutral-600)" }}>
                  via {country.migrationRoute}
                </p>
                <div
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "var(--primary-700)" }}
                >
                  See breakdown
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ) : (
              <div
                key={country.code}
                className="relative rounded-2xl p-6 text-left"
                style={{ background: "var(--neutral-100)", border: "1.5px solid var(--neutral-200)" }}
              >
                <div className="text-4xl mb-3" style={{ filter: "grayscale(1)" }}>{country.flag}</div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--neutral-600)" }}>
                  {country.name}
                </h2>
                <p className="text-sm mb-4" style={{ color: "var(--neutral-400)" }}>
                  {country.comingSoonTeaser ?? "Coming soon"}
                </p>
                <div
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: "var(--neutral-400)" }}
                >
                  <Lock size={12} />
                  Coming Soon
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* What the tool shows */}
      <section className="py-16 px-6" style={{ background: "var(--primary-100)" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: "var(--primary-900)" }}>
            What you&apos;ll see for each country
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: "💷", title: "Gross Salary", desc: "By career stage (FY1 to Consultant) and NHS vs Private sector" },
              { icon: "📊", title: "Full Tax Breakdown", desc: "Income Tax, National Insurance, and NHS Pension contributions" },
              { icon: "🏠", title: "Cost of Living", desc: "Rent, transport, groceries by city, lifestyle, and accommodation type" },
              { icon: "💰", title: "Monthly Savings in ₹", desc: "Real take-home minus expenses, converted to INR at live exchange rates" },
              { icon: "⏱️", title: "Break-Even Timeline", desc: "How long to recover PLAB/visa/exam costs from your monthly savings" },
              { icon: "🌍", title: "Country Comparison", desc: "Side-by-side summary across all countries (more countries coming soon)" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-5"
                style={{ border: "1px solid var(--primary-200)" }}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold mb-1" style={{ color: "var(--primary-900)" }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--neutral-600)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm" style={{ color: "var(--neutral-400)" }}>
        <p>GCWorld Salary Comparison Tool · Free forever · For planning purposes only</p>
        <p className="mt-1">
          Data verified Feb 2026. Always verify with official sources before making decisions.
        </p>
      </footer>
    </main>
  );
}

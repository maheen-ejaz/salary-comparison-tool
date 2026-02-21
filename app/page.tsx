import Link from "next/link";
import { COUNTRIES } from "@/lib/config/countries";
import { ArrowRight, ChevronRight } from "lucide-react";

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
            Salary Comparison Tool by GooCampus World
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
      </section>

      {/* Country cards */}
      <section className="py-16 px-6" style={{ background: "var(--neutral-50)" }}>
        <div id="countries" className="max-w-2xl mx-auto scroll-mt-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6 text-center"
            style={{ color: "var(--neutral-300)" }}
          >
            Explore salary data for
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COUNTRIES.filter((c) => c.available).map((country) => (
              <Link
                key={country.code}
                href={`/${country.code}`}
                className="group flex items-center gap-2.5 py-3 px-4 rounded-xl border-l-3 border bg-white transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{
                  borderColor: "var(--neutral-200)",
                  borderLeftColor: "var(--primary-500)",
                }}
              >
                <span className="text-xl">{country.flag}</span>
                <span
                  className="text-sm font-medium flex-1"
                  style={{ color: "var(--primary-900)" }}
                >
                  {country.name}
                </span>
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                  style={{ color: "var(--neutral-400)" }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: "💷", title: "Gross Salary", desc: "By career stage (FY1 to Consultant) and NHS vs Private sector", bg: "var(--primary-50)" },
              { icon: "📊", title: "Full Tax Breakdown", desc: "Income Tax, National Insurance, and NHS Pension contributions", bg: "var(--error-100)" },
              { icon: "🏠", title: "Cost of Living", desc: "Rent, transport, groceries by city, lifestyle, and accommodation type", bg: "var(--warning-100)" },
              { icon: "💰", title: "Monthly Savings in INR", desc: "Real take-home minus expenses, converted to INR at live exchange rates", bg: "var(--success-100)" },
              { icon: "⏱️", title: "Break-Even Timeline", desc: "How long to recover PLAB/visa/exam costs from your monthly savings", bg: "var(--primary-100)" },
              { icon: "🌍", title: "Country Comparison", desc: "Side-by-side summary across all countries (more countries coming soon)", bg: "var(--neutral-100)" },
            ].map((item) => (
              <div
                key={item.title}
                className="card-hover rounded-[20px] p-8"
                style={{
                  background: "var(--neutral-50)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: item.bg }}
                >
                  {item.icon}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--primary-900)" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--neutral-600)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12" style={{ background: "var(--primary-900)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">Salary Comparison Tool by</span>
              <img src="/goocampus-logo-white.png" alt="GooCampus World" className="h-6" />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {COUNTRIES.filter((c) => c.available).map((country) => (
                <Link
                  key={country.code}
                  href={`/${country.code}`}
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: "var(--neutral-400)" }}
                >
                  {country.flag} {country.name}
                </Link>
              ))}
            </div>
          </div>
          <div
            className="pt-8 flex flex-col md:flex-row md:justify-between gap-2 text-sm"
            style={{ borderTop: "1px solid var(--neutral-700)", color: "var(--neutral-400)" }}
          >
            <p>Salary Comparison Tool by GooCampus World · Free forever · For planning purposes only</p>
            <p>Data verified Feb 2026. Always verify with official sources.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

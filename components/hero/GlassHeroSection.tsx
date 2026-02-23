"use client";

import { ArrowRight } from "lucide-react";

export function GlassHeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden snap-start"
      style={{
        height: "100dvh",
        background: `
          radial-gradient(ellipse 80% 60% at 15% 20%, rgba(13, 148, 136, 0.4) 0%, transparent 70%),
          radial-gradient(ellipse 70% 50% at 85% 15%, rgba(6, 182, 212, 0.2) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 50% 85%, rgba(5, 150, 105, 0.25) 0%, transparent 65%),
          radial-gradient(ellipse 80% 70% at 80% 80%, rgba(37, 99, 235, 0.3) 0%, transparent 70%),
          #0a0f1a
        `,
      }}
    >
      {/* Floating gradient orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(13, 148, 136, 0.6) 0%, transparent 70%)",
          top: "5%",
          left: "-5%",
          animation: "orb-drift-1 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-25 blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.5) 0%, transparent 70%)",
          bottom: "5%",
          right: "-5%",
          animation: "orb-drift-2 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-[60px]"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, transparent 70%)",
          top: "40%",
          right: "20%",
          animation: "orb-drift-3 18s ease-in-out infinite",
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Content */}
      <div className="relative z-[3] h-full flex flex-col px-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          <div className="bg-white/[0.07] border border-white/[0.12] backdrop-blur-xl rounded-3xl px-8 py-12 md:px-12 md:py-16 flex flex-col items-center shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 bg-white/[0.1] text-white/80 border border-white/[0.08] backdrop-blur-sm">
              Free Tool &middot; No Subscription Required
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-[1.05] tracking-tight text-white drop-shadow-lg">
              How much can you save
              <br className="hidden md:block" /> as an Indian doctor abroad?
            </h1>
            <p className="text-lg md:text-xl leading-snug max-w-2xl mx-auto mb-10 text-white/70">
              See your real take-home pay after tax, cost of living, and exactly
              how long it takes to recover migration costs.
            </p>
            <a
              href="#countries"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-[#0a0f1a] font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 shadow-[0_2px_12px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.25)]"
            >
              Explore Countries <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="pb-8" />
      </div>

      {/* Orb animation keyframes */}
      <style jsx>{`
        @keyframes orb-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, 30px) scale(1.05); }
          66% { transform: translate(-20px, -15px) scale(0.95); }
        }
        @keyframes orb-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, -25px) scale(1.08); }
          66% { transform: translate(25px, 20px) scale(0.92); }
        }
        @keyframes orb-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-35px, 25px) scale(1.1); }
        }
      `}</style>
    </section>
  );
}

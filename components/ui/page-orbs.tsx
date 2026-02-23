"use client";

import { type GlassTheme, getTheme } from "@/lib/glass-theme";

const orbs = [
  { w: 600, h: 600, blur: 120, gradient: "rgba(13, 148, 136, 0.5)", top: "3%", left: "-8%", baseOpacity: 0.45, anim: "orb-1 22s" },
  { w: 500, h: 500, blur: 100, gradient: "rgba(37, 99, 235, 0.5)", top: "8%", right: "-5%", baseOpacity: 0.4, anim: "orb-2 28s" },
  { w: 400, h: 400, blur: 90, gradient: "rgba(6, 182, 212, 0.5)", top: "22%", right: "15%", baseOpacity: 0.35, anim: "orb-3 18s" },
  { w: 550, h: 550, blur: 110, gradient: "rgba(5, 150, 105, 0.45)", top: "38%", left: "-6%", baseOpacity: 0.4, anim: "orb-4 25s" },
  { w: 450, h: 450, blur: 100, gradient: "rgba(37, 99, 235, 0.45)", top: "50%", right: "-4%", baseOpacity: 0.35, anim: "orb-5 20s" },
  { w: 500, h: 500, blur: 100, gradient: "rgba(13, 148, 136, 0.45)", top: "65%", left: "10%", baseOpacity: 0.4, anim: "orb-6 24s" },
  { w: 400, h: 400, blur: 90, gradient: "rgba(6, 182, 212, 0.4)", top: "80%", right: "5%", baseOpacity: 0.35, anim: "orb-7 19s" },
] as const;

export function PageOrbs({ theme = "dark" }: { theme?: GlassTheme }) {
  const t = getTheme(theme);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.w,
            height: orb.h,
            filter: `blur(${orb.blur}px)`,
            background: `radial-gradient(circle, ${orb.gradient} 0%, transparent 70%)`,
            top: orb.top,
            ...("left" in orb ? { left: orb.left } : { right: orb.right }),
            opacity: orb.baseOpacity * t.orbOpacityMultiplier,
            animation: `${orb.anim} ease-in-out infinite`,
          }}
        />
      ))}

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0"
        style={{
          opacity: parseFloat(t.noiseOpacity),
          mixBlendMode: t.noiseBlendMode,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Orb animation keyframes */}
      <style jsx>{`
        @keyframes orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, 40px) scale(1.05); }
          66% { transform: translate(-30px, -20px) scale(0.95); }
        }
        @keyframes orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, -30px) scale(1.08); }
          66% { transform: translate(30px, 25px) scale(0.92); }
        }
        @keyframes orb-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-45px, 30px) scale(1.1); }
        }
        @keyframes orb-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -35px) scale(1.06); }
          66% { transform: translate(-25px, 20px) scale(0.94); }
        }
        @keyframes orb-5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-35px, -25px) scale(1.08); }
        }
        @keyframes orb-6 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, 35px) scale(1.05); }
          66% { transform: translate(-40px, -15px) scale(0.95); }
        }
        @keyframes orb-7 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 20px) scale(1.07); }
          66% { transform: translate(25px, -30px) scale(0.93); }
        }
      `}</style>
    </div>
  );
}

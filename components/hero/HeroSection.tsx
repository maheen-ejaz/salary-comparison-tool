"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";

const IMAGES = [
  "/hero/uk.webp",
  "/hero/australia.webp",
  "/hero/canada.webp",
  "/hero/germany.webp",
  "/hero/nz.webp",
  "/hero/uae.webp",
];

const CYCLE_DURATION = 6000;
const FADE_DURATION = 1000;

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const advance = useCallback(() => {
    setCurrentIndex((prev) => {
      setPreviousIndex(prev);
      setIsTransitioning(true);
      return (prev + 1) % IMAGES.length;
    });
  }, []);

  // Image cycling timer
  useEffect(() => {
    const timer = setInterval(advance, CYCLE_DURATION);
    return () => clearInterval(timer);
  }, [advance]);

  // Clear previous image after fade completes
  useEffect(() => {
    if (!isTransitioning) return;
    const fadeTimer = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousIndex(null);
    }, FADE_DURATION);
    return () => clearTimeout(fadeTimer);
  }, [isTransitioning]);

  // Preload first image immediately, defer the rest
  useEffect(() => {
    const first = new window.Image();
    first.src = IMAGES[0];
    const timer = setTimeout(() => {
      IMAGES.slice(1).forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Resync on tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        advance();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [advance]);

  return (
    <section className="relative w-full overflow-hidden snap-start" style={{ height: "100dvh" }}>
      {/* Background images */}
      <div className="absolute inset-0">
        {/* Previous image (fading out) */}
        {previousIndex !== null && (
          <div
            key={`out-${previousIndex}`}
            className="hero-slide absolute inset-0"
            style={{
              backgroundImage: `url(${IMAGES[previousIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              animation: `hero-fade-out ${FADE_DURATION}ms ease-out forwards`,
              willChange: "opacity",
            }}
          />
        )}
        {/* Current image (fading in + Ken Burns) */}
        <div
          key={`in-${currentIndex}`}
          className="hero-slide absolute inset-0"
          style={{
            backgroundImage: `url(${IMAGES[currentIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: `${currentIndex % 2 === 0 ? 'kenburns-in' : 'kenburns-out'} ${CYCLE_DURATION}ms ease-in-out forwards, hero-fade-in ${FADE_DURATION}ms ease-out forwards`,
            willChange: "transform, opacity",
          }}
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/60 via-black/30 to-black/60" />

      {/* Content */}
      <div className="relative z-[3] h-full flex flex-col px-6">
        {/* Centered hero content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-3xl px-8 py-12 md:px-12 md:py-16 flex flex-col items-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6 bg-white/15 text-white backdrop-blur-sm">
              Free Tool &middot; No Subscription Required
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-[1.05] tracking-tight text-white drop-shadow-lg">
              How much can you save
              <br className="hidden md:block" /> as an Indian doctor abroad?
            </h1>
            <p className="text-lg md:text-xl leading-snug max-w-2xl mx-auto mb-10 text-white/85">
              See your real take-home pay after tax, cost of living, and exactly
              how long it takes to recover migration costs.
            </p>
            <a href="#countries" className="btn-cta">
              Explore Countries <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="pb-8" />
      </div>
    </section>
  );
}

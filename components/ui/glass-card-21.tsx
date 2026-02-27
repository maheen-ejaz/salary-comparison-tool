"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { type GlassTheme, getTheme } from "@/lib/glass-theme";

interface GlassDestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  location: string;
  flag: string;
  href: string;
  theme?: GlassTheme;
}

const GlassDestinationCard = React.forwardRef<HTMLDivElement, GlassDestinationCardProps>(
  (
    { className, imageUrl, location, flag, href, theme = "dark", ...props },
    ref
  ) => {
    const t = getTheme(theme);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const el = cardRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: "200px" }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={(node) => {
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn("group w-full", className)}
        {...props}
      >
        <Link
          href={href}
          className="relative block w-full rounded-2xl overflow-hidden
                     backdrop-blur-md transition-all duration-500 ease-in-out"
          aria-label={`Explore details for ${location}`}
          style={{
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            boxShadow: t.cardShadow,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = t.cardBgHover;
            e.currentTarget.style.borderColor = t.cardBorderHover;
            e.currentTarget.style.boxShadow = t.cardShadowHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = t.cardBg;
            e.currentTarget.style.borderColor = t.cardBorder;
            e.currentTarget.style.boxShadow = t.cardShadow;
          }}
        >
          {/* Embedded Image */}
          <div className="mx-3 mt-3 rounded-xl overflow-hidden h-80">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
              style={isVisible ? { backgroundImage: `url(${imageUrl})` } : undefined}
            />
          </div>

          {/* Text Content */}
          <div className="p-4">
            <h3
              className="text-2xl font-bold tracking-tight"
              style={{ color: t.textPrimary }}
            >
              {location} <span className="text-xl ml-1">{flag}</span>
            </h3>

            {/* Explore Button */}
            <div
              className="mt-3 flex items-center justify-between rounded-lg px-4 py-3 transition-all duration-300"
              style={{
                background: t.ctaBg,
                border: `1px solid ${t.ctaBorder}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = t.ctaBgHover;
                e.currentTarget.style.borderColor = t.ctaBorderHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = t.ctaBg;
                e.currentTarget.style.borderColor = t.ctaBorder;
              }}
            >
              <span
                className="text-sm font-semibold tracking-wide"
                style={{ color: t.ctaText }}
              >
                Explore Now
              </span>
              <ArrowRight
                className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: t.ctaText }}
              />
            </div>
          </div>
        </Link>
      </div>
    );
  }
);
GlassDestinationCard.displayName = "GlassDestinationCard";

export { GlassDestinationCard };

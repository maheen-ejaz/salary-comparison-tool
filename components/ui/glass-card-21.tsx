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
        className={cn("group w-full h-full", className)}
        {...props}
      >
        <Link
          href={href}
          className="relative block w-full h-full rounded-2xl overflow-hidden
                     transition-all duration-500 ease-in-out
                     group-hover:scale-105"
          aria-label={`Explore details for ${location}`}
          style={{
            boxShadow: t.cardOuterShadow,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = t.cardOuterShadowHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = t.cardOuterShadow;
          }}
        >
          {/* Background Image with Parallax Zoom — lazy loaded */}
          <div
            className="absolute inset-0 bg-cover bg-center
                       transition-transform duration-500 ease-in-out group-hover:scale-110"
            style={isVisible ? { backgroundImage: `url(${imageUrl})` } : undefined}
          />

          {/* Uniform Frosted Glass Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: t.imageOverlay,
            }}
          />

          {/* Content */}
          <div
            className="relative flex flex-col justify-end h-full p-6"
            style={{ color: t.imageCardText }}
          >
            <div
              className="backdrop-blur-md rounded-xl p-4"
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <h3 className="text-3xl font-bold tracking-tight text-white">
                {location} <span className="text-2xl ml-1">{flag}</span>
              </h3>

              {/* Explore Button */}
              <div
                className="mt-4 flex items-center justify-between rounded-lg px-4 py-3 transition-all duration-300"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                }}
              >
                <span className="text-sm font-semibold tracking-wide text-white">
                  Explore Now
                </span>
                <ArrowRight className="h-4 w-4 text-white transform transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
);
GlassDestinationCard.displayName = "GlassDestinationCard";

export { GlassDestinationCard };

"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  location: string;
  flag: string;
  stats: string;
  href: string;
  themeColor: string;
}

const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  (
    { className, imageUrl, location, flag, stats, href, themeColor, ...props },
    ref
  ) => {
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
        style={
          {
            "--theme-color": themeColor,
          } as React.CSSProperties
        }
        className={cn("group w-full h-full", className)}
        {...props}
      >
        <Link
          href={href}
          className="relative block w-full h-full rounded-2xl overflow-hidden shadow-lg
                     transition-all duration-500 ease-in-out
                     group-hover:scale-105 group-hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.6)]"
          aria-label={`Explore details for ${location}`}
          style={{
            boxShadow: `0 0 40px -15px hsl(var(--theme-color) / 0.5)`,
          }}
        >
          {/* Background Image with Parallax Zoom — lazy loaded */}
          <div
            className="absolute inset-0 bg-cover bg-center
                       transition-transform duration-500 ease-in-out group-hover:scale-110"
            style={isVisible ? { backgroundImage: `url(${imageUrl})` } : undefined}
          />

          {/* Themed Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, hsl(var(--theme-color) / 0.9), hsl(var(--theme-color) / 0.6) 30%, transparent 60%)`,
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col justify-end h-full p-6 text-white">
            <h3 className="text-3xl font-bold tracking-tight">
              {location} <span className="text-2xl ml-1">{flag}</span>
            </h3>
            <p className="text-sm text-white/80 mt-1 font-medium">{stats}</p>

            {/* Explore Button */}
            <div
              className="mt-8 flex items-center justify-between bg-[hsl(var(--theme-color)/0.2)] backdrop-blur-md border border-[hsl(var(--theme-color)/0.3)]
                           rounded-lg px-4 py-3
                           transition-all duration-300
                           group-hover:bg-[hsl(var(--theme-color)/0.4)] group-hover:border-[hsl(var(--theme-color)/0.5)]"
            >
              <span className="text-sm font-semibold tracking-wide">
                Explore Now
              </span>
              <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>
    );
  }
);
DestinationCard.displayName = "DestinationCard";

export { DestinationCard };

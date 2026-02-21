"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export interface NavSection {
  id: string;
  label: string;
  shortLabel: string;
}

interface Props {
  sections: NavSection[];
}

export function SectionNav({ sections }: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const navRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the topmost visible section
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length > 0) {
      setActiveId(visible[0].target.id);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "-120px 0px -60% 0px",
      threshold: 0.1,
    });

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, handleObserver]);

  // Scroll active button into view on mobile
  useEffect(() => {
    if (activeBtnRef.current && navRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeId]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="sticky z-[9] -mx-4 sm:-mx-6 px-4 sm:px-6 py-2"
      style={{ top: 56, background: "var(--neutral-50)", borderBottom: "1px solid var(--neutral-200)" }}
    >
      <div
        ref={navRef}
        className="flex gap-1.5 overflow-x-auto scrollbar-hide max-w-5xl mx-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {sections.map((s) => {
          const isActive = activeId === s.id;
          return (
            <button
              key={s.id}
              ref={isActive ? activeBtnRef : undefined}
              onClick={() => scrollTo(s.id)}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
              style={{
                background: isActive ? "var(--primary-700)" : "var(--neutral-100)",
                color: isActive ? "white" : "var(--neutral-600)",
                border: isActive ? "1px solid var(--primary-700)" : "1px solid var(--neutral-200)",
              }}
            >
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

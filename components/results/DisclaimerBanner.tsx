"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const DISCLAIMERS = [
  "For planning purposes only. Actual take-home pay depends on your personal tax situation, deductions, and other individual circumstances.",
  "Data verified February 2026. Consult a qualified financial adviser and immigration professional before making decisions.",
  "Public sector pay is based on published award rates and collective agreements. Verify current rates with the relevant employer or government body.",
  "Cost of living figures reflect city-wide averages. Actual costs vary by neighbourhood and personal choices.",
  "Migration costs shown are estimates. Verify current registration, licensing, and visa fees directly with official bodies before applying.",
];

const VISIBLE_COUNT = 2;

export function DisclaimerBanner() {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? DISCLAIMERS : DISCLAIMERS.slice(0, VISIBLE_COUNT);

  return (
    <div
      className="rounded-2xl px-6 py-5 text-sm space-y-2"
      style={{
        background: "var(--neutral-100)",
        border: "1px solid var(--neutral-200)",
        color: "var(--neutral-600)",
      }}
    >
      <p className="font-semibold" style={{ color: "var(--neutral-700)" }}>Important Disclaimers</p>
      <ul className="space-y-1.5 list-none">
        {visibleItems.map((text, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: "var(--neutral-400)" }} />
            {text}
          </li>
        ))}
      </ul>
      {DISCLAIMERS.length > VISIBLE_COUNT && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-medium mt-2 cursor-pointer"
          style={{ color: "var(--primary-600)" }}
        >
          {expanded ? (
            <>
              Show fewer <ChevronUp size={14} />
            </>
          ) : (
            <>
              See all {DISCLAIMERS.length} disclaimers <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import type { MigrationCosts, MigrationCostCategory } from "@/lib/data/types";
import { formatInr, formatInrLakh, formatMonths } from "@/lib/calc/uk/taxCalculator";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

interface RecoveryData {
  isNegativeSavings: boolean;
  recoveryMonthsMin: number;
  recoveryMonthsTypical: number;
  recoveryMonthsMax: number;
}

interface Props {
  savings: RecoveryData;
  migrationCosts: MigrationCosts;
}

const CATEGORY_ORDER: MigrationCostCategory[] = [
  "Exams & Registration",
  "Visa & Immigration",
  "Preparation & Coaching",
  "Travel & Logistics",
];

const PEEK_COUNT = 3;

export function MigrationTimelineCard({ savings, migrationCosts }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isNeg = savings.isNegativeSavings;

  const itemCount = migrationCosts.lineItems.length;
  const lineItemSum = migrationCosts.lineItems.reduce(
    (sum, item) => sum + item.amountInr,
    0
  );

  const grouped = CATEGORY_ORDER.map((cat) => {
    const items = migrationCosts.lineItems.filter((li) => li.category === cat);
    const subtotal = items.reduce((s, li) => s + li.amountInr, 0);
    return { category: cat, items, subtotal };
  }).filter((g) => g.items.length > 0);

  // Flatten items in category order for peek display
  const allFlatItems = grouped.flatMap((g) => g.items);
  const peekItems = allFlatItems.slice(0, PEEK_COUNT);
  const remainingCount = Math.max(0, allFlatItems.length - PEEK_COUNT);

  const scenarios = [
    { label: "Best Case", months: savings.recoveryMonthsMin, cost: migrationCosts.totalMin, color: "var(--success-600)" },
    { label: "Typical", months: savings.recoveryMonthsTypical, cost: migrationCosts.totalTypical, color: "var(--primary-700)" },
    { label: "Worst Case", months: savings.recoveryMonthsMax, cost: migrationCosts.totalMax, color: "var(--warning-600)" },
  ];

  // Helper: render a single line item row
  const renderLineItem = (
    item: { key: string; label: string; amountInr: number },
    rowIndex: number
  ) => {
    const pct =
      lineItemSum > 0
        ? Math.round((item.amountInr / lineItemSum) * 100)
        : 0;
    return (
      <div
        key={item.key}
        className="flex items-center justify-between px-4 py-2 text-sm"
        style={{
          background: rowIndex % 2 === 0 ? "white" : "var(--neutral-50)",
        }}
      >
        <span style={{ color: "var(--neutral-600)" }}>{item.label}</span>
        <div className="flex items-center gap-3">
          <span
            className="text-xs tabular-nums"
            style={{
              color: "var(--neutral-400)",
              minWidth: "2rem",
              textAlign: "right",
            }}
          >
            {pct}%
          </span>
          <span
            className="tabular-nums font-medium"
            style={{
              color: "var(--neutral-900)",
              minWidth: "5.5rem",
              textAlign: "right",
            }}
          >
            {formatInr(item.amountInr)}
          </span>
        </div>
      </div>
    );
  };

  // Pre-build peek elements (category headers + first 3 items)
  const peekElements: React.JSX.Element[] = [];
  let peekLastCat = "";
  peekItems.forEach((item, i) => {
    if (item.category !== peekLastCat) {
      peekElements.push(
        <div
          key={`peek-cat-${item.category}`}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
          style={{ background: "var(--neutral-100)", color: "var(--neutral-600)" }}
        >
          {item.category}
        </div>
      );
      peekLastCat = item.category;
    }
    peekElements.push(renderLineItem(item, i));
  });

  return (
    <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Clock size={18} style={{ color: "var(--primary-700)" }} />
        <h2 className="text-lg font-bold" style={{ color: "var(--primary-900)" }}>
          Migration Cost Recovery
        </h2>
      </div>
      <p className="text-sm mb-5" style={{ color: "var(--neutral-600)" }}>
        {migrationCosts.migrationRoute} from {migrationCosts.originCountry} →{" "}
        {migrationCosts.destinationCountry}
      </p>

      {/* Cost Breakdown */}
      <div
        className="rounded-xl mb-5 overflow-hidden"
        style={{ border: "1px solid var(--neutral-100)" }}
      >
        {/* Static header (non-clickable) */}
        <div
          className="flex items-center px-4 py-3 text-sm font-medium"
          style={{ background: "var(--primary-50)", color: "var(--primary-900)" }}
        >
          <span>Itemised Cost Breakdown (Typical Single-Attempt)</span>
          <span
            className="text-xs font-semibold rounded-full px-2 py-0.5"
            style={{
              background: "var(--primary-700)",
              color: "white",
              marginLeft: "0.5rem",
            }}
          >
            {itemCount} items
          </span>
        </div>

        {isOpen ? (
          /* ── EXPANDED: Full grouped view ── */
          <div>
            {grouped.map((group) => (
              <div key={group.category}>
                {/* Category header */}
                <div
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                  style={{ background: "var(--neutral-100)", color: "var(--neutral-600)" }}
                >
                  {group.category}
                </div>

                {/* Line items */}
                {group.items.map((item, i) => renderLineItem(item, i))}

                {/* Category subtotal */}
                <div
                  className="flex items-center justify-between px-4 py-1.5 text-xs"
                  style={{
                    background: "var(--neutral-50)",
                    borderBottom: "1px solid var(--neutral-100)",
                  }}
                >
                  <span
                    className="font-medium"
                    style={{ color: "var(--neutral-500)" }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="tabular-nums font-medium"
                    style={{ color: "var(--neutral-700)" }}
                  >
                    {formatInr(group.subtotal)}
                  </span>
                </div>
              </div>
            ))}

            {/* Grand total row */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background: "var(--primary-50)",
                borderTop: "1.5px solid var(--primary-100)",
              }}
            >
              <span
                className="font-semibold"
                style={{ color: "var(--primary-900)" }}
              >
                Total (Single-Attempt)
              </span>
              <span
                className="font-bold tabular-nums"
                style={{ color: "var(--primary-900)" }}
              >
                {formatInr(lineItemSum)}
              </span>
            </div>

            {/* Explainer note */}
            <div
              className="px-4 py-2.5 text-xs"
              style={{
                background: "var(--neutral-50)",
                color: "var(--neutral-400)",
                borderTop: "1px solid var(--neutral-100)",
              }}
            >
              The above shows single-attempt costs. The 3 scenarios below account
              for retake attempts, coaching tiers, and travel variations: Min{" "}
              {formatInrLakh(migrationCosts.totalMin)} · Typical{" "}
              {formatInrLakh(migrationCosts.totalTypical)} · Max{" "}
              {formatInrLakh(migrationCosts.totalMax)}
            </div>

            {/* Show less button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors duration-150"
              style={{
                background: "white",
                color: "var(--primary-700)",
                borderTop: "1px solid var(--neutral-100)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--primary-900)";
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--primary-700)";
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              Show less
              <ChevronUp size={16} />
            </button>
          </div>
        ) : (
          /* ── COLLAPSED: Peek view (first 3 items) ── */
          <div>
            {peekElements}

            {/* Fade gradient + "Show all" button */}
            {remainingCount > 0 && (
              <div style={{ position: "relative" }}>
                {/* Gradient overlay fading into the button area */}
                <div
                  style={{
                    position: "absolute",
                    top: "-24px",
                    left: 0,
                    right: 0,
                    height: "24px",
                    background: "linear-gradient(transparent, white)",
                    pointerEvents: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="flex items-center justify-center gap-1.5 mx-auto px-5 py-2.5 text-sm font-medium cursor-pointer rounded-lg transition-colors duration-150"
                  style={{
                    background: "var(--neutral-100)",
                    color: "var(--primary-700)",
                    border: "1.5px solid var(--neutral-200)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--primary-50)";
                    e.currentTarget.style.borderColor = "var(--primary-200)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--neutral-100)";
                    e.currentTarget.style.borderColor = "var(--neutral-200)";
                  }}
                >
                  Show all {remainingCount} more items
                  <ChevronDown size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recovery Scenarios */}
      {isNeg ? (
        <div
          className="rounded-xl px-4 py-4 text-sm"
          style={{ background: "var(--error-100)", color: "var(--error-600)" }}
        >
          Cannot calculate recovery timeline — monthly savings are negative at
          this lifestyle level. Adjust city or lifestyle to see your break-even
          point.
        </div>
      ) : (
        <div className="space-y-3">
          {scenarios.map((s) => (
            <div
              key={s.label}
              className="rounded-xl px-4 py-3"
              style={{
                background: "var(--neutral-50)",
                border: "1px solid var(--neutral-100)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--neutral-700)" }}
                >
                  {s.label}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--neutral-400)" }}
                >
                  {formatInrLakh(s.cost)} total cost
                </span>
              </div>
              <p
                className="text-xl font-bold tabular-nums"
                style={{ color: s.color }}
              >
                {formatMonths(s.months)}
              </p>
              <p className="text-xs" style={{ color: "var(--neutral-400)" }}>
                to recover migration costs
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs" style={{ color: "var(--neutral-400)" }}>
        Based on your projected monthly savings at the selected lifestyle.
        Typical scenario includes exam preparation + 1.5 avg exam attempts.
      </p>
    </div>
  );
}

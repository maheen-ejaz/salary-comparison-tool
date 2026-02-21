"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState } from "react";
import type { DonutChartProps } from "./types";

export function DonutChart({
  slices,
  grossTotal,
  centerLabel,
  centerValue,
  formatValue,
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Filter out zero-value slices
  const visibleSlices = slices.filter((s) => s.value > 0);

  return (
    <div className="mb-5">
      {/* Chart */}
      <div className="w-full h-[200px] sm:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={visibleSlices}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              minAngle={5}
              paddingAngle={1}
            >
              {visibleSlices.map((slice, i) => (
                <Cell
                  key={i}
                  fill={slice.color}
                  stroke="none"
                  opacity={activeIndex !== undefined && activeIndex !== i ? 0.4 : 1}
                  style={{ transition: "opacity 150ms" }}
                />
              ))}
            </Pie>
            {/* Center label */}
            <text
              x="50%"
              y="46%"
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fill: "var(--neutral-500)", fontSize: "11px" }}
            >
              {centerLabel}
            </text>
            <text
              x="50%"
              y="56%"
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fill: "var(--primary-900)",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              {centerValue}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
        {visibleSlices.map((slice, i) => {
          const pct =
            grossTotal > 0 ? Math.round((slice.value / grossTotal) * 100) : 0;
          return (
            <div
              key={i}
              className="flex items-center gap-2 text-xs cursor-default"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(undefined)}
              style={{
                opacity: activeIndex !== undefined && activeIndex !== i ? 0.4 : 1,
                transition: "opacity 150ms",
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: slice.color }}
              />
              <span
                className="truncate"
                style={{ color: "var(--neutral-600)" }}
              >
                {slice.label}
              </span>
              <span
                className="ml-auto tabular-nums font-medium whitespace-nowrap"
                style={{ color: "var(--neutral-900)" }}
              >
                {pct}% · {formatValue(slice.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

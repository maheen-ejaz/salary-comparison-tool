"use client";

import { useState } from "react";
import { ThumbsUp, Minus, ThumbsDown, Send } from "lucide-react";
import { getSavedLeadData } from "@/lib/lead-storage";

const SENTIMENTS = [
  { value: "Positive", label: "Positive", icon: ThumbsUp, color: "var(--success-600, #16a34a)" },
  { value: "Neutral", label: "Neutral", icon: Minus, color: "var(--warning-600, #ca8a04)" },
  { value: "Negative", label: "Negative", icon: ThumbsDown, color: "var(--error-600, #dc2626)" },
] as const;

interface Props {
  countryName: string;
  onComplete: () => void;
}

export function FeedbackModal({ countryName, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: countryName,
          sentiment: selected,
          ...(() => {
            const lead = getSavedLeadData();
            return lead ? { name: lead.name, email: lead.email, phone: lead.phone } : {};
          })(),
        }),
      });

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      onComplete();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--neutral-50)" }}>
      <div className="max-w-lg mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--primary-900)" }}>
          Quick feedback
        </h1>
        <p className="mb-8" style={{ color: "var(--neutral-600)" }}>
          You&apos;ve explored a couple of countries already! Before we show you{" "}
          <strong>{countryName}</strong>, we&apos;d love to know — how has your experience been so far?
        </p>

        <div
          className="rounded-2xl p-8 space-y-6 backdrop-blur-xl"
          style={{
            background: "rgba(255, 255, 255, 0.5)",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
          }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--neutral-700)" }}>
            How would you rate this tool so far?
          </p>

          <div className="flex gap-3">
            {SENTIMENTS.map(({ value, label, icon: Icon, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelected(value)}
                className="flex-1 flex flex-col items-center gap-2 py-4 rounded-xl font-medium text-sm transition-all"
                style={{
                  border: `2px solid ${selected === value ? color : "rgba(0, 0, 0, 0.08)"}`,
                  background: selected === value ? `${color}10` : "rgba(255, 255, 255, 0.6)",
                  color: selected === value ? color : "var(--neutral-600)",
                }}
              >
                <Icon size={24} />
                {label}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: "var(--error-600)" }}>
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selected || isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: "var(--primary-700)" }}
          >
            {isSubmitting ? "Submitting..." : (
              <>
                Submit & View Results
                <Send size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

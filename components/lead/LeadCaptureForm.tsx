"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CountryConfig } from "@/lib/config/countries";
export interface LeadData {
  name: string;
  email: string;
  phone: string;
  educationStatus: string;
}
import { ArrowRight } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  educationStatus: z.string().min(1, "Please select your education status"),
});

type FormValues = z.infer<typeof schema>;

const EDUCATION_OPTIONS = [
  "MBBS Completed",
  "PG In Progress (MD/MS/DNB)",
  "PG Completed (MD/MS/DNB)",
  "Super-Specialty (DM/MCh/Fellowship)",
  "Other",
];

interface Props {
  config: CountryConfig;
  onSubmit: (data: LeadData) => void;
}

export function LeadCaptureForm({ config, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onFormSubmit = async (values: FormValues) => {
    // Fire-and-forget — never block the user on webhook success
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, country: config.code }),
    }).catch(() => {});

    onSubmit(values);
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--neutral-50)" }}>
      <div className="max-w-lg mx-auto px-6 py-16">
        {/* Country badge */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">{config.flag}</span>
          <span className="text-lg font-semibold" style={{ color: "var(--primary-700)" }}>
            {config.name} Salary Breakdown
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--primary-900)" }}>
          Before we show your results
        </h1>
        <p className="mb-8" style={{ color: "var(--neutral-600)" }}>
          This tool is 100% free. We collect your details so our team can follow up
          with personalised guidance if you need it.
        </p>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="rounded-2xl p-8 space-y-5 backdrop-blur-xl"
          style={{
            background: "rgba(255, 255, 255, 0.5)",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
          }}
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--neutral-700)" }}>
              Full Name *
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Dr. Priya Sharma"
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
              style={{
                border: `1.5px solid ${errors.name ? "var(--error-600)" : "var(--neutral-200)"}`,
                background: "rgba(255, 255, 255, 0.6)",
                color: "var(--neutral-900)",
              }}
            />
            {errors.name && (
              <p className="mt-1 text-xs" style={{ color: "var(--error-600)" }}>{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--neutral-700)" }}>
              Email Address *
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="priya@example.com"
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
              style={{
                border: `1.5px solid ${errors.email ? "var(--error-600)" : "var(--neutral-200)"}`,
                background: "rgba(255, 255, 255, 0.6)",
                color: "var(--neutral-900)",
              }}
            />
            {errors.email && (
              <p className="mt-1 text-xs" style={{ color: "var(--error-600)" }}>{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--neutral-700)" }}>
              Phone Number *
            </label>
            <div className="flex gap-2">
              <span
                className="flex items-center px-3 rounded-lg text-sm font-medium"
                style={{
                  border: "1.5px solid rgba(0, 0, 0, 0.08)",
                  background: "rgba(255, 255, 255, 0.4)",
                  color: "var(--neutral-600)",
                }}
              >
                +91
              </span>
              <input
                {...register("phone")}
                type="tel"
                placeholder="98765 43210"
                className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
                style={{
                  border: `1.5px solid ${errors.phone ? "var(--error-600)" : "var(--neutral-200)"}`,
                  background: "var(--neutral-50)",
                  color: "var(--neutral-900)",
                }}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs" style={{ color: "var(--error-600)" }}>{errors.phone.message}</p>
            )}
          </div>

          {/* Education Status */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--neutral-700)" }}>
              Current Education Status *
            </label>
            <select
              {...register("educationStatus")}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none appearance-none"
              style={{
                border: `1.5px solid ${errors.educationStatus ? "var(--error-600)" : "var(--neutral-200)"}`,
                background: "rgba(255, 255, 255, 0.6)",
                color: "var(--neutral-900)",
              }}
            >
              <option value="">Select your status...</option>
              {EDUCATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.educationStatus && (
              <p className="mt-1 text-xs" style={{ color: "var(--error-600)" }}>{errors.educationStatus.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: "var(--primary-700)" }}
          >
            {isSubmitting ? "Processing..." : (
              <>
                See My {config.name} Salary Breakdown
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="text-xs text-center" style={{ color: "var(--neutral-400)" }}>
            We respect your privacy. No spam, ever.
          </p>
        </form>
      </div>
    </main>
  );
}

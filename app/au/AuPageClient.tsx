"use client";

import { useState, useEffect } from "react";
import { LeadCaptureForm, type LeadData } from "@/components/lead/LeadCaptureForm";
import { getSavedLeadData } from "@/lib/lead-storage";
import { AuResultsPanel } from "@/components/results/AuResultsPanel";
import type { CountryData } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";

type FlowState = "form" | "results";

interface Props {
  data: CountryData;
  config: CountryConfig;
  liveRate: number;
  rateIsLive: boolean;
  rateDate: string;
  allCountryData: Record<string, CountryData>;
  allRates: Record<string, number>;
}

export function AuPageClient({ data, config, liveRate, rateIsLive, rateDate, allCountryData, allRates }: Props) {
  const skipLeadForm = process.env.NEXT_PUBLIC_SKIP_LEAD_FORM === 'true';
  const [flowState, setFlowState] = useState<FlowState>(skipLeadForm ? "results" : "form");
  const [leadName, setLeadName] = useState("");

  useEffect(() => {
    if (skipLeadForm && flowState === "form") {
      setFlowState("results");
      return;
    }
    const saved = getSavedLeadData();
    if (saved && flowState === "form") {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...saved, country: config.code }),
      }).catch(() => {});
      setLeadName(saved.name);
      setFlowState("results");
    }
  }, [skipLeadForm, flowState, config.code]);

  const handleFormSubmit = (lead: LeadData) => {
    setLeadName(lead.name);
    setFlowState("results");
  };

  if (flowState === "form") {
    return (
      <LeadCaptureForm
        config={config}
        onSubmit={handleFormSubmit}
      />
    );
  }

  return (
    <AuResultsPanel
      data={data}
      config={config}
      leadName={leadName}
      liveRate={liveRate}
      rateIsLive={rateIsLive}
      rateDate={rateDate}
      allCountryData={allCountryData}
      allRates={allRates}
    />
  );
}

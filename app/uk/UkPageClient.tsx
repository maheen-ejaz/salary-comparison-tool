"use client";

import { useState, useEffect } from "react";
import { LeadCaptureForm, type LeadData } from "@/components/lead/LeadCaptureForm";
import { getSavedLeadData, saveLeadData, getVisitedCountries, saveVisitedCountry, hasFeedbackBeenGiven, markFeedbackGiven } from "@/lib/lead-storage";
import { FeedbackModal } from "@/components/lead/FeedbackModal";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import type { CountryData } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";

type FlowState = "form" | "feedback" | "results";

interface Props {
  data: CountryData;
  config: CountryConfig;
  liveRate: number;
  rateIsLive: boolean;
  rateDate: string;
  allCountryData: Record<string, CountryData>;
  allRates: Record<string, number>;
}

export function UkPageClient({ data, config, liveRate, rateIsLive, rateDate, allCountryData, allRates }: Props) {
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
        body: JSON.stringify({ ...saved, country: config.code, verified: false }),
      }).catch(() => {});
      setLeadName(saved.name);
      // Check if feedback is needed (visited 2+ countries, not yet given feedback, new country)
      const visited = getVisitedCountries();
      if (visited.length >= 2 && !hasFeedbackBeenGiven() && !visited.includes(config.code)) {
        setFlowState("feedback");
      } else {
        saveVisitedCountry(config.code);
        setFlowState("results");
      }
    }
  }, [skipLeadForm, flowState, config.code]);

  const handleFormSubmit = (lead: LeadData) => {
    setLeadName(lead.name);
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, country: config.code, verified: false }),
    }).catch(() => {});
    saveLeadData(lead);
    saveVisitedCountry(config.code);
    const visited = getVisitedCountries();
    if (visited.length >= 2 && !hasFeedbackBeenGiven()) {
      setFlowState("feedback");
    } else {
      setFlowState("results");
    }
  };

  const handleFeedbackComplete = () => {
    markFeedbackGiven();
    saveVisitedCountry(config.code);
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

  if (flowState === "feedback") {
    return (
      <FeedbackModal
        countryName={config.name}
        onComplete={handleFeedbackComplete}
      />
    );
  }

  return (
    <ResultsPanel
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

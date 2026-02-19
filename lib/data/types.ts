export interface SalaryBand {
  country: string;
  careerStage: string;
  sector: string;
  grossAnnualMin: number;
  grossAnnualTypical: number;
  grossAnnualMax: number;
  currency: string;
  estimationFlag: boolean;
  notes: string;
}

export type TaxType =
  | "Income Tax"
  | "National Insurance"
  | "NHS Pension"
  | "Medicare Levy"
  | "Medicare Levy Surcharge"
  | "Superannuation Guarantee"
  | "Tax Residency (482 Visa)"
  | "Provincial Income Tax"
  | "CPP"
  | "CPP2"
  | "QPP"
  | "QPP2"
  | "EI"
  | "Ontario Surtax"
  | "Ontario Health Premium"
  | "Quebec Federal Abatement"
  | "Solidarity Surcharge"
  | "Health Insurance"
  | "Pension Insurance"
  | "Unemployment Insurance"
  | "Long-term Care Insurance"
  | "Church Tax"
  | "ACC Earners Levy"
  | "KiwiSaver";

export interface TaxRule {
  country: string;
  region?: string; // e.g. "ON", "BC", "AB", "QC", "MB" — undefined = federal/national
  taxType: TaxType;
  bracketLower: number;
  bracketUpper: number;
  ratePercent: number;
  notes: string;
  estimationFlag: boolean;
}

export type LifestyleLevel = "Basic" | "Moderate" | "Premium";
export type RentType = "Shared Accommodation" | "1BHK" | "Family (2-3 BHK)";

export interface CostOfLivingRow {
  country: string;
  city: string;
  lifestyleLevel: LifestyleLevel;
  rentType: RentType;
  monthlyRent: number;
  monthlyUtilities: number;
  monthlyTransport: number;
  monthlyGroceries: number;
  monthlySchoolFees: number;
  monthlyDining: number;
  monthlyHealthcare: number;
  monthlyMisc: number;
  totalMonthlyCost: number;
  currency: string;
  estimationFlag: boolean;
  notes: string;
}

export type MigrationCostCategory =
  | "Exams & Registration"
  | "Visa & Immigration"
  | "Preparation & Coaching"
  | "Travel & Logistics";

export interface MigrationCostLineItem {
  key: string;
  label: string;
  category: MigrationCostCategory;
  amountInr: number;
}

export interface MigrationCosts {
  originCountry: string;
  destinationCountry: string;
  migrationRoute: string;
  lineItems: MigrationCostLineItem[];
  totalMin: number;
  totalTypical: number;
  totalMax: number;
  exchangeRateToInr: number;
}

export interface CurrencyRate {
  currencyPair: string;
  rateToInr: number;
  lastUpdated: string;
}

export interface CountryData {
  salaryBands: SalaryBand[];
  taxRules: TaxRule[];
  costOfLiving: CostOfLivingRow[];
  migrationCosts: MigrationCosts;
  currencyRate: CurrencyRate;
}

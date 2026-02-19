import type { CountryData, LifestyleLevel, RentType } from "@/lib/data/types";
import { COUNTRIES } from "@/lib/config/countries";
import { findEquivalentStage, REPRESENTATIVE_CITY } from "@/lib/config/careerStageMapping";
import { calculateUkTakeHome } from "@/lib/calc/uk/taxCalculator";
import { calculateAuTakeHome } from "@/lib/calc/au/taxCalculator";
import { calculateCaTakeHome } from "@/lib/calc/ca/taxCalculator";
import { calculateDeTakeHome } from "@/lib/calc/de/taxCalculator";
import { calculateNzTakeHome } from "@/lib/calc/nz/taxCalculator";
import { calculateAeTakeHome } from "@/lib/calc/ae/taxCalculator";

export interface ComparisonRow {
  countryCode: string;
  countryName: string;
  flag: string;
  available: boolean;
  currencySymbol: string;
  monthlyTakeHomeLocal: number;
  monthlyTakeHomeInr: number;
  monthlySavingsInr: number;
  isNegativeSavings: boolean;
  recoveryMonthsTypical: number;
  isCurrentCountry: boolean;
  cityLabel: string;
  lifestyleLabel: string;
  rentTypeLabel: string;
}

/** Tax calculators keyed by country code */
const TAX_CALCULATORS: Record<
  string,
  (gross: number, rules: import("@/lib/data/types").TaxRule[]) => { netMonthly: number }
> = {
  uk: (gross, rules) => calculateUkTakeHome({ grossAnnual: gross, taxRules: rules, includeNhsPension: true }),
  au: (gross, rules) => calculateAuTakeHome(gross, rules),
  ca: (gross, rules) => calculateCaTakeHome(gross, rules, "ON"),
  de: (gross, rules) => calculateDeTakeHome(gross, rules),
  nz: (gross, rules) => calculateNzTakeHome(gross, rules, true),
  ae: (gross, rules) => calculateAeTakeHome(gross),
};

interface ComputeInput {
  currentCountry: string;
  currentCareerStage: string;
  currentSalaryPoint: "min" | "typical" | "max";
  currentNetMonthly: number;
  currentMonthlyCost: number;
  currentCity: string;
  currentLifestyle: LifestyleLevel;
  currentRentType: RentType;
  allCountryData: Record<string, CountryData>;
  allRates: Record<string, number>;
}

function pickGross(band: { grossAnnualMin: number; grossAnnualTypical: number; grossAnnualMax: number }, point: "min" | "typical" | "max"): number {
  if (point === "min") return band.grossAnnualMin;
  if (point === "max") return band.grossAnnualMax;
  return band.grossAnnualTypical;
}

export function computeComparisonRows(input: ComputeInput): ComparisonRow[] {
  const {
    currentCountry,
    currentCareerStage,
    currentSalaryPoint,
    currentNetMonthly,
    currentMonthlyCost,
    currentCity,
    currentLifestyle,
    currentRentType,
    allCountryData,
    allRates,
  } = input;

  const rows: ComparisonRow[] = [];

  for (const country of COUNTRIES) {
    if (!country.available) {
      rows.push({
        countryCode: country.code,
        countryName: country.name,
        flag: country.flag,
        available: false,
        currencySymbol: country.currencySymbol,
        monthlyTakeHomeLocal: 0,
        monthlyTakeHomeInr: 0,
        monthlySavingsInr: 0,
        isNegativeSavings: false,
        recoveryMonthsTypical: Infinity,
        isCurrentCountry: false,
        cityLabel: "",
        lifestyleLabel: "",
        rentTypeLabel: "",
      });
      continue;
    }

    const data = allCountryData[country.code];
    const rate = allRates[country.code];
    if (!data || !rate) continue;

    const isCurrentCountry = country.code === currentCountry;

    if (isCurrentCountry) {
      // Use the user's actual computed values so this row matches the rest of the page
      const monthlySavingsLocal = currentNetMonthly - currentMonthlyCost;
      const monthlySavingsInr = monthlySavingsLocal * rate;
      const isNeg = monthlySavingsInr <= 0;

      rows.push({
        countryCode: country.code,
        countryName: country.name,
        flag: country.flag,
        available: true,
        currencySymbol: country.currencySymbol,
        monthlyTakeHomeLocal: Math.round(currentNetMonthly),
        monthlyTakeHomeInr: Math.round(currentNetMonthly * rate),
        monthlySavingsInr: Math.round(monthlySavingsInr),
        isNegativeSavings: isNeg,
        recoveryMonthsTypical: isNeg
          ? Infinity
          : Math.ceil(data.migrationCosts.totalTypical / monthlySavingsInr),
        isCurrentCountry: true,
        cityLabel: currentCity,
        lifestyleLabel: currentLifestyle,
        rentTypeLabel: currentRentType,
      });
      continue;
    }

    // --- Other country: map career stage, compute from scratch ---
    const mappedStage = findEquivalentStage(currentCountry, currentCareerStage, country.code);
    if (!mappedStage) continue;

    // Find salary band: public/government sector, mapped stage
    const band = data.salaryBands.find(
      (b) => b.careerStage === mappedStage &&
             (b.sector.toLowerCase().includes("public") ||
              b.sector.toLowerCase().includes("government")),
    );
    if (!band) continue;

    const gross = pickGross(band, currentSalaryPoint);

    // Compute tax
    const calculator = TAX_CALCULATORS[country.code];
    if (!calculator) continue;
    const { netMonthly } = calculator(gross, data.taxRules);

    // Find CoL: representative city, same lifestyle & rent as user's selection
    const repCity = REPRESENTATIVE_CITY[country.code];
    const col = data.costOfLiving.find(
      (r) => r.city === repCity && r.lifestyleLevel === currentLifestyle && r.rentType === currentRentType,
    );
    const monthlyCost = col ? col.totalMonthlyCost : 0;

    const monthlySavingsLocal = netMonthly - monthlyCost;
    const monthlySavingsInr = monthlySavingsLocal * rate;
    const isNeg = monthlySavingsInr <= 0;

    rows.push({
      countryCode: country.code,
      countryName: country.name,
      flag: country.flag,
      available: true,
      currencySymbol: country.currencySymbol,
      monthlyTakeHomeLocal: Math.round(netMonthly),
      monthlyTakeHomeInr: Math.round(netMonthly * rate),
      monthlySavingsInr: Math.round(monthlySavingsInr),
      isNegativeSavings: isNeg,
      recoveryMonthsTypical: isNeg
        ? Infinity
        : Math.ceil(data.migrationCosts.totalTypical / monthlySavingsInr),
      isCurrentCountry: false,
      cityLabel: repCity,
      lifestyleLabel: currentLifestyle,
      rentTypeLabel: currentRentType,
    });
  }

  return rows;
}

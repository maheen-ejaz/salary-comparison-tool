import fs from "fs";
import path from "path";
import Papa from "papaparse";
import type {
  CountryData,
  SalaryBand,
  TaxRule,
  TaxType,
  CostOfLivingRow,
  LifestyleLevel,
  RentType,
  MigrationCosts,
  MigrationCostLineItem,
  MigrationCostCategory,
  CurrencyRate,
} from "./types";

type LineItemMapping = {
  csvColumn: string;
  key: string;
  label: string;
  category: MigrationCostCategory;
};

const UK_MIGRATION_LINE_ITEM_MAP: LineItemMapping[] = [
  { csvColumn: "PLAB1_Fee_INR",            key: "plab1Fee",           label: "PLAB 1 Exam Fee",                      category: "Exams & Registration" },
  { csvColumn: "PLAB2_Fee_INR",            key: "plab2Fee",           label: "PLAB 2 Exam Fee",                      category: "Exams & Registration" },
  { csvColumn: "OET_IELTS_Fee_INR",        key: "oetIeltsFee",        label: "OET / IELTS Exam Fee",                 category: "Exams & Registration" },
  { csvColumn: "GMC_Registration_Fee_INR", key: "gmcRegistration",    label: "GMC Registration",                     category: "Exams & Registration" },
  { csvColumn: "GMC_Annual_Retention_INR", key: "gmcRetention",       label: "GMC Annual Retention (Year 1)",         category: "Exams & Registration" },
  { csvColumn: "Visa_Fee_INR",             key: "visaFee",            label: "Skilled Worker Visa Fee",               category: "Visa & Immigration" },
  { csvColumn: "IHS_Fee_INR",              key: "ihsFee",             label: "Immigration Health Surcharge (3 yr)",   category: "Visa & Immigration" },
  { csvColumn: "Coaching_Fees_INR",        key: "coachingFees",       label: "IELTS / PLAB Coaching",                category: "Preparation & Coaching" },
  { csvColumn: "Travel_Costs_INR",         key: "travelCosts",       label: "Travel to UK (flights)",                category: "Travel & Logistics" },
  { csvColumn: "Accommodation_PLAB2_INR",  key: "accommodationPlab2", label: "Accommodation (PLAB 2 trip)",           category: "Travel & Logistics" },
  { csvColumn: "Attestation_Fees_INR",     key: "attestationFees",    label: "Document Attestation (MEA)",            category: "Travel & Logistics" },
  { csvColumn: "Medical_Clearance_INR",    key: "medicalClearance",   label: "Medical Clearance / TB Test",           category: "Travel & Logistics" },
  { csvColumn: "Misc_Fees_INR",            key: "miscFees",           label: "Miscellaneous (courier, photos, etc)",  category: "Travel & Logistics" },
];

const AU_MIGRATION_LINE_ITEM_MAP: LineItemMapping[] = [
  { csvColumn: "AMC_CAT_MCQ_Fee_INR",           key: "amcMcq",             label: "AMC CAT MCQ Exam Fee",                  category: "Exams & Registration" },
  { csvColumn: "AMC_Clinical_Exam_Fee_INR",      key: "amcClinical",        label: "AMC Clinical Exam Fee",                  category: "Exams & Registration" },
  { csvColumn: "OET_IELTS_Fee_INR",              key: "oetIeltsFee",        label: "OET / IELTS Exam Fee",                   category: "Exams & Registration" },
  { csvColumn: "AHPRA_Initial_Registration_INR", key: "ahpraInitial",       label: "AHPRA Initial Registration",             category: "Exams & Registration" },
  { csvColumn: "AHPRA_Annual_Renewal_INR",       key: "ahpraRenewal",       label: "AHPRA Annual Renewal (Year 1)",          category: "Exams & Registration" },
  { csvColumn: "Skills_Assessment_Fee_INR",      key: "skillsAssessment",   label: "Skills Assessment (AMC)",                category: "Exams & Registration" },
  { csvColumn: "Visa_482_Fee_INR",               key: "visa482",            label: "Subclass 482 TSS Visa",                  category: "Visa & Immigration" },
  { csvColumn: "Visa_189_190_PR_Fee_INR",        key: "visa189190",         label: "Subclass 189/190 PR Visa (optional)",     category: "Visa & Immigration" },
  { csvColumn: "Health_Insurance_Year1_INR",     key: "healthInsurance",    label: "Health Insurance / OSHC (1st year)",      category: "Visa & Immigration" },
  { csvColumn: "Coaching_Fees_INR",              key: "coachingFees",       label: "AMC Exam Coaching",                      category: "Preparation & Coaching" },
  { csvColumn: "Travel_Costs_INR",               key: "travelCosts",        label: "Travel to Australia (flights)",           category: "Travel & Logistics" },
  { csvColumn: "Accommodation_Clinical_INR",     key: "accommodationClinical", label: "Accommodation (AMC Clinical trip)",    category: "Travel & Logistics" },
  { csvColumn: "Police_Clearance_INR",           key: "policeClearance",    label: "Police Clearance Certificate",            category: "Travel & Logistics" },
  { csvColumn: "Medical_Examination_INR",        key: "medicalExam",        label: "Medical Exam for Visa",                  category: "Travel & Logistics" },
  { csvColumn: "Misc_Fees_INR",                  key: "miscFees",           label: "Miscellaneous",                          category: "Travel & Logistics" },
];

const CA_MIGRATION_LINE_ITEM_MAP: LineItemMapping[] = [
  { csvColumn: "MCCQE1_Fee_INR",               key: "mccqe1",              label: "MCCQE Part 1 Exam Fee",                 category: "Exams & Registration" },
  { csvColumn: "NAC_OSCE_Fee_INR",              key: "nacOsce",             label: "NAC OSCE Exam Fee",                     category: "Exams & Registration" },
  { csvColumn: "MCCQE2_Fee_INR",               key: "mccqe2",              label: "MCCQE Part 2 Exam Fee",                 category: "Exams & Registration" },
  { csvColumn: "OET_IELTS_Fee_INR",             key: "oetIeltsFee",         label: "OET / IELTS Exam Fee",                  category: "Exams & Registration" },
  { csvColumn: "Provincial_License_Fee_INR",    key: "provincialLicense",   label: "Provincial Medical License",            category: "Exams & Registration" },
  { csvColumn: "CaRMS_Fee_INR",                key: "carmsFee",            label: "CaRMS Application Fee",                 category: "Exams & Registration" },
  { csvColumn: "Credential_Verification_INR",   key: "credentialVerify",    label: "Credential Verification (WES/MCC)",     category: "Exams & Registration" },
  { csvColumn: "Work_Permit_Fee_INR",           key: "workPermit",          label: "Work Permit / Study Permit",            category: "Visa & Immigration" },
  { csvColumn: "PR_Express_Entry_Fee_INR",      key: "prExpressEntry",      label: "PR via Express Entry (optional)",       category: "Visa & Immigration" },
  { csvColumn: "Coaching_Fees_INR",             key: "coachingFees",        label: "NAC / MCCQE Exam Coaching",             category: "Preparation & Coaching" },
  { csvColumn: "Travel_Costs_INR",              key: "travelCosts",         label: "Travel to Canada (flights)",            category: "Travel & Logistics" },
  { csvColumn: "Accommodation_Exam_INR",        key: "accommodationExam",   label: "Accommodation (exam trips)",            category: "Travel & Logistics" },
  { csvColumn: "Police_Clearance_INR",          key: "policeClearance",     label: "Police Clearance Certificate",          category: "Travel & Logistics" },
  { csvColumn: "Medical_Exam_INR",              key: "medicalExam",         label: "Medical Exam for Visa",                 category: "Travel & Logistics" },
];

const DE_MIGRATION_LINE_ITEM_MAP: LineItemMapping[] = [
  { csvColumn: "German_B2_Course_INR",         key: "germanB2Course",       label: "German B2 Language Course",              category: "Preparation & Coaching" },
  { csvColumn: "Fachsprachpruefung_Fee_INR",   key: "fachsprachpruefung",   label: "Fachsprachprüfung (Medical German C1)",  category: "Exams & Registration" },
  { csvColumn: "Kenntnisspruefung_Fee_INR",    key: "kenntnisspruefung",    label: "Kenntnisprüfung (Knowledge Exam)",       category: "Exams & Registration" },
  { csvColumn: "Approbation_Application_INR",  key: "approbationApp",       label: "Approbation Application Fee",            category: "Exams & Registration" },
  { csvColumn: "Document_Translation_INR",     key: "documentTranslation",  label: "Document Translation & Notarization",    category: "Exams & Registration" },
  { csvColumn: "Credential_Verification_INR",  key: "credentialVerify",     label: "Credential Verification (anabin/ZAB)",   category: "Exams & Registration" },
  { csvColumn: "Job_Seeker_Visa_INR",          key: "jobSeekerVisa",        label: "Job Seeker Visa (§20 AufenthG)",         category: "Visa & Immigration" },
  { csvColumn: "Work_Visa_INR",                key: "workVisa",             label: "Work Visa / Residence Permit",           category: "Visa & Immigration" },
  { csvColumn: "Travel_Costs_INR",             key: "travelCosts",          label: "Travel to Germany (flights)",            category: "Travel & Logistics" },
  { csvColumn: "Initial_Accommodation_INR",    key: "initialAccommodation", label: "Initial Accommodation & Deposit",        category: "Travel & Logistics" },
  { csvColumn: "Health_Insurance_Initial_INR", key: "healthInsuranceInit",  label: "Health Insurance (first months)",         category: "Travel & Logistics" },
  { csvColumn: "Police_Clearance_INR",         key: "policeClearance",      label: "Police Clearance Certificate",            category: "Travel & Logistics" },
  { csvColumn: "Medical_Examination_INR",      key: "medicalExam",          label: "Medical Exam for Visa",                  category: "Travel & Logistics" },
];

const AE_MIGRATION_LINE_ITEM_MAP: LineItemMapping[] = [
  { csvColumn: "Licensing_Exam_Fee_INR",     key: "licensingExam",        label: "DHA/DOH/MOH Licensing Exam Fee",         category: "Exams & Registration" },
  { csvColumn: "DataFlow_Verification_INR",  key: "dataFlow",             label: "DataFlow Primary Source Verification",   category: "Exams & Registration" },
  { csvColumn: "OET_IELTS_Fee_INR",          key: "oetIelts",             label: "OET / IELTS English Proficiency Test",   category: "Exams & Registration" },
  { csvColumn: "Work_Visa_INR",              key: "workVisa",             label: "Work Visa & Residence Permit",           category: "Visa & Immigration" },
  { csvColumn: "Emirates_ID_INR",            key: "emiratesId",           label: "Emirates ID",                            category: "Visa & Immigration" },
  { csvColumn: "Travel_Costs_INR",           key: "travelCosts",          label: "Travel to UAE (flights)",                category: "Travel & Logistics" },
  { csvColumn: "Initial_Accommodation_INR",  key: "initialAccommodation", label: "Initial Accommodation & Deposit",        category: "Travel & Logistics" },
  { csvColumn: "Health_Insurance_INR",       key: "healthInsurance",      label: "Health Insurance (mandatory, first year)", category: "Travel & Logistics" },
  { csvColumn: "Police_Clearance_INR",       key: "policeClearance",      label: "Police Clearance Certificate",           category: "Travel & Logistics" },
  { csvColumn: "Medical_Examination_INR",    key: "medicalExam",          label: "Medical Exam for Visa",                  category: "Travel & Logistics" },
];

const NZ_MIGRATION_LINE_ITEM_MAP: LineItemMapping[] = [
  { csvColumn: "NZREX_Clinical_Exam_INR",        key: "nzrexClinical",           label: "NZREX Clinical Exam (Part 1 & 2)",      category: "Exams & Registration" },
  { csvColumn: "MCNZ_Registration_Fee_INR",      key: "mcnzRegistration",        label: "MCNZ Registration & APC (Year 1)",       category: "Exams & Registration" },
  { csvColumn: "English_Proficiency_Test_INR",   key: "englishProficiency",      label: "IELTS / OET Exam Fee",                   category: "Exams & Registration" },
  { csvColumn: "Work_Visa_INR",                  key: "workVisa",                label: "Work Visa (Accredited Employer)",        category: "Visa & Immigration" },
  { csvColumn: "NZREX_Preparation_Course_INR",   key: "nzrexPrepCourse",         label: "NZREX Preparation Course (optional)",    category: "Preparation & Coaching" },
  { csvColumn: "Travel_Costs_INR",               key: "travelCosts",             label: "Travel to New Zealand (flights)",        category: "Travel & Logistics" },
  { csvColumn: "Initial_Accommodation_INR",      key: "initialAccommodation",    label: "Initial Accommodation & Bond",           category: "Travel & Logistics" },
  { csvColumn: "Immigration_Medical_INR",        key: "immigrationMedical",      label: "Immigration Medical & Chest X-ray",      category: "Travel & Logistics" },
  { csvColumn: "Police_Clearance_INR",           key: "policeClearance",         label: "Police Clearance Certificate",           category: "Travel & Logistics" },
  { csvColumn: "Document_Attestation_INR",       key: "documentAttestation",     label: "Document Attestation (MEA + NZ HC)",     category: "Travel & Logistics" },
  { csvColumn: "Health_Insurance_Initial_INR",   key: "healthInsuranceInitial",  label: "Temporary Health Insurance (3-6 mo)",    category: "Travel & Logistics" },
];

const MIGRATION_MAPS: Record<string, LineItemMapping[]> = {
  uk: UK_MIGRATION_LINE_ITEM_MAP,
  au: AU_MIGRATION_LINE_ITEM_MAP,
  ca: CA_MIGRATION_LINE_ITEM_MAP,
  de: DE_MIGRATION_LINE_ITEM_MAP,
  ae: AE_MIGRATION_LINE_ITEM_MAP,
  nz: NZ_MIGRATION_LINE_ITEM_MAP,
};

const EXCHANGE_RATE_COLUMNS: Record<string, string> = {
  uk: "Exchange_Rate_GBP_INR_Used",
  au: "Exchange_Rate_AUD_INR_Used",
  ca: "Exchange_Rate_CAD_INR_Used",
  de: "Exchange_Rate_EUR_INR_Used",
  ae: "Exchange_Rate_AED_INR_Used",
  nz: "Exchange_Rate_NZD_INR_Used",
};

function readCsv(filePath: string): Record<string, string>[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const result = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
  });
  return result.data;
}

export function loadCountryData(countryCode: string): CountryData {
  const code = countryCode.toLowerCase();
  const base = path.join(process.cwd(), "data", "processed", code);
  const prefix = countryCode.toUpperCase();

  // Salary Bands
  const salaryRaw = readCsv(path.join(base, `${prefix}_Salary_Bands.csv`));
  const salaryBands: SalaryBand[] = salaryRaw.map((row) => ({
    country: row.Country,
    careerStage: row.Career_Stage,
    sector: row.Sector,
    grossAnnualMin: Number(row.Gross_Annual_Min),
    grossAnnualTypical: Number(row.Gross_Annual_Typical),
    grossAnnualMax: Number(row.Gross_Annual_Max),
    currency: row.Currency,
    estimationFlag: row.Estimation_Flag === "Y",
    notes: row.Notes ?? "",
  }));

  // Tax Rules
  const taxRaw = readCsv(path.join(base, `${prefix}_Tax_Rules.csv`));
  const taxRules: TaxRule[] = taxRaw.map((row) => ({
    country: row.Country,
    region: row.Region || undefined,
    taxType: row.Tax_Type as TaxType,
    bracketLower: Number(row.Income_Bracket_Lower),
    bracketUpper: Number(row.Income_Bracket_Upper),
    ratePercent: Number(row.Rate_Percent),
    notes: row.Notes ?? "",
    estimationFlag: row.Estimation_Flag === "Y",
  }));

  // Cost of Living
  const colRaw = readCsv(path.join(base, `${prefix}_Cost_Of_Living.csv`));
  const costOfLiving: CostOfLivingRow[] = colRaw.map((row) => ({
    country: row.Country,
    city: row.City,
    lifestyleLevel: row.Lifestyle_Level as LifestyleLevel,
    rentType: row.Rent_Type as RentType,
    monthlyRent: Number(row.Monthly_Rent),
    monthlyUtilities: Number(row.Monthly_Utilities),
    monthlyTransport: Number(row.Monthly_Transport),
    monthlyGroceries: Number(row.Monthly_Groceries),
    monthlySchoolFees: Number(row.Monthly_School_Fees),
    monthlyDining: Number(row.Monthly_Dining),
    monthlyHealthcare: Number(row.Monthly_Healthcare),
    monthlyMisc: Number(row.Monthly_Misc),
    totalMonthlyCost: Number(row.Total_Monthly_Cost),
    currency: row.Currency,
    estimationFlag: row.Estimation_Flag === "Y",
    notes: row.Notes ?? "",
  }));

  // Migration Costs
  const migRaw = readCsv(path.join(base, `${prefix}_Migration_Costs.csv`));
  const migRow = migRaw[0];
  const lineItemMap = MIGRATION_MAPS[code] ?? MIGRATION_MAPS.uk;
  const lineItems: MigrationCostLineItem[] = lineItemMap.map((m) => ({
    key: m.key,
    label: m.label,
    category: m.category,
    amountInr: Number(migRow[m.csvColumn]) || 0,
  }));
  const fxCol = EXCHANGE_RATE_COLUMNS[code] ?? EXCHANGE_RATE_COLUMNS.uk;
  const migrationCosts: MigrationCosts = {
    originCountry: migRow.Origin_Country,
    destinationCountry: migRow.Destination_Country,
    migrationRoute: migRow.Migration_Route,
    lineItems,
    totalMin: Number(migRow.Total_Migration_Cost_INR_Min),
    totalTypical: Number(migRow.Total_Migration_Cost_INR_Typical),
    totalMax: Number(migRow.Total_Migration_Cost_INR_Max),
    exchangeRateToInr: Number(migRow[fxCol]),
  };

  // Currency Rates
  const fxRaw = readCsv(path.join(base, `${prefix}_Currency_Rates.csv`));
  const fxRow = fxRaw[0];
  const currencyRate: CurrencyRate = {
    currencyPair: fxRow.Currency_Pair,
    rateToInr: Number(fxRow.Rate_To_INR),
    lastUpdated: fxRow.Last_Updated,
  };

  return { salaryBands, taxRules, costOfLiving, migrationCosts, currencyRate };
}

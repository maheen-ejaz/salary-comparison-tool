export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  available: boolean;
  migrationRoute: string;
  dataPath: string;
  cities: string[];
  careerStages: string[];
  sectors: string[];
  lifestyleLevels: string[];
  rentTypes: string[];
  specialWarnings: {
    edinburghScottishTax?: boolean;
    montrealFrenchRequirement?: boolean;
    germanLanguageRequired?: boolean;
    churchTaxExcluded?: boolean;
    taxFreeIncome?: boolean;
    housingAllowanceNotIncluded?: boolean;
  };
  comingSoonTeaser?: string;
}

export const COUNTRIES: CountryConfig[] = [
  {
    code: "uk",
    name: "UK",
    flag: "🇬🇧",
    currency: "GBP",
    currencySymbol: "GBP",
    available: true,
    migrationRoute: "PLAB Route",
    dataPath: "uk",
    cities: ["London", "Edinburgh", "Manchester", "Birmingham", "Cardiff"],
    careerStages: [
      "Junior Doctor (FY1)",
      "Junior Doctor (FY2)",
      "Registrar (CT/ST)",
      "Consultant",
    ],
    sectors: ["Public (NHS)", "Private"],
    lifestyleLevels: ["Basic", "Moderate", "Premium"],
    rentTypes: ["Shared Accommodation", "1BHK", "Family (2-3 BHK)"],
    specialWarnings: {
      edinburghScottishTax: true,
    },
  },
  {
    code: "au",
    name: "Australia",
    flag: "🇦🇺",
    currency: "AUD",
    currencySymbol: "AUD",
    available: true,
    migrationRoute: "AMC Standard Pathway",
    dataPath: "au",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra"],
    careerStages: [
      "Intern (PGY1)",
      "RMO (PGY2-3)",
      "Registrar",
      "Consultant / Staff Specialist",
    ],
    sectors: ["Public (State Health)", "Private"],
    lifestyleLevels: ["Basic", "Moderate", "Premium"],
    rentTypes: ["Shared Accommodation", "1BHK", "Family (2-3 BHK)"],
    specialWarnings: {},
  },
  {
    code: "ca",
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    currencySymbol: "CAD",
    available: true,
    migrationRoute: "MCC Route",
    dataPath: "ca",
    cities: ["Toronto", "Vancouver", "Calgary", "Montreal", "Ottawa", "Winnipeg"],
    careerStages: [
      "Resident (PGY1)",
      "Resident (PGY2-3)",
      "Fellow / Senior Resident",
      "Staff Physician",
    ],
    sectors: ["Public (Provincial Health)", "Fee-for-Service"],
    lifestyleLevels: ["Basic", "Moderate", "Premium"],
    rentTypes: ["Shared Accommodation", "1BHK", "Family (2-3 BHK)"],
    specialWarnings: {
      montrealFrenchRequirement: true,
    },
  },
  {
    code: "ae",
    name: "UAE",
    flag: "🇦🇪",
    currency: "AED",
    currencySymbol: "AED",
    available: true,
    migrationRoute: "DHA / DOH / MOH Route",
    dataPath: "ae",
    cities: ["Dubai", "Abu Dhabi", "Sharjah"],
    careerStages: [
      "House Officer / Junior Doctor",
      "Medical Officer",
      "Specialist",
      "Consultant",
    ],
    sectors: ["Government Hospital", "Private Hospital"],
    lifestyleLevels: ["Basic", "Moderate", "Premium"],
    rentTypes: ["Shared Accommodation", "1BHK", "Family (2-3 BHK)"],
    specialWarnings: {
      taxFreeIncome: true,
      housingAllowanceNotIncluded: true,
    },
    comingSoonTeaser: "",
  },
  {
    code: "nz",
    name: "New Zealand",
    flag: "🇳🇿",
    currency: "NZD",
    currencySymbol: "NZD",
    available: true,
    migrationRoute: "NZREX Route",
    dataPath: "nz",
    cities: ["Auckland", "Wellington", "Christchurch"],
    careerStages: [
      "House Officer / PGY1",
      "Medical Officer / PGY2-3",
      "Registrar",
      "Consultant / Specialist",
    ],
    sectors: ["Public (DHB/Te Whatu Ora)", "Private"],
    lifestyleLevels: ["Basic", "Moderate", "Premium"],
    rentTypes: ["Shared Accommodation", "1BHK", "Family (2-3 BHK)"],
    specialWarnings: {},
    comingSoonTeaser: "",
  },
  {
    code: "de",
    name: "Germany",
    flag: "🇩🇪",
    currency: "EUR",
    currencySymbol: "EUR",
    available: true,
    migrationRoute: "Approbation Route",
    dataPath: "de",
    cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Dusseldorf"],
    careerStages: [
      "Assistenzarzt (Year 1-2)",
      "Assistenzarzt (Year 3-5)",
      "Facharzt (Specialist)",
      "Oberarzt (Senior Physician)",
      "Chefarzt (Chief Physician)",
    ],
    sectors: ["Public (TV-Ärzte)", "Private Hospital"],
    lifestyleLevels: ["Basic", "Moderate", "Premium"],
    rentTypes: ["Shared Accommodation", "1BHK", "Family (2-3 BHK)"],
    specialWarnings: {
      germanLanguageRequired: true,
      churchTaxExcluded: true,
    },
  },
];

export const getCountry = (code: string): CountryConfig | undefined =>
  COUNTRIES.find((c) => c.code === code);

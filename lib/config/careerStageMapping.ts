/**
 * Maps equivalent career stages across countries.
 * Each country's stage names map to a canonical level key.
 */
export const CAREER_STAGE_MAP: Record<string, Record<string, string>> = {
  uk: {
    "Junior Doctor (FY1)": "entry",
    "Junior Doctor (FY2)": "junior",
    "Registrar (CT/ST)": "registrar",
    "Consultant": "consultant",
  },
  au: {
    "Intern (PGY1)": "entry",
    "RMO (PGY2-3)": "junior",
    "Registrar": "registrar",
    "Consultant / Staff Specialist": "consultant",
  },
  ca: {
    "Resident (PGY1)": "entry",
    "Resident (PGY2-3)": "junior",
    "Fellow / Senior Resident": "registrar",
    "Staff Physician": "consultant",
  },
  de: {
    "Assistenzarzt (Year 1-2)": "entry",
    "Assistenzarzt (Year 3-5)": "junior",
    "Facharzt (Specialist)": "registrar",
    "Oberarzt (Senior Physician)": "consultant",
    "Chefarzt (Chief Physician)": "consultant",
  },
  ae: {
    "House Officer / Junior Doctor": "entry",
    "Medical Officer": "junior",
    "Specialist": "registrar",
    "Consultant": "consultant",
  },
  nz: {
    "House Officer / PGY1": "entry",
    "Medical Officer / PGY2-3": "junior",
    "Registrar": "registrar",
    "Consultant / Specialist": "consultant",
  },
};

/** Representative city used for cross-country comparison CoL lookups */
export const REPRESENTATIVE_CITY: Record<string, string> = {
  uk: "London",
  au: "Sydney",
  ca: "Toronto",
  de: "Berlin",
  ae: "Dubai",
  nz: "Auckland",
};

/**
 * Given a career stage in one country, find the equivalent stage name in another country.
 * Returns null if no mapping exists.
 */
export function findEquivalentStage(
  fromCountry: string,
  fromStage: string,
  toCountry: string,
): string | null {
  const fromMap = CAREER_STAGE_MAP[fromCountry];
  const toMap = CAREER_STAGE_MAP[toCountry];
  if (!fromMap || !toMap) return null;

  const canonicalLevel = fromMap[fromStage];
  if (!canonicalLevel) return null;

  const match = Object.entries(toMap).find(([, level]) => level === canonicalLevel);
  return match ? match[0] : null;
}

import { z } from "zod";

const STORAGE_KEY = "salaryTool_lead";

const leadDataSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  phone: z.string().min(1).max(20),
  educationStatus: z.string().min(1).max(100),
});

export type LeadData = z.infer<typeof leadDataSchema>;

export function saveLeadData(data: LeadData): void {
  try {
    const validated = leadDataSchema.parse(data);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
  } catch {
    // Silently fail — storage full, unavailable, or invalid data
  }
}

export function getSavedLeadData(): LeadData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const result = leadDataSchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }
    // Invalid data in storage — clear it
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

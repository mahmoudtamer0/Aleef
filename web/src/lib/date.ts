const pad = (n: number) => String(n).padStart(2, "0");

// Dates travel as "YYYY-MM-DD" strings (no timezone surprises).
export const toIsoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

// "09:00:00" -> "09:00"
export const formatSlot = (slot: string) => slot.slice(0, 5);

export function formatDayParts(iso: string) {
  const d = parseIsoDate(iso);
  return {
    weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
    day: d.getDate(),
    month: d.toLocaleDateString("en-GB", { month: "short" }),
  };
}

// "Mon, 20 Oct"
export const formatFullDate = (iso: string) => parseIsoDate(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

// "2 Oct 2026"
export function formatReviewDate(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// "Wednesday, 24 June 2026"
export const formatLongDate = (iso: string) =>
  parseIsoDate(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

// "2 Oct 2026" (for timestamps coming from the backend)
export const formatShortDate = (value: string) => formatReviewDate(value);

// "2025-12-20" -> "9 months" / "2 years"
export function formatAge(birthIso?: string): string {
  if (!birthIso) return "";
  const months = Math.max(0, Math.floor((Date.now() - parseIsoDate(birthIso).getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "year" : "years"}`;
}

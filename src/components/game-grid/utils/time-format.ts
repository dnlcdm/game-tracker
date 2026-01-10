export type ParsedTime = {
  h: number;
  min: number;
  hasMinutesInText: boolean;
} | null;

export const parseTime = (time?: string): ParsedTime => {
  if (!time) return null;

  const t = time.trim();
  const m = t.match(/^(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?$/i);
  if (!m) return null;

  const h = m[1] ? Number(m[1]) : 0;
  const min = m[2] ? Number(m[2]) : 0;

  if (!m[1] && !m[2]) return null;

  return {
    h: Number.isFinite(h) ? h : 0,
    min: Number.isFinite(min) ? min : 0,
    hasMinutesInText: /\d+\s*m/i.test(t),
  };
}

export const pad2 = (n: number) => {
  return String(n).padStart(2, "0");
}

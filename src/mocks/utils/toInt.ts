export function toInt(value: unknown): number | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  if (v == null) return undefined;
  if (typeof v !== 'string') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function isValidId(id: string | null): boolean {
  if (id == null) return false;
  return Number.isInteger(Number(id)) && Number(id) >= 0;
}

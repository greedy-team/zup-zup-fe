import { PAGE_SIZE } from '../../constants/main/pagenation';

export function getTotalPages(totalCount: number, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil(totalCount / pageSize));
}

export function isValidPage(raw: string | null, totalPages: number): boolean {
  if (raw == null) return false;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= totalPages;
}

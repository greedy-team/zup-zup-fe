import type { SchoolArea } from '../../types/map/map';
import type {
  Category,
  LostItemDetailResponse,
  LostItemSummaryRow,
} from '../../types/lost/lostApi';

export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch('/api/categories');
  const data: Category[] = await res.json();
  return data;
};

export const getSchoolAreas = async (): Promise<{ schoolAreas: SchoolArea[] }> => {
  const res = await fetch('/api/school-areas');
  const { schoolAreas }: { schoolAreas: SchoolArea[] } = await res.json();
  return { schoolAreas };
};

export const getLostItemSummary = async (
  areaId?: number,
  categoryId?: number,
): Promise<LostItemSummaryRow[]> => {
  const qs = new URLSearchParams();
  if (areaId) qs.set('areaId', String(areaId));
  if (categoryId) qs.set('categoryId', String(categoryId));
  const res = await fetch(`/api/lost-items/summary?${qs.toString()}`);
  const data: LostItemSummaryRow[] = await res.json();
  return data;
};

export const getLostItemSummaryByCategory = async (
  categoryId: number,
  areaId?: number,
): Promise<LostItemSummaryRow[]> => {
  const qs = new URLSearchParams({
    categoryId: String(categoryId),
  });
  if (areaId) qs.set('areaId', String(areaId));
  const res = await fetch(`/api/lost-items/summary-by-category?${qs.toString()}`);
  const data: LostItemSummaryRow[] = await res.json();
  return data;
};

export const getLostItemDetail = async (
  page: number,
  limit: number,
  categoryId?: number,
  schoolAreaId?: number,
): Promise<LostItemDetailResponse> => {
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (categoryId) qs.set('categoryId', String(categoryId));
  if (schoolAreaId) qs.set('schoolAreaId', String(schoolAreaId));

  const res = await fetch(`/api/lost-items/detail?${qs.toString()}`);
  if (!res.ok) throw new Error('요청 실패');

  const { items, total }: LostItemDetailResponse = await res.json();
  return { items, total };
};

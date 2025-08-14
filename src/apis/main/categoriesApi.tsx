import type { Category } from '../../types/main/category';
import type { LostItemListItem } from '../../types/main/lostItemListItem';
import type { SchoolArea } from '../../types/map/map';

type LostItemDetailResponse = {
  items: LostItemListItem[];
  total: number; // 필터 적용 후 전체 개수 (페이지 수 = Math.ceil(total/limit))
};

type LostItemSummaryRow = {
  schoolAreaId: number;
  count: number;
};

// 1) 카테고리 목록 불러오기
export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch('/api/categories');
  const data: Category[] = await res.json();
  return data;
};

// 2) 학교 구역 목록
export const getSchoolAreas = async (): Promise<SchoolArea[]> => {
  const res = await fetch('/api/school-areas');
  const data: SchoolArea[] = await res.json();
  return data;
};

// 3) 분실물 핀 요약약
export const getLostItemSummary = async (categoryId?: number): Promise<LostItemSummaryRow[]> => {
  const qs = new URLSearchParams();
  qs.set('categoryId', String(1)); // 선택적
  const res = await fetch(`/api/lost-items/summary?${qs.toString()}`);
  const data: LostItemSummaryRow[] = await res.json();
  return data;
};

// 4) 분실물 목록
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

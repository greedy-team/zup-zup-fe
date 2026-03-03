import { apiFetch } from '../common/apiClient';
import type { Category, LostItemListItem, LostItemSummaryRow } from '../../types/lost/lostApi';
import type { SchoolArea } from '../../types/map/map';
import { PAGE_SIZE } from '../../constants/main/pagenation';
import normalizeCategories from './normalizeCategories';

export const getCategories = async (): Promise<Category[]> => {
  const data = await apiFetch<{ categories?: Category[] }>('/categories');
  return normalizeCategories(data);
};

export const getSchoolAreas = async (): Promise<SchoolArea[]> => {
  const data = await apiFetch<{ schoolAreas: SchoolArea[] }>('/school-areas');
  return data?.schoolAreas ?? [];
};

export type GetLostItemsResult = {
  items: LostItemListItem[];
  totalCount: number;
};

export const getLostItems = async (
  page: number,
  categoryId?: number,
  schoolAreaId?: number,
): Promise<GetLostItemsResult> => {
  const qs = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
  if (categoryId) qs.set('categoryId', String(categoryId));
  if (schoolAreaId) qs.set('schoolAreaId', String(schoolAreaId));

  const data = await apiFetch<{
    items: {
      id: number;
      categoryId: number;
      categoryName: string;
      schoolAreaId: number;
      foundAreaDetail: string;
      createdAt: string;
      representativeImageUrl: string;
    }[];
    pageInfo: { totalElements: number };
  }>(`/lost-items?${qs}`);

  const items: LostItemListItem[] = (data?.items ?? []).map((row) => ({
    lostItemId: row.id,
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    schoolAreaId: row.schoolAreaId,
    foundLocation: row.foundAreaDetail ?? '',
    foundDate: row.createdAt,
    imageUrl: row.representativeImageUrl ?? '',
    status: 'registered' as const,
  }));

  return {
    items,
    totalCount: data?.pageInfo?.totalElements ?? items.length,
  };
};

export const getLostItemSummary = async (categoryId?: number): Promise<LostItemSummaryRow[]> => {
  const qs = categoryId ? `?categoryId=${categoryId}` : '';
  const data = await apiFetch<{
    areas: { schoolAreaId: number; schoolAreaName: string; lostCount: number }[];
  }>(`/lost-items/summary${qs}`);

  return (data?.areas ?? []).map((row) => ({
    schoolAreaId: row.schoolAreaId,
    count: row.lostCount,
  }));
};

import type { SchoolArea } from '../../types/map/map';
import type {
  LostItemDetailResponse,
  LostItemListItem,
  LostItemSummaryRow,
  Category,
} from '../../types/lost/lostApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('요청 실패');
  const json: any = await res.json();
  const rows: any[] = Array.isArray(json?.categories)
    ? json.categories
    : Array.isArray(json)
      ? json
      : [];
  return rows
    .map((row) => {
      const categoryId = row?.categoryId ?? row?.id ?? row?.category_id;
      const categoryName = row?.categoryName ?? row?.name ?? row?.category_name;
      if (
        (typeof categoryId === 'number' || typeof categoryId === 'string') &&
        typeof categoryName === 'string'
      ) {
        return { categoryId: Number(categoryId), categoryName } as Category;
      }
      return null;
    })
    .filter(Boolean) as Category[];
};

export const getLostItemSummary = async (categoryId?: number): Promise<LostItemSummaryRow[]> => {
  const qs = new URLSearchParams();
  if (categoryId) qs.set('categoryId', String(categoryId));
  const qsString = qs.toString();
  const url = qsString
    ? `${API_BASE_URL}/lost-items/summary?${qsString}`
    : `${API_BASE_URL}/lost-items/summary`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('요청 실패');
  const json: { areas: { schoolAreaId: number; schoolAreaName: string; lostCount: number }[] } =
    await res.json();
  return (json.areas ?? []).map((row) => ({
    schoolAreaId: row.schoolAreaId,
    count: row.lostCount,
  }));
};

export const getLostItems = async (
  page: number,
  limit: number,
  categoryId?: number,
  schoolAreaId?: number,
): Promise<{ items: LostItemListItem[]; total: number }> => {
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (categoryId) qs.set('categoryId', String(categoryId));
  if (schoolAreaId) qs.set('schoolAreaId', String(schoolAreaId));
  const res = await fetch(`${API_BASE_URL}/lost-items?${qs.toString()}`);
  if (!res.ok) throw new Error('요청 실패');

  const json: any = await res.json();

  const items: LostItemListItem[] = ((json.items as any[]) ?? []).map((row: any) => ({
    lostItemId: row.id,
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    schoolAreaId: row.schoolAreaId,
    foundLocation: row.foundAreaDetail ?? row.findArea ?? '',
    foundDate: row.createdAt,
    imageUrl: row.representativeImageUrl ?? row.thumbnailUrl ?? row.categoryIconUrl ?? '',
    status: 'registered',
  }));
  const total = json.pageInfo?.totalElements ?? json.count ?? items.length;
  return { items, total };
};

export const getSchoolAreas = async (): Promise<{ schoolAreas: SchoolArea[] }> => {
  const res = await fetch(`${API_BASE_URL}/school-areas`);
  const { schoolAreas }: { schoolAreas: SchoolArea[] } = await res.json();
  return { schoolAreas };
};

// 이거 일단 안쓰는걸로
export const getLostItemDetail = async (lostItemId: number): Promise<LostItemDetailResponse> => {
  const res = await fetch(`${API_BASE_URL}/lost-items/${lostItemId}/detail`);
  const data: LostItemDetailResponse = await res.json();
  return data;
};

export const getLostItemsSimpleInfo = async (lostItemId: number): Promise<LostItemListItem[]> => {
  const res = await fetch(`${API_BASE_URL}/lost-items/${lostItemId}`);
  const data: LostItemListItem[] = await res.json();
  return data;
};

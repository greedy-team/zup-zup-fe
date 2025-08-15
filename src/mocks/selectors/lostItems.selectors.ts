import { lostItems, type LostItem } from '../db/lostItems.db';
import { ETC_CATEGORY_ID, categoryIcons } from '../../constants/category';

export function getLostItemById(id: number): LostItem | undefined {
  return lostItems.find((li) => li.lostItemId === id);
}

export function getSummary(categoryId?: number): { schoolAreaId: number; count: number }[] {
  const filtered = lostItems.filter(
    (li) => li.status === 'registered' && (!categoryId || li.categoryId === categoryId),
  );
  const map = new Map<number, number>();
  for (const li of filtered) map.set(li.schoolAreaId, (map.get(li.schoolAreaId) ?? 0) + 1);
  return Array.from(map, ([schoolAreaId, count]) => ({ schoolAreaId, count }));
}

export function getDetail(params: {
  categoryId?: number;
  schoolAreaId?: number;
  page: number;
  limit: number;
}): {
  items: Array<{
    status: 'registered';
    lostItemId: number;
    categoryId: number;
    categoryName: string;
    foundLocation: string;
    foundDate: string;
    imageUrl: string;
  }>;
  total: number;
} {
  const { categoryId, schoolAreaId, page, limit } = params;

  let list = lostItems.filter((li) => li.status === 'registered');

  if (categoryId) list = list.filter((li) => li.categoryId === categoryId);
  if (schoolAreaId) list = list.filter((li) => li.schoolAreaId === schoolAreaId);

  list = list
    .slice()
    .sort((a, b) => new Date(b.foundDate).getTime() - new Date(a.foundDate).getTime());

  const total = list.length;
  const start = Math.max(0, (page - 1) * limit);

  const items = list.slice(start, start + limit).map((li) => ({
    status: 'registered' as const,
    lostItemId: li.lostItemId,
    categoryId: li.categoryId,
    categoryName: li.categoryName,
    foundLocation: `${li.foundAreaName} ${li.detailLocation}`,
    foundDate: li.foundDate,
    imageUrl: li.categoryId === ETC_CATEGORY_ID ? li.imageUrl : categoryIcons[li.categoryId],
  }));

  return { items, total };
}

export function getEtcDetail(
  lostItemId: number,
): { imageUrl: string; description?: string | null } | { error: 'NOT_FOUND' | 'FORBIDDEN' } {
  const targetLostItem = lostItems.find((item) => item.lostItemId === lostItemId);
  if (!targetLostItem) return { error: 'NOT_FOUND' };
  if (targetLostItem.categoryId !== ETC_CATEGORY_ID) return { error: 'FORBIDDEN' };

  return {
    imageUrl: targetLostItem.imageUrl,
    description: targetLostItem.description ?? null,
  };
}

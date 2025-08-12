import { lostItems, type LostItem } from '../db/lostItems.db';

const categoryIcons: Record<number, string> = {
  1: 'https://i.pinimg.com/736x/ca/62/87/ca62877ddf3a8167120877932f0f9110.jpg',
  2: 'https://i.pinimg.com/736x/a9/39/88/a93988a65cb642aa75d736100a105d77.jpg',
  3: 'https://i.pinimg.com/736x/0a/47/52/0a4752797e9d69eda7f0023515201886.jpg',
  4: 'https://i.pinimg.com/736x/c0/81/31/c0813113702bd8ad0a4308271c53bcf3.jpg',
  5: 'https://i.pinimg.com/736x/da/a2/2e/daa22e9b8b3f3a4de1834916272f69ad.jpg',
  6: 'https://i.pinimg.com/736x/d7/f8/bf/d7f8bff8071a7b22168978f0aed006b9.jpg',
  7: 'https://i.pinimg.com/736x/38/60/08/386008ce4656323cedf6fc65975c1151.jpg',
};

export function getLostItemById(id: number): LostItem | undefined {
  return lostItems.find(li => li.lostItemId === id);
}

export function getSummary(categoryId?: number): { schoolAreaId: number; count: number }[] {
  const filtered = lostItems.filter(
    li => li.status === 'registered' && (!categoryId || li.categoryId === categoryId),
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

  list = list.slice().sort(
    (a, b) =>
      new Date(b.foundDate).getTime() - new Date(a.foundDate).getTime()
  );

  const total = list.length;
  const start = Math.max(0, (page - 1) * limit);

  const items = list.slice(start, start + limit).map((li) => ({
    status: 'registered' as const,
    lostItemId: li.lostItemId,
    categoryId: li.categoryId,
    categoryName: li.categoryName,
    foundLocation: `${li.foundAreaName} ${li.detailLocation}`,
    foundDate: li.foundDate,
    imageUrl: li.categoryId === 99 ? li.imageUrl : categoryIcons[li.categoryId],
  }));

  return { items, total };
}

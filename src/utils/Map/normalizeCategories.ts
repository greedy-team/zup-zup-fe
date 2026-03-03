import type { Category } from '../../types/lost/lostApi';

type CategoriesResponse = Category[] | { categories: Category[] } | undefined;

const normalizeCategories = (data: CategoriesResponse): Category[] => {
  const list = Array.isArray(data) ? data : (data?.categories ?? []);

  return list
    .map((c: any) => ({
      categoryId: Number(c?.categoryId ?? c?.id ?? 0),
      categoryName: String(c?.categoryName ?? c?.name ?? ''),
    }))
    .filter((c) => Number.isFinite(c.categoryId) && c.categoryName.length > 0);
};

export default normalizeCategories;

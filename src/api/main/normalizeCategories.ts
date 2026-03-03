import type { Category } from '../../types/lost/lostApi';

export type CategoryDto = {
  id?: number | string;
  name?: string;
  iconUrl?: string;
};

export type CategoriesResponse = { categories?: CategoryDto[] } | undefined;

const normalizeCategories = (data: CategoriesResponse): Category[] => {
  const rows = data?.categories ?? [];

  return rows
    .map((row) => {
      const categoryId = row.id;
      const categoryName = row.name;
      const categoryIconUrl = row.iconUrl ?? '';

      if (
        (typeof categoryId === 'number' || typeof categoryId === 'string') &&
        typeof categoryName === 'string' &&
        categoryName.trim().length > 0
      ) {
        return { categoryId: Number(categoryId), categoryName, categoryIconUrl };
      }
      return null;
    })
    .filter((category): category is Category => category !== null);
};

export default normalizeCategories;

export type Category = {
  categoryId: number;
  categoryName: string;
  categoryIconUrl: string;
};

export const categories: Category[] = [];

export function resetCategories() {
  categories.length = 0;
}

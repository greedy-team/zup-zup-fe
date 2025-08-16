import { categories, resetCategories, type Category } from '../db/categories.db';

export function seedCategories() {
  resetCategories();
  const rows: Category[] = [
    { categoryId: 1, categoryName: '핸드폰' },
    { categoryId: 2, categoryName: '가방' },
    { categoryId: 3, categoryName: '카드' },
    { categoryId: 4, categoryName: '지갑' },
    { categoryId: 5, categoryName: '악세서리' },
    { categoryId: 6, categoryName: '패드/노트북/전자기기' },
    { categoryId: 99, categoryName: '기타' },
  ];
  categories.push(...rows);
}

import { categories, resetCategories, type Category } from '../db/categories.db';

export function seedCategories() {
  resetCategories();
  const rows: Category[] = [
    { categoryId: 1, categoryName: '핸드폰' },
    { categoryId: 2, categoryName: '가방' },
    { categoryId: 3, categoryName: '결제 카드' },
    { categoryId: 4, categoryName: 'ID 카드' },
    { categoryId: 5, categoryName: '기숙사 카드' },
    { categoryId: 6, categoryName: '지갑' },
    { categoryId: 7, categoryName: '악세서리(금속)' },
    { categoryId: 8, categoryName: '패드' },
    { categoryId: 9, categoryName: '노트북' },
    { categoryId: 10, categoryName: '전자 음향기기' },
    { categoryId: 99, categoryName: '기타' },
  ];
  categories.push(...rows);
}

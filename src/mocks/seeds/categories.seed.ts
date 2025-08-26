import { categories, resetCategories, type Category } from '../db/categories.db';

export function seedCategories() {
  resetCategories();
  const rows: Category[] = [
    {
      categoryId: 1,
      categoryName: '핸드폰',
      categoryIconUrl: 'https://img.icons8.com/?size=100&id=79&format=png&color=000000',
    },
    {
      categoryId: 2,
      categoryName: '가방',
      categoryIconUrl: 'https://img.icons8.com/?size=100&id=59332&format=png&color=000000',
    },
    {
      categoryId: 3,
      categoryName: '결제 카드',
      categoryIconUrl: 'https://img.icons8.com/?size=100&id=kuzF9jfzqSmJ&format=png&color=000000',
    },
    {
      categoryId: 4,
      categoryName: 'ID 카드',
      categoryIconUrl: 'https://img.icons8.com/?size=100&id=23184&format=png&color=000000',
    },
    {
      categoryId: 5,
      categoryName: '기숙사 카드',
      categoryIconUrl: 'https://img.icons8.com/?size=100&id=43347&format=png&color=000000',
    },
    {
      categoryId: 6,
      categoryName: '지갑',
      categoryIconUrl: 'https://img.icons8.com/?size=100&id=20cEXbT1F6ek&format=png&color=000000',
    },
    {
      categoryId: 7,
      categoryName: '악세서리(금속)',
      categoryIconUrl: 'https://img.icons8.com/?size=100&id=19632&format=png&color=000000',
    },
    {
      categoryId: 8,
      categoryName: '패드',
      categoryIconUrl: 'https://img.icons8.com/?size=100&id=2318&format=png&color=000000',
    },
    {
      categoryId: 9,
      categoryName: '노트북',
      categoryIconUrl: 'https://img.icons8.com/?size=100&id=58024&format=png&color=000000',
    },
    {
      categoryId: 10,
      categoryName: '전자 음향기기',
      categoryIconUrl: 'https://img.icons8.com/?size=100&id=2768&format=png&color=000000',
    },
    {
      categoryId: 99,
      categoryName: '기타',
      categoryIconUrl: 'https://img.icons8.com/?size=100&id=sqLdVBiMNNOf&format=png&color=000000',
    },
  ];
  categories.push(...rows);
}

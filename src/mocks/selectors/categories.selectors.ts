import { categories, type Category } from '../db/categories.db';

export function getCategories(): Category[] {
  return categories;
}

export function getCategoryById(id: number): Category | undefined {
  return categories.find(category => category.categoryId === id);
}
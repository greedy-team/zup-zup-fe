import { seedCategories } from './categories.seed';
import { seedSchoolAreas } from './schoolAreas.seed';
import { seedCategoryFeatures } from './features.seed';
import { seedLostItems } from './lostItems.seed';

export function seedAll() {
  seedCategories();
  seedSchoolAreas();
  seedCategoryFeatures();
  seedLostItems();
}

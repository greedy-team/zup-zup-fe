import { categoriesHandlers } from "./handlers/categories.handlers";
import { schoolAreasHandlers } from "./handlers/schoolAreas.handlers";
import { lostItemsHandlers } from "./handlers/lostItems.handlers";
export const handlers = [
  ...lostItemsHandlers,
  ...categoriesHandlers,
  ...schoolAreasHandlers,
];

import { categoriesHandlers } from './handlers/categories.handlers';
import { schoolAreasHandlers } from './handlers/schoolAreas.handlers';
import { lostItemsHandlers } from './handlers/lostItems.handlers';
import { pledgeHandlers } from './handlers/pledge.handlers';
import { quizHandlers } from './handlers/quiz.handlers';

export const handlers = [
  ...lostItemsHandlers,
  ...categoriesHandlers,
  ...schoolAreasHandlers,
  ...pledgeHandlers,
  ...quizHandlers,
];

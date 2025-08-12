import { http, HttpResponse } from 'msw';
import { getCategories } from '../selectors/categories.selectors'; 

export const categoriesHandlers = [
  http.get('/api/categories', () => {
    return HttpResponse.json(getCategories());
  }),
];

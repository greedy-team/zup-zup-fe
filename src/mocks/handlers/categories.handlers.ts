import { http, HttpResponse } from 'msw';
import { getCategories } from '../selectors/categories.selectors';
import { getFeaturesByCategoryId } from '../selectors/features.selectors';
import { toInt } from '../utils/toInt';

export const categoriesHandlers = [
  http.get('/api/categories', () => {
    return HttpResponse.json(getCategories());
  }),
  http.get('/api/categories/:id/features', ({ params }) => {
    const id = toInt(params.id);
    if (id === undefined) {
      return HttpResponse.json({ error: 'invalid categoryId' }, { status: 400 });
    }

    const features = getFeaturesByCategoryId(id);
    if (!features) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }

    return HttpResponse.json(features, { status: 200 });
  }),
];

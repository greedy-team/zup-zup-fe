import { http, HttpResponse } from 'msw';
import { getSummary, getDetail, getEtcDetail } from '../selectors/lostItems.selectors';
import { toInt } from '../utils/toInt';
import { createLostItemFromFormData } from '../selectors/register.selectors';

export const lostItemsHandlers = [
  http.get('/api/lost-items/summary', ({ request }) => {
    const url = new URL(request.url);
    const categoryId = toInt(url.searchParams.get('categoryId'));
    const data = getSummary(categoryId);
    return HttpResponse.json(data);
  }),

  http.get('/api/lost-items/detail', ({ request }) => {
    const url = new URL(request.url);

    const categoryId = toInt(url.searchParams.get('categoryId'));
    const schoolAreaId = toInt(url.searchParams.get('schoolAreaId'));
    const page = toInt(url.searchParams.get('page')) ?? 1;
    const limit = toInt(url.searchParams.get('limit')) ?? 10;

    if (page <= 0 || limit <= 0) {
      return HttpResponse.json(
        { error: 'page and limit must be positive integers' },
        { status: 400 },
      );
    }

    const data = getDetail({
      categoryId,
      schoolAreaId,
      page,
      limit,
    });

    return HttpResponse.json(data);
  }),
  http.get('/api/lost-items/:id', ({ params }) => {
    const id = toInt(params.id);
    if (!id) return HttpResponse.json({ error: 'invalid id' }, { status: 400 });

    const result = getEtcDetail(id);

    if ('error' in result) {
      if (result.error === 'NOT_FOUND') {
        return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
      }
      return HttpResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return HttpResponse.json(result, { status: 200 });
  }),
  http.post('/api/lost-items', async ({ request }) => {
    const formData = await request.formData();
    const result = createLostItemFromFormData(formData);

    if (!result.ok) {
      return HttpResponse.json(result, { status: 400 });
    }
    return HttpResponse.json(result, { status: 201 });
  }),
];

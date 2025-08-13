import { http, HttpResponse } from 'msw';
import { getSummary, getDetail, getEtcDetail } from '../selectors/lostItems.selectors';

function toInt(value: unknown): number | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  if (v == null) return undefined;
  if (typeof v !== 'string') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

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
];

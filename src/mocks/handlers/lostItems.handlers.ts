import { http, HttpResponse } from 'msw';
import { getSummary, getDetail } from '../selectors/lostItems.selectors'; 

function toInt(value: string | null | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
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
        { status: 400 }
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
];
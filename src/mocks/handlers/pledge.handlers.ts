import { http, HttpResponse } from 'msw';
import { handlePledge } from '../selectors/pledge.selectors';

export const pledgeHandlers = [
  http.post('/api/lost-items/:id/pledge', ({ params }) => {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return HttpResponse.json({ error: 'invalid id' }, { status: 400 });
    }

    const result = handlePledge(id);

    if ('error' in result) {
      if (result.error === 'NOT_FOUND')
        return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
      return HttpResponse.json({ error: 'Invalid state' }, { status: 409 });
    }

    return HttpResponse.json({ storageName: result.storageName }, { status: 200 });
  }),
];

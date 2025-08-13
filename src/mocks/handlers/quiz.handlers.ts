import { http, HttpResponse } from 'msw';
import {
  buildQuizForLostItem,
  submitQuizForLostItem,
  type QuizSubmitBody,
} from '../selectors/quiz.selectors';

function toInt(v: unknown): number | undefined {
  if (typeof v !== 'string') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export const quizHandlers = [
  http.get('/api/lost-items/:id/quiz', ({ params }) => {
    const id = toInt(params.id);
    if (!id) return HttpResponse.json({ error: 'invalid id' }, { status: 400 });

    const quiz = buildQuizForLostItem(id);
    if (quiz === undefined) {
      return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
    }
    return HttpResponse.json(quiz, { status: 200 });
  }),

  http.post('/api/lost-items/:id/quiz', async ({ params, request }) => {
    const id = toInt(params.id);
    if (!id) return HttpResponse.json({ error: 'invalid id' }, { status: 400 });

    const body = (await request.json()) as QuizSubmitBody;
    const result = submitQuizForLostItem(id, body);

    if (result === undefined) {
      return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    return HttpResponse.json(result, { status: 200 });
  }),
];

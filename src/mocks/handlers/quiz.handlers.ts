import { http, HttpResponse } from 'msw';
import {
  buildQuizForLostItem,
  submitQuizForLostItem,
  type QuizSubmitBody,
} from '../selectors/quiz.selectors';
import { toInt } from '../utils/toInt';

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

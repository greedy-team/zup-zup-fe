import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizzes, submitQuizzes } from '../../api/find';
import type { QuizItem, QuizSubmitBody } from '../../types/find';
import { useAuthFlag } from '../../contexts/AuthFlag';
import { redirectToLoginKeepPath } from '../../utils/auth/loginRedirect';
import { useFindOutlet } from './FindLayout';

export default function FindQuiz() {
  const { setNextHandler } = useFindOutlet();
  const { setAuthenticated, setUnauthenticated } = useAuthFlag();
  const { lostItemId: idParam } = useParams<{ lostItemId: string }>();
  const lostItemId = Number(idParam);

  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getQuizzes(lostItemId);
        setQuiz(res?.quizzes ?? []);
        setAuthenticated();
      } catch (e: any) {
        if (e?.status === 401) {
          setUnauthenticated();
          redirectToLoginKeepPath();
          return;
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [lostItemId]);

  const canSubmit = useMemo(() => {
    if (quiz.length === 0) return false;
    return quiz.every((q) => answers[q.featureId] != null);
  }, [quiz, answers]);

  useEffect(() => {
    setNextHandler(async () => {
      if (!canSubmit) {
        alert('모든 문항을 선택해주세요.');
        return false;
      }
      const body: QuizSubmitBody = {
        answers: quiz.map((q) => ({
          featureId: q.featureId,
          selectedOptionId: answers[q.featureId],
        })),
      };
      try {
        await submitQuizzes(lostItemId, body); // 200이어야 성공
        return true;
      } catch (e: any) {
        // 실패 → 홈으로
        window.location.assign('/');
        return false;
      }
    });
    return () => setNextHandler(null);
  }, [canSubmit, quiz, answers, lostItemId]);

  if (loading) return <div className="p-4 text-sm text-gray-500">퀴즈 불러오는 중…</div>;
  if (quiz.length === 0) return <div className="p-4 text-sm text-red-600">퀴즈가 없습니다.</div>;

  return (
    <div className="space-y-8">
      {quiz.map((q) => {
        const selected = answers[q.featureId];
        return (
          <div key={q.featureId} className="space-y-3">
            <p className="text-base font-semibold">{q.question}</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {q.options.map((opt) => {
                const active = selected === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`block cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      active
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`quizChoice-${q.featureId}`}
                      value={opt.id}
                      className="sr-only"
                      onChange={() => setAnswers((prev) => ({ ...prev, [q.featureId]: opt.id }))}
                    />
                    <span className="font-medium">{opt.text}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

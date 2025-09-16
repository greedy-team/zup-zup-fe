import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizzes, submitQuizzes } from '../../api/find';
import type { QuizItem, QuizSubmitBody } from '../../types/find';
import { useAuthFlag } from '../../contexts/AuthFlag';
import { redirectToLoginKeepPath } from '../../utils/auth/loginRedirect';
import { useFindOutlet } from '../../hooks/find/useFindOutlet';

export default function FindQuiz() {
  const navigate = useNavigate();
  const { setNextButtonValidator } = useFindOutlet();
  const { isAuthenticated, setAuthenticated, setUnauthenticated } = useAuthFlag();
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
        if (isAuthenticated && e?.status === 401) {
          alert('로그인 토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
          setUnauthenticated();
          redirectToLoginKeepPath();
          return;
        }
        if (e?.status === 401) {
          alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
          redirectToLoginKeepPath();
          return;
        } else if (e?.status === 403) {
          alert('퀴즈 시도 시도 횟수를 초과 했습니다.');
          navigate('/', { replace: true });
          return;
        } else if (e?.status === 404) {
          alert('해당 id의 분실물이 존재하지 않습니다.');
          navigate('/', { replace: true });
          return;
        } else if (e?.status === 409) {
          alert('이미 서약이 완료된 분실물 입니다.');
          navigate('/', { replace: true });
          return;
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
          navigate('/', { replace: true });
          return;
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [lostItemId, isAuthenticated, setAuthenticated, setUnauthenticated, navigate]);

  useEffect(() => {
    setNextButtonValidator(async () => {
      const canSubmit = quiz.length > 0 && quiz.every((q) => answers[q.featureId] != null);

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
        await submitQuizzes(lostItemId, body);
        return true;
      } catch (e: any) {
        if (isAuthenticated && e?.status === 401) {
          alert('로그인 토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
          setUnauthenticated();
          redirectToLoginKeepPath();
          return false;
        }
        if (e?.status === 401) {
          alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
          redirectToLoginKeepPath();
          return false;
        } else if (e?.status === 403) {
          alert('퀴즈 시도 시도 횟수를 초과 했습니다.');
          navigate('/', { replace: true });
          return false;
        } else if (e?.status === 404) {
          alert('해당 id의 분실물이 존재하지 않습니다.');
          navigate('/', { replace: true });
          return false;
        } else if (e?.status === 409) {
          alert('이미 서약이 완료된 분실물 입니다.');
          navigate('/', { replace: true });
          return false;
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
          navigate('/', { replace: true });
          return false;
        }
      }
    });

    return () => setNextButtonValidator(null);
  }, [
    quiz,
    answers,
    lostItemId,
    setNextButtonValidator,
    isAuthenticated,
    setAuthenticated,
    setUnauthenticated,
    navigate,
  ]);

  if (loading)
    return <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">퀴즈 불러오는 중…</div>;
  if (quiz.length === 0)
    return <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">퀴즈가 없습니다.</div>;

  return (
    <div className="space-y-8">
      {quiz.map((q) => {
        const selected = answers[q.featureId];
        return (
          <div key={q.featureId} className="space-y-3">
            <p className="text-base font-semibold">{q.question}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

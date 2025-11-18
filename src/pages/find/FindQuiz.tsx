import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQuizzesQuery, useSubmitQuizzesMutation } from '../../api/find/hooks/useFind';
import type { QuizItem, QuizSubmitBody } from '../../types/find';
import { useAuthActions } from '../../store/hooks/useAuth';
import { useRedirectToLoginKeepPath } from '../../utils/auth/loginRedirect';
import type { ApiError } from '../../types/common';
import { useFindOutlet } from '../../hooks/find/useFindOutlet';
import { showApiErrorToast } from '../../api/common/apiErrorToast';

export default function FindQuiz() {
  const navigate = useNavigate();
  const { setNextButtonValidator } = useFindOutlet();
  const { setAuthenticated, setUnauthenticated } = useAuthActions();
  const { lostItemId: idParam } = useParams<{ lostItemId: string }>();
  const lostItemId = Number(idParam);

  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const { data, isLoading, error } = useQuizzesQuery(lostItemId);
  const { mutateAsync: submitQuizzes } = useSubmitQuizzesMutation(lostItemId);
  const redirectToLoginKeepPath = useRedirectToLoginKeepPath();

  useEffect(() => {
    if (!data) return;
    setQuiz(data.quizzes ?? []);
    setAuthenticated();
  }, [data, setAuthenticated]);

  useEffect(() => {
    if (!error) return;

    showApiErrorToast(error);

    if (error.status === 401) {
      setUnauthenticated();
      redirectToLoginKeepPath();
    } else {
      navigate('/', { replace: true });
    }
  }, [error, navigate, setUnauthenticated, redirectToLoginKeepPath]);

  useEffect(() => {
    setNextButtonValidator(async () => {
      const canSubmit = quiz.length > 0 && quiz.every((q) => answers[q.featureId] != null);

      if (!canSubmit) {
        toast.error('모든 문항을 선택해주세요.');
        return false;
      }

      const body: QuizSubmitBody = {
        answers: quiz.map((q) => ({
          featureId: q.featureId,
          selectedOptionId: answers[q.featureId],
        })),
      };

      try {
        await submitQuizzes(body);
        setAuthenticated();
        return true;
      } catch (e) {
        const err = e as ApiError | undefined;
        if (!err) return false;

        showApiErrorToast(err);

        if (err.status === 401) {
          setUnauthenticated();
          redirectToLoginKeepPath();
          return false;
        } else {
          navigate('/', { replace: true });
          return false;
        }
      }
    });

    return () => setNextButtonValidator(null);
  }, [
    quiz,
    answers,
    submitQuizzes,
    setNextButtonValidator,
    setAuthenticated,
    setUnauthenticated,
    navigate,
    redirectToLoginKeepPath,
  ]);

  if (isLoading)
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
                      onChange={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [q.featureId]: opt.id,
                        }))
                      }
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

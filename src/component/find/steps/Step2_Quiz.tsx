import type { QuizItem } from '../../../types/find';

type Props = {
  quiz: QuizItem[] | null;
  selectedAnswers: Record<number, number>;
  onSelect: (featureId: number, optionId: number) => void;
};

const Step2_Quiz = ({ quiz, selectedAnswers, onSelect }: Props) => {
  if (!quiz || quiz.length === 0)
    return <div className="flex h-64 items-center justify-center">퀴즈를 불러오지 못했습니다.</div>;

  return (
    <div className="space-y-8">
      {quiz.map((q) => {
        const selected = selectedAnswers[q.featureId];
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
                      onChange={() => onSelect(q.featureId, opt.id)}
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
};
export default Step2_Quiz;

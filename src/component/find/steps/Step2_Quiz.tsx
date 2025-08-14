import type { QuizData } from '../../../types/find';

type Props = {
  quiz: QuizData | null;
  selectedChoiceId: string | null;
  onSelect: (id: string) => void;
};

const Step2_Quiz = ({ quiz, selectedChoiceId, onSelect }: Props) => {
  if (!quiz)
    return <div className="flex h-64 items-center justify-center">퀴즈를 불러오지 못했습니다.</div>;

  return (
    <div className="space-y-4">
      <p className="text-center text-lg font-semibold">{quiz.question}</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {quiz.choices.map((choice) => (
          <label
            key={choice.id}
            className={`block cursor-pointer rounded-lg border-2 p-4 transition-all ${
              selectedChoiceId === choice.id
                ? 'border-teal-600 bg-teal-50'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name="quizChoice"
              value={choice.id}
              className="sr-only"
              onChange={() => onSelect(choice.id)}
            />
            <span className="font-medium">{choice.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
export default Step2_Quiz;

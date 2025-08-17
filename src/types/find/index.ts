export type QuizOption = { id: number; text: string };
export type QuizItem = { featureId: number; question: string; options: QuizOption[] };
export type QuizAnswer = { featureId: number; selectedOptionId: number };
export type QuizSubmitBody = { answers: QuizAnswer[] };

export type QuizResult =
  | { correct: true; detail: { imageUrl: string; description?: string | null } }
  | { correct: false };

export type ResultModalStatus = 'success' | 'error' | 'info';

export type ResultModalProps = {
  status: ResultModalStatus;
  title: string;
  message: string;
  buttonText: string;
  onConfirm: () => void;
};

export type QuizChoice = {
  id: string;
  text: string;
};

export type QuizData = {
  questionId: string;
  question: string;
  choices: QuizChoice[];
  correctChoiceId: string;
};

export type ResultModalStatus = 'success' | 'error' | 'info';

export type ResultModalProps = {
  status: 'success' | 'error' | 'info';
  title: string;
  message: string;
  buttonText: string;
  onConfirm: () => void;
};

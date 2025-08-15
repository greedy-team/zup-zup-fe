import type { QuizData } from '../../types/find';

export const mockQuizData: QuizData = {
  questionId: 'q1',
  question: '분실된 지갑의 색상은 무엇이었나요?',
  choices: [
    { id: 'c1', text: '검은색' },
    { id: 'c2', text: '갈색' },
    { id: 'c3', text: '파란색' },
    { id: 'c4', text: '빨간색' },
  ],
  correctChoiceId: 'c2',
};

export const fetchQuiz = (itemId: number): Promise<QuizData> => {
  console.log(`[API] 퀴즈 데이터 요청 (ID: ${itemId})`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockQuizData);
    }, 800);
  });
};

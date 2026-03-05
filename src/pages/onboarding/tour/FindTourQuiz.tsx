const SAMPLE_QUIZZES = [
  {
    question: '핸드폰의 색상은 무엇인가요?',
    options: ['검정', '흰색', '파란색', '빨간색'],
  },
  {
    question: '핸드폰의 케이스 종류는 무엇인가요?',
    options: ['케이스 없음', '투명 케이스', '컬러 케이스', '지갑형 케이스'],
  },
];

export default function FindTourQuiz() {
  return (
    <div className="space-y-8">
      {SAMPLE_QUIZZES.map((q, i) => (
        <div key={i} className="space-y-3">
          <p className="text-base font-semibold">{q.question}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {q.options.map((opt) => (
              <label key={opt} className="block rounded-lg border-2 border-gray-200 p-4">
                <span className="font-medium text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

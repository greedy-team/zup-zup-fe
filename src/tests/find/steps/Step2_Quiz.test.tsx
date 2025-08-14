import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Step2_Quiz from '../../../component/find/steps/Step2_Quiz';
import type { QuizData } from '../../../types/find';

const mockQuiz: QuizData = {
  questionId: 'q1',
  question: '해당 카드의 은행은?',
  choices: [
    { id: 'a1', text: '국민' },
    { id: 'a2', text: '신한' },
    { id: 'a3', text: '농협' },
    { id: 'a4', text: '카카오' },
  ],
  correctChoiceId: 'c1',
};

describe('Step2_Quiz 컴포넌트 테스트', () => {
  it('quiz prop이 null일 때 "퀴즈를 불러오지 못했습니다." 메시지를 표시해야 한다', () => {
    render(<Step2_Quiz quiz={null} selectedChoiceId={null} onSelect={() => {}} />);
    expect(screen.getByText('퀴즈를 불러오지 못했습니다.')).toBeInTheDocument();
  });

  it('quiz prop이 제공되면 질문과 선택지를 렌더링해야 한다', () => {
    render(<Step2_Quiz quiz={mockQuiz} selectedChoiceId={null} onSelect={() => {}} />);
    expect(screen.getByText('해당 카드의 은행은?')).toBeInTheDocument();
    mockQuiz.choices.forEach((choice) => {
      expect(screen.getByText(choice.text)).toBeInTheDocument();
    });
  });

  it('선택지를 클릭하면 onSelect 함수가 올바른 id와 함께 호출되어야 한다', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<Step2_Quiz quiz={mockQuiz} selectedChoiceId={null} onSelect={handleSelect} />);

    const reactChoice = screen.getByText('국민');
    await user.click(reactChoice);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('a1');
  });

  it('selectedChoiceId prop과 일치하는 선택지에 활성화 스타일이 적용되어야 한다', () => {
    const selectedId = 'a2';
    render(<Step2_Quiz quiz={mockQuiz} selectedChoiceId={selectedId} onSelect={() => {}} />);

    const selectedLabel = screen.getByText('신한').closest('label');
    expect(selectedLabel?.className).toContain('border-emerald-600');

    const unselectedLabel = screen.getByText('국민').closest('label');
    expect(unselectedLabel?.className).not.toContain('border-emerald-600');
  });
});

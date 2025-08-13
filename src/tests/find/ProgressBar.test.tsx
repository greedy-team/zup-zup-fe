import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from '../../component/find/ProgressBar';

const mockSteps = ['물건 정보', '인증 퀴즈', '약관 동의'];

describe('ProgressBar 컴포넌트 테스트', () => {
  it('전달된 steps 배열의 길이만큼 단계가 렌더링되어야 한다', () => {
    render(<ProgressBar steps={mockSteps} currentStep={1} />);

    const stepElements = screen.getAllByText(/\d/);
    expect(stepElements.length).toBe(mockSteps.length);

    mockSteps.forEach((stepName) => {
      expect(screen.getByText(stepName)).toBeInTheDocument();
    });
  });

  it('currentStep에 해당하는 단계가 활성화 상태여야 한다', () => {
    const currentStep = 2;
    render(<ProgressBar steps={mockSteps} currentStep={currentStep} />);

    const activeStepElement = screen.getByText(currentStep.toString());
    expect(activeStepElement.className).toContain('bg-emerald-600');

    const inactiveStepElement = screen.getByText(currentStep + 1);
    expect(inactiveStepElement.className).not.toContain('bg-emerald-600');
  });

  it('현재 단계보다 이전 단계들은 완료 상태로 표시되어야 한다', () => {
    const currentStep = 3;
    render(<ProgressBar steps={mockSteps} currentStep={currentStep} />);

    const completedStepElement = screen.getByText((currentStep - 1).toString());
    expect(completedStepElement.className).toContain('bg-emerald-600');
  });
});

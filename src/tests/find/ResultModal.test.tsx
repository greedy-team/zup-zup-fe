import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ResultModal from '../../component/common/ResultModal';
import type { ResultModalProps } from '../../types/find';

describe('ResultModal 컴포넌트 테스트', () => {
  const mockOnConfirm = vi.fn();

  const defaultProps: ResultModalProps = {
    status: 'success',
    title: '테스트 제목',
    message: '테스트 메시지입니다.',
    buttonText: '확인',
    onConfirm: mockOnConfirm,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('props로 전달된 제목, 메시지, 버튼 텍스트를 올바르게 렌더링해야 한다', () => {
    render(<ResultModal {...defaultProps} />);

    expect(screen.getByText('테스트 제목')).toBeInTheDocument();
    expect(screen.getByText('테스트 메시지입니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument();
  });

  it('확인 버튼 클릭 시 onConfirm 함수가 호출되어야 한다', async () => {
    const user = userEvent.setup();
    render(<ResultModal {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: '확인' });
    await user.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it.each([
    { status: 'success', expectedBg: 'bg-green-500' },
    { status: 'error', expectedBg: 'bg-red-500' },
    { status: 'info', expectedBg: 'bg-emerald-500' },
  ])(
    '$status 상태일 때 올바른 아이콘 배경색($expectedBg)을 표시해야 한다',
    ({ status, expectedBg }) => {
      const props = { ...defaultProps, status: status as ResultModalProps['status'] };
      const { container } = render(<ResultModal {...props} />);

      const iconWrapper = container.querySelector('.rounded-full');
      expect(iconWrapper?.className).toContain(expectedBg);
    },
  );
});

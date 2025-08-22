import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterConfirmModal from '../../component/main/modal/RegisterConfirmModal';
import { describe, expect, it, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

afterEach(() => cleanup());

describe('RegisterConfirmModal', () => {
  it('isOpen=false면 렌더하지 않음', () => {
    const { container } = render(
      <RegisterConfirmModal isOpen={false} onConfirm={() => {}} onCancel={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('isOpen=true면 제목 표시', () => {
    render(<RegisterConfirmModal isOpen onConfirm={() => {}} onCancel={() => {}} />);
    expect(screen.getByText('분실물을 해당 위치에 등록하시겠습니까?')).toBeInTheDocument();
  });

  it('버튼 클릭 시 콜백 호출', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(<RegisterConfirmModal isOpen onConfirm={onConfirm} onCancel={onCancel} />);

    const confirms = screen.getAllByRole('button', { name: '등록' });
    const cancels = screen.getAllByRole('button', { name: '취소' });
    expect(confirms.length).toBe(1);
    expect(cancels.length).toBe(1);

    await user.click(confirms[0]);
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await user.click(cancels[0]);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

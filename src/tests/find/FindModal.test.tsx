import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FindLostItemModal from '../../component/find/FindModal';
import * as useFindProcessHook from '../../hooks/find/useFindProcess';
import type { LostItem } from '../../component/main/main/lostListItem';

// useFindProcess 훅을 모의(mock) 처리합니다.
vi.mock('../../hooks/find/useFindProcess');

const mockItem: LostItem = {
  lostItemId: 1,
  categoryName: '지갑',
  foundDate: '2024-08-12T15:00:00.000Z',
  foundLocation: '학생회관',
  status: 'registered',
  categoryId: 'WALLET',
};

const mockOnClose = vi.fn();

// 모의 훅이 반환할 기본값
const mockUseFindProcessDefaultValues = {
  currentStep: 1,
  isLoading: false,
  quiz: null,
  selectedChoiceId: null,
  resultModal: {
    isOpen: false,
    status: 'success',
    title: '',
    message: '',
    buttonText: '',
    onConfirm: () => {},
  },
  agreementRef: { current: null },
  isValuable: true,
  handleNextStep: vi.fn(),
  setSelectedChoiceId: vi.fn(),
};

describe('FindModal 컴포넌트 테스트', () => {
  let useFindProcessSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // 각 테스트 전에 모의 훅의 반환값을 기본값으로 설정
    useFindProcessSpy = vi
      .spyOn(useFindProcessHook, 'useFindProcess')
      .mockReturnValue(mockUseFindProcessDefaultValues);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Step1 렌더링 및 버튼 확인', async () => {
    render(<FindLostItemModal item={mockItem} onClose={mockOnClose} />);

    expect(screen.getByText('분실물 카테고리')).toBeInTheDocument();
    expect(screen.getByText('발견 장소')).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: '다음' });
    expect(nextButton).toBeInTheDocument();
  });

  it('Step2 렌더링 및 버튼 확인', () => {
    useFindProcessSpy.mockReturnValue({ ...mockUseFindProcessDefaultValues, currentStep: 2 });
    render(<FindLostItemModal item={mockItem} onClose={mockOnClose} />);
    expect(screen.getByText(/퀴즈를 불러오지 못했습니다/)).toBeInTheDocument();

    const checkButton = screen.getByRole('button', { name: '정답 확인' });
    expect(checkButton).toBeInTheDocument();
  });

  it('Step3 렌더링 및 버튼 확인', () => {
    useFindProcessSpy.mockReturnValue({ ...mockUseFindProcessDefaultValues, currentStep: 3 });
    render(<FindLostItemModal item={mockItem} onClose={mockOnClose} />);
    expect(screen.getByPlaceholderText('상단 문구를 똑같이 입력해주세요.')).toBeInTheDocument();

    const lastButton = screen.getByRole('button', { name: '보관 장소 조회하기' });
    expect(lastButton).toBeInTheDocument();
  });

  it('로딩 상태일 때 SpinnerIcon 렌더링', () => {
    useFindProcessSpy.mockReturnValue({ ...mockUseFindProcessDefaultValues, isLoading: true });
    render(<FindLostItemModal item={mockItem} onClose={mockOnClose} />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose 호출', async () => {
    const user = userEvent.setup();
    render(<FindLostItemModal item={mockItem} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText('close');
    await user.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('닫기 버튼 클릭 시 onClose 호출', async () => {
    const user = userEvent.setup();
    render(<FindLostItemModal item={mockItem} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText('close');
    await user.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('메인 버튼 클릭 시 handleNextStep 호출', async () => {
    const user = userEvent.setup();
    render(<FindLostItemModal item={mockItem} onClose={mockOnClose} />);
    const nextButton = screen.getByRole('button', { name: '다음' });
    await user.click(nextButton);
    expect(mockUseFindProcessDefaultValues.handleNextStep).toHaveBeenCalledTimes(1);
  });

  it('ResultModal이 열리면 내용이 화면에 렌더링', () => {
    useFindProcessSpy.mockReturnValue({
      ...mockUseFindProcessDefaultValues,
      resultModal: {
        isOpen: true,
        status: 'success',
        title: '성공',
        message: '성공 메시지',
        buttonText: '확인',
        onConfirm: () => {},
      },
    });
    render(<FindLostItemModal item={mockItem} onClose={mockOnClose} />);
    expect(screen.getByText('성공')).toBeInTheDocument();
    expect(screen.getByText('성공 메시지')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument();
  });
});

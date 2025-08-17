import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterModal from '../../component/register/RegisterModal';
import * as api from '../../api/register';

vi.mock('../../api/register');

describe('RegisterModal 컴포넌트 통합 테스트', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.spyOn(api, 'fetchCategoryFeatures').mockResolvedValue([]);
    vi.spyOn(api, 'postLostItem').mockResolvedValue({ success: true });
    mockOnClose.mockClear();
  });

  it('1단계에서 카테고리 선택 후 2단계로 이동', async () => {
    render(<RegisterModal onClose={mockOnClose} />);
    expect(screen.getByText('카테고리를 선택해주세요')).toBeInTheDocument();

    const categoryButton = screen.getByRole('button', { name: '휴대폰' });
    fireEvent.click(categoryButton);

    const nextButton = screen.getByRole('button', { name: '다음' });
    fireEvent.click(nextButton);

    await screen.findByText('카테고리 특징');
    expect(screen.getByText('카테고리 특징')).toBeInTheDocument();
  });

  it('1단계에서 카테고리 미선택 시 다음 버튼 비활성화', () => {
    render(<RegisterModal onClose={mockOnClose} />);
    const nextButton = screen.getByRole('button', { name: '다음' });
    expect(nextButton).toBeDisabled();
  });

  it('2단계에서 이전 버튼 클릭 시 1단계로 돌아감', async () => {
    render(<RegisterModal onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole('button', { name: '휴대폰' }));
    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    await screen.findByText('카테고리 특징');
    fireEvent.click(screen.getByRole('button', { name: '이전' }));
    expect(screen.getByText('카테고리를 선택해주세요')).toBeInTheDocument();
  });

  it('마지막 단계에서 등록하기 버튼 클릭 시 API 호출 및 모달 닫힘', async () => {
    // Step2에서 사용할 mock categoryFeatures
    vi.spyOn(api, 'fetchCategoryFeatures').mockResolvedValue([
      { id: 'color', question: '색상은 무엇인가요?', options: ['빨강', '파랑'] },
    ]);

    render(<RegisterModal onClose={mockOnClose} />);

    // 1단계 → 카테고리 선택
    fireEvent.click(screen.getByRole('button', { name: '휴대폰' }));
    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    // 2단계 로딩 후 카테고리 특징 표시
    await screen.findByText('카테고리 특징');

    // (1) 카테고리 특징 선택
    fireEvent.change(screen.getByLabelText('색상은 무엇인가요?'), {
      target: { value: '빨강' },
    });

    // (2) 위치 상세 정보 입력
    fireEvent.change(screen.getByLabelText('상세 위치 (예: 401호, 정문 앞 소파)'), {
      target: { value: '401호' },
    });

    // (3) 보관 장소 입력
    fireEvent.change(screen.getByPlaceholderText('분실물을 보관하고 있는 장소를 입력해주세요'), {
      target: { value: '사물함' },
    });

    // (4) 사진 업로드 (mock File 객체 사용)
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // "다음" 버튼 클릭 → 3단계로 이동
    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    // 3단계에서 "등록하기" 버튼 확인 후 클릭
    const registerButton = await screen.findByRole('button', { name: '등록하기' });
    fireEvent.click(registerButton);

    // 등록 완료 모달이 뜰 때까지 기다림
    await screen.findByText('등록 완료!');

    // '홈으로' 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: '홈으로' }));

    // API 호출 및 모달 닫힘 확인
    await waitFor(() => {
      expect(api.postLostItem).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('닫기 버튼 클릭 시 onClose 호출', () => {
    render(<RegisterModal onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});

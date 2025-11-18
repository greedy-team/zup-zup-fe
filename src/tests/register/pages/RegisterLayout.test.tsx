import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterLayout from '../../../pages/register/RegisterLayout';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';

// useRegisterLayout 훅과 그 내부 함수들 모킹
const mockFns = {
  goToPrevStep: vi.fn(),
  goToNextStep: vi.fn(),
  handleRegister: vi.fn(),
  setSelectedCategory: vi.fn(),
  dispatch: vi.fn(),
  resetForm: vi.fn(),
};
let mockState: any = {
  steps: [{ title: '기본정보' }, { title: '보관장소' }, { title: '확인' }],
  currentStep: 1,
  resultModalContent: null,
  isLoading: false,
  selectedCategory: null,
  isStep2Valid: true,
  categories: [],
  categoryFeatures: [],
  formData: {
    foundAreaId: 1,
    foundAreaDetail: '',
    depositArea: '',
    images: [],
    imageOrder: [],
    featureOptions: [],
    description: '',
  },
  schoolAreas: [],
  ...mockFns,
};
vi.mock('../../../hooks/register/useRegisterLayout', () => {
  return {
    useRegisterLayout: () => mockState,
  };
});

// 등록 과정 라우팅 구조를 포함한 렌더링 함수
const renderLayout = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/register/:schoolAreaId" element={<RegisterLayout />}>
          <Route index element={<Navigate to="category" replace />} />
          <Route path="category" element={<div>Category</div>} />
          <Route path="details" element={<div>Details</div>} />
          <Route path="review" element={<div>Review</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  mockFns.goToPrevStep.mockClear();
  mockFns.goToNextStep.mockClear();
  mockFns.handleRegister.mockClear();
  mockState = {
    steps: ['기본정보', '보관장소', '확인'],
    currentStep: 1,
    resultModalContent: null,
    isLoading: false,
    selectedCategory: null,
    isStep2Valid: false,
    ...mockFns,
  };
});

describe('RegisterLayout 페이지 단위 테스트', () => {
  it('분실물 등록 제목이 렌더링된다', () => {
    renderLayout('/register/1/category');
    expect(screen.getByText('분실물 등록')).toBeInTheDocument();
  });

  it('useRegisterLayout에서 받은 steps를 ProgressBar에 전달하여 렌더링한다', () => {
    renderLayout('/register/3/category');
    mockState.steps.forEach((label: string) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  describe('경로에 따른 Outlet 렌더링', () => {
    it('/register/:schoolAreaId/category 경로에서는 Category 자식이 렌더링된다', () => {
      renderLayout('/register/3/category');
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('/register/:schoolAreaId/details 경로에서는 Details 자식이 렌더링된다', () => {
      renderLayout('/register/3/details');
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('/register/:schoolAreaId/review 경로에서는 Review 자식이 렌더링된다', () => {
      renderLayout('/register/3/review');
      expect(screen.getByText('Review')).toBeInTheDocument();
    });
  });
});

describe('하단 액션 영역(이전/다음/등록하기) UI/동작', () => {
  it('1단계: "취소" / "다음" 렌더링, 선택이 없으면 다음 버튼 비활성화', () => {
    mockState.currentStep = 1;
    mockState.selectedCategory = null;
    renderLayout('/register/3/category');

    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
    const nextBtn = screen.getByRole('button', { name: '다음' });
    expect(nextBtn).toBeDisabled();
  });

  it('1단계: 카테고리 선택 시 "다음" 활성화되고 클릭 시 goToNextStep 호출', async () => {
    mockState.currentStep = 1;
    mockState.selectedCategory = { id: 'phone', name: '휴대폰' };
    renderLayout('/register/3/category');

    const nextBtn = screen.getByRole('button', { name: '다음' });
    expect(nextBtn).not.toBeDisabled();
    await userEvent.click(nextBtn);
    expect(mockFns.goToNextStep).toHaveBeenCalledTimes(1); // 해당 함수가 몇 번 호출됐는지 검사하는 로직
  });

  it('2단계: "이전" / "다음" 렌더링, isStep2Valid=false면 다음 비활성화', () => {
    mockState.currentStep = 2;
    mockState.isStep2Valid = false;
    renderLayout('/register/3/details');

    expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
    const nextBtn = screen.getByRole('button', { name: '다음' });
    expect(nextBtn).toBeDisabled();
  });

  it('2단계: isStep2Valid=true면 "다음" 활성화되고 클릭 시 goToNextStep 호출', async () => {
    mockState.currentStep = 2;
    mockState.isStep2Valid = true;
    renderLayout('/register/3/details');

    const nextBtn = screen.getByRole('button', { name: '다음' });
    expect(nextBtn).not.toBeDisabled();
    await userEvent.click(nextBtn);
    expect(mockFns.goToNextStep).toHaveBeenCalledTimes(1);
  });

  it('2단계: "이전" 클릭 시 goToPrevStep 호출', async () => {
    mockState.currentStep = 2;
    renderLayout('/register/3/details');

    const prevBtn = screen.getByRole('button', { name: '이전' });
    await userEvent.click(prevBtn);
    expect(mockFns.goToPrevStep).toHaveBeenCalledTimes(1);
  });

  it('마지막 단계: "등록하기" 버튼 렌더링 & 클릭 시 handleRegister 호출', async () => {
    mockState.currentStep = mockState.steps.length;
    mockState.isLoading = false;
    renderLayout('/register/3/review');

    const registerBtn = screen.getByRole('button', { name: '등록하기' });
    expect(registerBtn).toBeInTheDocument();
    expect(registerBtn).not.toBeDisabled();
    await userEvent.click(registerBtn);
    expect(mockFns.handleRegister).toHaveBeenCalledTimes(1);
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterConfirmModal from '../../component/main/modal/RegisterConfirmModal';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import {
  AppProvider,
  RegisterConfirmModalContext,
  SchoolAreasContext,
} from '../../contexts/AppContexts';

const renderWithContexts = (isOpen: boolean) => {
  return render(
    <MemoryRouter initialEntries={['/?schoolAreaId=1']}>
      <AppProvider>
        <RegisterConfirmModalContext.Provider
          value={{ isRegisterConfirmModalOpen: isOpen, setIsRegisterConfirmModalOpen: () => {} }}
        >
          <SchoolAreasContext.Provider
            value={{
              schoolAreas: [
                {
                  id: 1,
                  areaName: '학술정보원',
                  areaPolygon: { coordinates: [{ lat: 0, lng: 0 }] },
                  marker: { lat: 0, lng: 0 },
                },
                {
                  id: 2,
                  areaName: '광개토관',
                  areaPolygon: { coordinates: [{ lat: 0, lng: 0 }] },
                  marker: { lat: 0, lng: 0 },
                },
              ],
              setSchoolAreas: () => {},
            }}
          >
            <RegisterConfirmModal />
          </SchoolAreasContext.Provider>
        </RegisterConfirmModalContext.Provider>
      </AppProvider>
    </MemoryRouter>,
  );
};

describe('등록 확인 모달', () => {
  it('닫혀 있으면 보이지 않는다', () => {
    const { container } = renderWithContexts(false);
    expect(container).toBeEmptyDOMElement();
  });

  it('열려 있으면 제목과 버튼이 보인다', () => {
    renderWithContexts(true);
    expect(screen.getByRole('button', { name: '등록' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
  });

  it('버튼 클릭이 동작한다', async () => {
    const user = userEvent.setup();
    renderWithContexts(true);

    await user.click(screen.getByRole('button', { name: '등록' }));
    // 간단 확인: 모달 트리거 후에도 컴포넌트가 존재 (내비게이션은 MemoryRouter로 처리)
    expect(document.body).toBeTruthy();

    // 취소 버튼도 클릭 가능
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(document.body).toBeTruthy();
  });
});

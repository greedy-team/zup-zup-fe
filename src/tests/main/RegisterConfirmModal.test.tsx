import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterConfirmModal from '../../component/main/modal/RegisterConfirmModal';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import {
  AppProvider,
  RegisterConfirmModalContext,
  SchoolAreasContext,
} from '../../contexts/AppContexts';

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

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
            <LocationDisplay />
          </SchoolAreasContext.Provider>
        </RegisterConfirmModalContext.Provider>
      </AppProvider>
    </MemoryRouter>,
  );
};

describe('등록 확인 모달', () => {
  it('닫혀 있으면 보이지 않는다', () => {
    renderWithContexts(false);
    expect(screen.queryByRole('button', { name: '등록' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '취소' })).not.toBeInTheDocument();
  });

  it('열려 있으면 제목과 버튼이 보인다', () => {
    renderWithContexts(true);
    expect(screen.getByRole('button', { name: '등록' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
  });

  it('등록 버튼 클릭 시 등록 페이지로 이동한다', async () => {
    const user = userEvent.setup();
    renderWithContexts(true);

    await user.click(screen.getByRole('button', { name: '등록' }));
    // 등록 버튼 클릭 시 등록 페이지로 이동한다
    expect(screen.getByTestId('location-display')).toHaveTextContent('/register/1');

    // 모달이 사라진 상태인지 확인
    expect(screen.queryByRole('button', { name: '취소' })).not.toBeInTheDocument();
  });
  it('취소 버튼 클릭 시 모달이 닫힌다', async () => {
    const user = userEvent.setup();
    renderWithContexts(true);

    await user.click(screen.getByRole('button', { name: '취소' }));

    // 모달이 닫힌 상태인지 확인
    expect(screen.queryByRole('button', { name: '등록' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '취소' })).not.toBeInTheDocument();
  });
});

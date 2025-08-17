import { render, screen, cleanup } from '@testing-library/react';
import Main from '../../component/main/main/main';
import type { LostItem } from '../../component/main/main/list/lostListItem';
import { describe, expect, it, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('../../component/main/main/map', () => ({
  default: () => <div data-testid="map" />,
}));

afterEach(() => cleanup());

const items: LostItem[] = [];

describe('Main submit button disabled state', () => {
  it('좌표가 없으면 버튼 비활성화', () => {
    render(
      <Main
        selectedCategory="전체"
        items={items}
        selectedLat={null}
        selectedLng={null}
        setSelectedLat={() => {}}
        setSelectedLng={() => {}}
        setIsRegisterConfirmModalOpen={() => {}}
        setSelectedArea={() => {}}
        selectedArea="전체"
      />,
    );

    expect(screen.getAllByRole('button', { name: '분실물 추가' })).toHaveLength(1);

    const btn = screen.getByRole('button', { name: '분실물 추가' });
    expect(btn).toBeDisabled();
  });

  it('좌표가 있으면 버튼 활성화', () => {
    render(
      <Main
        selectedCategory="전체"
        items={items}
        selectedLat={37.55}
        selectedLng={127.07}
        setSelectedLat={() => {}}
        setSelectedLng={() => {}}
        setIsRegisterConfirmModalOpen={() => {}}
        setSelectedArea={() => {}}
        selectedArea="전체"
      />,
    );

    expect(screen.getAllByRole('button', { name: '분실물 추가' })).toHaveLength(1);

    const btn = screen.getByRole('button', { name: '분실물 추가' });
    expect(btn).toBeEnabled();
  });
});

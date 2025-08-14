import { useState } from 'react';
import LostList from './lostList';
import Map from './map';
import RegisterModal from '../../register/RegisterModal';
import type { Category } from '../../../types/main/category';
import type { LostItem } from './lostListItem';

type Props = {
  selectedCategory: Category;
  items: LostItem[];
  selectedLat: number | null;
  setSelectedLat: (lat: number | null) => void;
  selectedLng: number | null;
  setSelectedLng: (lng: number | null) => void;
  setIsRegisterConfirmModalOpen: (isOpen: boolean) => void;
  setSelectedArea: (area: string) => void;
  selectedArea: string;
};

const Main = ({
  selectedCategory,
  items,
  selectedLat,
  setSelectedLat,
  selectedLng,
  setSelectedLng,
  setIsRegisterConfirmModalOpen,
  setSelectedArea,
  selectedArea,
}: Props) => {
  const canSubmit = selectedLat != null && selectedLng != null;

  // 등록 모달의 open, close를 관리하는 상태
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <main className="min-h-0 flex-1">
      <div className="grid h-full min-h-0 grid-cols-[360px_1fr]">
        <aside className="h-full overflow-y-auto border-r">
          <LostList items={items} selectedCategory={selectedCategory} selectedArea={selectedArea} />
        </aside>
        <section className="relative h-full min-h-0">
          <Map
            setSelectedLat={setSelectedLat}
            setSelectedLng={setSelectedLng}
            setSelectedArea={setSelectedArea}
            selectedArea={selectedArea}
          />
          <button
            disabled={!canSubmit}
            className="absolute right-5 bottom-5 z-10 rounded-full bg-teal-600 px-4 py-3 text-sm text-white shadow-lg hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            onClick={() => {
              setIsRegisterModalOpen(true);
            }}
          >
            분실물 추가
          </button>
        </section>
      </div>

      {/* isRegisterModalOpen 상태에 따라 RegisterModal을 조건부 렌더링 */}
      {isRegisterModalOpen && <RegisterModal onClose={() => setIsRegisterModalOpen(false)} />}
    </main>
  );
};

export default Main;

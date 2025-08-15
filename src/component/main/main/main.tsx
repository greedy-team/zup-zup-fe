import { useState } from 'react';
import LostList from './lostList';
import Map from './map';
import FindLostItemModal from '../../find/FindModal';
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

  // --- 분실물 찾기 모달 상태 관리 ---
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);
  const [selectedItemForFind, setSelectedItemForFind] = useState<LostItem | null>(null);

  // ListItem에서 호출할 핸들러
  const handleOpenFindModal = (item: LostItem) => {
    setSelectedItemForFind(item);
    setIsFindModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseFindModal = () => {
    setIsFindModalOpen(false);
    setSelectedItemForFind(null);
  };

  return (
    <main className="min-h-0 flex-1">
      <div className="grid h-full min-h-0 grid-cols-[360px_1fr]">
        <aside className="h-full overflow-y-auto border-r">
          <LostList
            items={items}
            selectedCategory={selectedCategory}
            selectedArea={selectedArea}
            onFindClick={handleOpenFindModal}
          />
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
            className="absolute right-5 bottom-5 z-10 rounded-full bg-teal-700 px-4 py-3 text-sm text-white shadow-lg hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            onClick={() => {
              setIsRegisterConfirmModalOpen(true);
            }}
          >
            분실물 추가
          </button>
        </section>

        {/* 모달 렌더링 */}
        {isFindModalOpen && selectedItemForFind && (
          <FindLostItemModal item={selectedItemForFind} onClose={handleCloseFindModal} />
        )}
      </div>
    </main>
  );
};

export default Main;

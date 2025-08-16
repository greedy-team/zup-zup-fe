import { useState, useEffect } from 'react';
import LostList from './lostList';
import Map from './map';
import RegisterModal from '../../register/RegisterModal';
import type { Category } from '../../../types/main/category';
import type { LostItem } from './lostListItem';
import FindModal from '../../find/FindModal';
import { fetchSchoolAreas } from '../../../api/register';
import type { SchoolArea } from '../../../types/register';

type Props = {
  selectedCategory: Category;
  items: LostItem[];
  selectedLat: number | null;
  setSelectedLat: (lat: number | null) => void;
  selectedLng: number | null;
  setSelectedLng: (lng: number | null) => void;
};

const Main = ({
  selectedCategory,
  items,
  selectedLat,
  setSelectedLat,
  selectedLng,
  setSelectedLng,
}: Props) => {
  const canSubmit = selectedLat != null && selectedLng != null;

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [schoolAreas, setSchoolAreas] = useState<SchoolArea[]>([]);

  const [isFindModalOpen, setIsFindModalOpen] = useState(false);
  const [selectedItemForFind, setSelectedItemForFind] = useState<LostItem | null>(null);

  useEffect(() => {
    fetchSchoolAreas().then(setSchoolAreas).catch(console.error);
  }, []);

  const handleOpenFindModal = (item: LostItem) => {
    setSelectedItemForFind(item);
    setIsFindModalOpen(true);
  };

  const handleCloseFindModal = () => {
    setIsFindModalOpen(false);
    setSelectedItemForFind(null);
  };

  const selectedArea = schoolAreas.find((area) => area.id === selectedAreaId)?.areaName || '전체';

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
            setSelectedAreaId={setSelectedAreaId}
            selectedAreaId={selectedAreaId}
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

        {isFindModalOpen && selectedItemForFind && (
          <FindModal item={selectedItemForFind} onClose={handleCloseFindModal} />
        )}

        {isRegisterModalOpen && (
          <RegisterModal
            onClose={() => setIsRegisterModalOpen(false)}
            schoolAreaId={selectedAreaId}
          />
        )}
      </div>
    </main>
  );
};

export default Main;

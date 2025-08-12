import List from './lostList';
import Map from './map';
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

  return (
    <main className="flex-1 min-h-0">
      <div className="h-full min-h-0 grid grid-cols-[360px_1fr]">
        <aside className="h-full overflow-y-auto border-r">
          <List items={items} selectedCategory={selectedCategory} area={selectedArea} />
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
            className="absolute right-5 bottom-5 z-10 rounded-full shadow-lg px-4 py-3 bg-emerald-600 text-white text-sm hover:bg-emerald-700  disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            onClick={() => {
              setIsRegisterConfirmModalOpen(true);
            }}
          >
            분실물 추가
          </button>
        </section>
      </div>
    </main>
  );
};

export default Main;

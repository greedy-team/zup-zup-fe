import { useEffect, useState } from 'react';
import Header from '../component/main/header/header';
import Main from '../component/main/main/main';
import RegisterConfirmModal from '../component/main/modal/registerConfirmModal';
import {
  getCategories,
  getLostItemDetail,
  getLostItemSummary,
  getSchoolAreas,
} from '../apis/main/mainApi';
import type { SchoolArea } from '../types/map/map';
import type { Category, LostItemListItem, LostItemSummaryRow } from '../types/lost/lostApi';

const MainPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<LostItemListItem[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [selectedAreaId, setSelectedAreaId] = useState<number>(0);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [schoolAreas, setSchoolAreas] = useState<SchoolArea[]>([]);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const [selectedMode, setSelectedMode] = useState<'register' | 'append'>('append');
  const [lostItemSummary, setLostItemSummary] = useState<LostItemSummaryRow[]>([]);
  const [isRegisterConfirmModalOpen, setIsRegisterConfirmModalOpen] = useState(false);

  const toggleMode = () => {
    setSelectedMode(selectedMode === 'register' ? 'append' : 'register');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSchoolAreas = async () => {
      const data = await getSchoolAreas();
      const schoolAreasData = data.schoolAreas;
      setSchoolAreas(schoolAreasData);
    };
    fetchSchoolAreas();
  }, []);

  useEffect(() => {
    (async () => {
      const { items, total } = await getLostItemDetail(page, 5, selectedCategoryId, selectedAreaId);
      setItems(items);
      setTotalCount(total);
    })();
  }, [page, selectedCategoryId, selectedAreaId]);

  useEffect(() => {
    const fetchLostItemSummary = async () => {
      const data = await getLostItemSummary(selectedAreaId);
      setLostItemSummary(data);
    };
    fetchLostItemSummary();
  }, [selectedAreaId]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId, selectedAreaId]);

  useEffect(() => {
    setSelectedAreaId(0);
  }, [selectedMode]);

  return (
    <>
      <div className="flex h-screen flex-col">
        <Header
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
        <Main
          pagination={{ page, setPage, totalCount: totalCount }}
          mapSelection={{
            selectedAreaId,
            setSelectedAreaId,
            selectedCoordinates,
            setSelectedCoordinates,
          }}
          mode={{ selectedMode, toggleMode }}
          lists={{ items, categories }}
          areas={{ schoolAreas, lostItemSummary }}
          ui={{ setIsRegisterConfirmModalOpen }}
        />
      </div>

      <RegisterConfirmModal
        isOpen={isRegisterConfirmModalOpen}
        onConfirm={() => {
          setIsRegisterConfirmModalOpen(false);
        }}
        onCancel={() => setIsRegisterConfirmModalOpen(false)}
      />
    </>
  );
};

export default MainPage;

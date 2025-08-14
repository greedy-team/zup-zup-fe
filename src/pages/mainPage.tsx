import { useEffect, useState } from 'react';
import Header from '../component/main/header/header';
import Main from '../component/main/main/main';
import RegisterConfirmModal from '../component/main/modal/registerConfirmModal';
import type { Category } from '../types/main/category';
import {
  getCategories,
  getLostItemDetail,
  getLostItemSummary,
  getSchoolAreas,
} from '../apis/main/categoriesApi';
import type { LostItemListItem } from '../types/main/lostItemListItem';
import type { SchoolArea } from '../types/map/map';
import type { LostItemSummaryRow } from '../types/main/lostItemSummeryRow';
import type { SelectedMode } from '../types/main/mode';

const MainPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<LostItemListItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);
  const [isRegisterConfirmModalOpen, setIsRegisterConfirmModalOpen] = useState(false);
  const [schoolAreas, setSchoolAreas] = useState<SchoolArea[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [selectedMode, setSelectedMode] = useState<SelectedMode>('append');
  const pageSize = 5;
  const [lostItemSummary, setLostItemSummary] = useState<LostItemSummaryRow[]>([]);

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
      setSchoolAreas(data.schoolAreas);
    };
    fetchSchoolAreas();
  }, []);

  useEffect(() => {
    (async () => {
      const { items, total } = await getLostItemDetail(
        page,
        pageSize,
        selectedCategoryId,
        selectedAreaId,
      );
      setItems(items);
      setTotal(total);
    })();
    console.log('total', total);
  }, [page, pageSize, selectedCategoryId, selectedAreaId]);

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

  return (
    <>
      <div className="flex h-screen flex-col">
        <Header
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
        <Main
          items={items}
          selectedLat={selectedLat}
          setSelectedLat={setSelectedLat}
          selectedLng={selectedLng}
          total={total}
          setSelectedLng={setSelectedLng}
          setIsRegisterConfirmModalOpen={setIsRegisterConfirmModalOpen}
          setSelectedAreaId={setSelectedAreaId}
          schoolAreas={schoolAreas}
          selectedAreaId={selectedAreaId}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          lostItemSummary={lostItemSummary}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          toggleMode={toggleMode}
        />
      </div>

      <RegisterConfirmModal
        isOpen={isRegisterConfirmModalOpen}
        onConfirm={() => {
          setIsRegisterConfirmModalOpen(false);
        }}
        onCancel={() => {
          setIsRegisterConfirmModalOpen(false);
        }}
      />
    </>
  );
};

export default MainPage;

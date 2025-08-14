import { useEffect, useState } from 'react';
import Header from '../component/main/header/header';
import Main from '../component/main/main/main';
import RegisterConfirmModal from '../component/main/modal/registerConfirmModal';
import type { Category } from '../types/main/category';
import { getCategories, getLostItemDetail, getSchoolAreas } from '../apis/main/categoriesApi';
import type { LostItemListItem } from '../types/main/lostItemListItem';
import type { SchoolArea } from '../types/map/map';

const MainPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<LostItemListItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);
  const [isRegisterConfirmModalOpen, setIsRegisterConfirmModalOpen] = useState(false);
  const [schoolAreas, setSchoolAreas] = useState<SchoolArea[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number>(0);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const { items } = await getLostItemDetail(1, 20, selectedCategoryId, selectedAreaId);
      setItems(items);
    };
    fetchItems();
    console.log('selectedCategoryId', selectedCategoryId);
    console.log('selectedAreaId', selectedAreaId);
  }, [selectedCategoryId, selectedAreaId]);

  useEffect(() => {
    const fetchSchoolAreas = async () => {
      const data = await getSchoolAreas();
      setSchoolAreas(data.schoolAreas);
    };
    fetchSchoolAreas();
  }, []);

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
          setSelectedLng={setSelectedLng}
          setIsRegisterConfirmModalOpen={setIsRegisterConfirmModalOpen}
          setSelectedAreaId={setSelectedAreaId}
          schoolAreas={schoolAreas}
          selectedAreaId={selectedAreaId}
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

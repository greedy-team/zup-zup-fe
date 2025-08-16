import { useState } from 'react';
import Header from '../component/main/header/header';
import Main from '../component/main/main/main';
import type { LostItem } from '../component/main/main/lostListItem';
import RegisterConfirmModal from '../component/main/modal/registerConfirmModal';
import type { Category } from '../types/main/category';

const CATEGORIES: Category[] = [
  '전체',
  '지갑',
  '가방',
  '휴대폰',
  '카드',
  '악세서리',
  '신분증/기숙사 카드',
  '기타',
];

const MOCK: LostItem[] = [
  {
    status: 'registered',
    lostItemId: 123,
    categoryId: 'wallet',
    categoryName: '지갑',
    foundLocation: '광개토관 3층',
    foundDate: '2025-08-08T09:00:00Z',
    imageUrl: 'https://cdn.example.com/images/lost-items/123.jpg',
  },
  {
    status: 'found',
    lostItemId: 124,
    categoryId: 'bag',
    categoryName: '가방',
    foundLocation: '학술정보원 3층',
    foundDate: '2025-08-07T09:00:00Z',
    imageUrl: 'https://cdn.example.com/images/lost-items/124.jpg',
  },
];

const MainPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('전체');
  const items: LostItem[] = MOCK;
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);
  const [isRegisterConfirmModalOpen, setIsRegisterConfirmModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>('');
  return (
    <>
      <div className="flex h-screen flex-col">
        <Header
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onChangeCategory={setSelectedCategory}
        />
        <Main
          selectedCategory={selectedCategory}
          items={items}
          selectedLat={selectedLat}
          setSelectedLat={setSelectedLat}
          selectedLng={selectedLng}
          setSelectedLng={setSelectedLng}
          setIsRegisterConfirmModalOpen={setIsRegisterConfirmModalOpen}
          setSelectedArea={setSelectedArea}
          selectedArea={selectedArea}
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

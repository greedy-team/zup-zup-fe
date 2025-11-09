import { useState } from 'react';
import type { PendingLostItemsResponse } from '../../types/admin';
import ImageLightbox from '../../component/common/ImageLightbox';
import AdminPageHeader from '../../component/admin/AdminPageHeader';
import PendingLostItemsActionBar from '../../component/admin/PendingLostItemsActionBar';
import PendingLostItemList from '../../component/admin/PendingLostItemList';
import PendingLostItemListPagination from '../../component/admin/PendingLostItemListPagination';

const BASE_LOST_ITEM = {
  id: 1,
  categoryId: 1,
  categoryName: '전자기기',
  schoolAreaId: 1,
  schoolAreaName: '대양 AI 센터',
  foundAreaDetail: '3층 복도 자판기 앞',
  createdAt: '2025-11-01T09:10:00',
  description: '삼성 블랙 무선 이어폰 케이스',
  depositArea: '학생지원팀 분실물 센터',
  imageUrl: [
    'https://i.pinimg.com/1200x/16/80/4c/16804c6f255c9c4243a07a2242d8323a.jpg',
    'https://i.pinimg.com/1200x/16/80/4c/16804c6f255c9c4243a07a2242d8323a.jpg',
    'https://i.pinimg.com/1200x/16/80/4c/16804c6f255c9c4243a07a2242d8323a.jpg',
  ],
  featureOptions: [
    {
      id: 1,
      optionValue: '삼성',
      quizQuestion: '어떤 브랜드의 제품인가요?',
    },
    {
      id: 2,
      optionValue: '블랙',
      quizQuestion: '제품의 색상은 무엇인가요?',
    },
  ],
};

const MOCK_LOST_ITEMS_RESPONSE: PendingLostItemsResponse = {
  count: 12,
  items: Array.from({ length: 12 }, (_, idx) => ({
    ...BASE_LOST_ITEM,
    id: idx + 1,
  })),
  pageInfo: {
    page: 1,
    size: 20,
    totalElements: 12,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  },
};

export default function AdminPendingLostItemsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const data: PendingLostItemsResponse = MOCK_LOST_ITEMS_RESPONSE;
  const { count, items, pageInfo } = data;

  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);

  const openImageLightbox = (urls: string[]) => {
    setLightboxImages(urls);
    setIsImageLightboxOpen(true);
  };

  const closeImageLightbox = () => {
    setIsImageLightboxOpen(false);
    setLightboxImages([]);
  };

  const currentPageLostItemIds = items.map((item) => item.id);

  const handlePrevPage = () => {
    if (!pageInfo.hasPrev) return;
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    if (!pageInfo.hasNext) return;
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen flex-col p-4 sm:p-6">
      <AdminPageHeader totalCount={count} />

      <PendingLostItemsActionBar currentPageLostItemIds={currentPageLostItemIds} />

      {/* 💡 여기 min-h-0 추가 */}
      <div className="mt-3 flex min-h-0 flex-1 flex-col rounded-lg border border-gray-200 bg-white p-3">
        <PendingLostItemList pendingLostItems={items} onImageClick={openImageLightbox} />

        <PendingLostItemListPagination
          pageInfo={pageInfo}
          onPrevButtonClick={handlePrevPage}
          onNextButtonClick={handleNextPage}
        />
      </div>

      <ImageLightbox
        open={isImageLightboxOpen}
        images={lightboxImages}
        onClose={closeImageLightbox}
      />
    </div>
  );
}

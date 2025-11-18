import { useState } from 'react';
import ImageLightbox from '../../component/common/ImageLightbox';
import AdminPageHeader from '../../component/admin/AdminPageHeader';
import PendingLostItemsActionBar from '../../component/admin/PendingLostItemsActionBar';
import PendingLostItemList from '../../component/admin/PendingLostItemList';
import PendingLostItemListPagination from '../../component/admin/PendingLostItemListPagination';
import { usePendingLostItems } from '../../api/admin/hooks/useAdminLostItems';

export default function AdminPendingLostItemsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = usePendingLostItems(currentPage);

  const count = data?.count ?? 0;
  const items = data?.items ?? [];
  const pageInfo = data?.pageInfo ?? {
    page: currentPage,
    size: 20,
    totalElements: count,
    totalPages: 1,
    hasPrev: currentPage > 1,
    hasNext: false,
  };

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-500">
        분실물 목록을 불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-red-500">
        {error.status} : {error.detail}
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col p-4 sm:p-6">
      <AdminPageHeader totalCount={count} />

      <PendingLostItemsActionBar currentPageLostItemIds={currentPageLostItemIds} />

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

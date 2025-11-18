import type { PageInfo } from '../../types/admin';

type PendingLostItemListPaginationProps = {
  pageInfo: PageInfo;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

const PendingLostItemListPagination = ({
  pageInfo,
  onPrevButtonClick,
  onNextButtonClick,
}: PendingLostItemListPaginationProps) => {
  return (
    <div className="mt-2 flex flex-col items-center justify-between gap-2 text-sm sm:flex-row sm:justify-end">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevButtonClick}
          disabled={!pageInfo.hasPrev}
          className={`rounded border px-3 py-1 transition-colors ${
            pageInfo.hasPrev
              ? 'border-gray-300 bg-white hover:bg-gray-50'
              : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
          }`}
        >
          이전
        </button>
        <span>
          {pageInfo.page} / {pageInfo.totalPages}
        </span>
        <button
          type="button"
          onClick={onNextButtonClick}
          disabled={!pageInfo.hasNext}
          className={`rounded border px-3 py-1 transition-colors ${
            pageInfo.hasNext
              ? 'border-gray-300 bg-white hover:bg-gray-50'
              : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default PendingLostItemListPagination;

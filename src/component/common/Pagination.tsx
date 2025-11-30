import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
};

const MAX_VISIBLE_PAGES = 3;

export const Pagination = ({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (!hasPrev) return;
    onPageChange(page - 1);
  };

  const handleNext = () => {
    if (!hasNext) return;
    onPageChange(page + 1);
  };

  let firstPage = 1;
  let lastPage = totalPages;

  if (totalPages > MAX_VISIBLE_PAGES) {
    firstPage = Math.max(1, page - 2);
    lastPage = firstPage + MAX_VISIBLE_PAGES - 1;

    if (lastPage > totalPages) {
      lastPage = totalPages;
      firstPage = lastPage - MAX_VISIBLE_PAGES + 1;
    }
  }

  const pageCount = lastPage - firstPage + 1;

  const visiblePages = Array.from({ length: pageCount }, (_, index) => firstPage + index);

  return (
    <nav className="flex items-center justify-center gap-4 py-3 text-sm text-slate-700">
      <button
        type="button"
        onClick={handlePrev}
        disabled={!hasPrev}
        aria-label="이전 페이지"
        className="flex items-center justify-center rounded-full p-2 text-xs text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="flex items-center gap-2">
        {visiblePages.map((pageNumber) => {
          const isActive = pageNumber === page;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isActive ? 'page' : undefined}
              className={
                isActive
                  ? 'rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-900'
                  : 'rounded-lg px-3 py-1 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900'
              }
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={!hasNext}
        aria-label="다음 페이지"
        className="flex items-center justify-center rounded-full p-2 text-xs text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
};

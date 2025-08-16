import type { PaginationProps } from '../../../../types/main/components';

const Pagenation = ({ page, totalCount, setPage }: PaginationProps) => {
  return (
    <div className="fixed bottom-0 flex justify-center gap-2 rounded-full bg-white/90 px-4 py-2 backdrop-blur">
      <button
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        이전
      </button>
      <span className="flex items-center justify-center">
        {page} / {Math.max(1, Math.ceil(totalCount / 5))}
      </span>
      <button
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50"
        disabled={page >= Math.max(1, Math.ceil(totalCount / 5))}
        onClick={() => setPage(page + 1)}
      >
        다음
      </button>
    </div>
  );
};

export default Pagenation;

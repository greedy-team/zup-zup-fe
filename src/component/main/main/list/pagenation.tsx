import type { PaginationState } from '../../../../types/main/main';

const Pagenation = ({ page, total, setPage, pageSize }: PaginationState) => {
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
        {page} / {Math.max(1, Math.ceil(total / pageSize))}
      </span>
      <button
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50"
        disabled={page >= Math.max(1, Math.ceil(total / pageSize))}
        onClick={() => setPage(page + 1)}
      >
        다음
      </button>
    </div>
  );
};

export default Pagenation;

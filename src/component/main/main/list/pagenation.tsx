type Props = {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
};

const Pagenation = ({ page, totalPages, setPage }: Props) => {
  return (
    <div className="flex items-center justify-center gap-2 rounded-full bg-white/90 px-4 py-2 backdrop-blur">
      <button
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        이전
      </button>
      <span className="text-sm">
        {page} / {totalPages}
      </span>
      <button
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50"
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
      >
        다음
      </button>
    </div>
  );
};

export default Pagenation;

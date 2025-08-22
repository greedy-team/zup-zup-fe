import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TotalCountContext } from '../../../../contexts/AppContexts';

const Pagenation = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { totalCount } = useContext(TotalCountContext)!;

  const page = Number(searchParams.get('page')) || 1;

  // 페이지 이동 설정 핸들러
  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next, { replace: true });
  };
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

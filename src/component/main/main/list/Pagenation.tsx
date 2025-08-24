import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TotalCountContext } from '../../../../contexts/AppContexts';
import { getTotalPages, isValidPage } from '../../../../utils/Page/pagenationUtils';
const Pagenation = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { totalCount } = useContext(TotalCountContext)!;

  const rawPage = searchParams.get('page');
  const page = isValidPage(rawPage, getTotalPages(totalCount)) ? Number(rawPage) : 1;

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
        {page} / {getTotalPages(totalCount)}
      </span>
      <button
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50"
        disabled={page >= getTotalPages(totalCount)}
        onClick={() => setPage(page + 1)}
      >
        다음
      </button>
    </div>
  );
};

export default Pagenation;

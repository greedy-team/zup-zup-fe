import { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TotalCountContext } from '../../../../contexts/AppContexts';
import { getTotalPages, isValidPage } from '../../../../utils/Page/pagenationUtils';
const Pagenation = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { totalCount } = useContext(TotalCountContext)!;

  const totalPages = getTotalPages(totalCount);
  const rawPage = searchParams.get('page');

  useEffect(() => {
    if (!isValidPage(rawPage, totalPages)) {
      const next = new URLSearchParams(searchParams);
      next.set('page', '1');
      setSearchParams(next, { replace: true });
    }
  }, [rawPage, totalPages]);

  const page = isValidPage(rawPage, totalPages) ? Number(rawPage) : 1;

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next, { replace: true });
  };

  //화살표를 이용해 페이지 이동
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && page > 1) {
        setPage(page - 1);
      }
      if (e.key === 'ArrowRight' && page < totalPages) {
        setPage(page + 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [page, totalPages, setPage]);

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center justify-center gap-2 bg-white px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:left-[190px] md:w-[calc(380px-2rem)] md:max-w-[calc(380px-2rem)]">
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

import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Inbox } from 'lucide-react';
import { MyPageHeader } from '../../component/mypage/MyPageHeader';
import { PledgedLostItemCard } from '../../component/mypage/PledgedLostItemCard';
import {
  usePledgedLostItems,
  useCancelPledgeMutation,
  useCompleteFoundMutation,
} from '../../api/mypage/hooks/useMypageLostItems';
import { Pagination } from '../../component/common/Pagination';
import { getPageFromSearchParams } from '../../utils/Page/getPageFromSearchParams';
import { useRedirectToLoginKeepPath } from '../../utils/auth/loginRedirect';

const DEFAULT_PAGE = 1;

export const MyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const redirectToLoginKeepPath = useRedirectToLoginKeepPath();

  const currentPage = getPageFromSearchParams(searchParams, DEFAULT_PAGE);

  const { data, isLoading, isError, isFetching, error } = usePledgedLostItems(currentPage);
  const cancelPledgeMutation = useCancelPledgeMutation();
  const completeFoundMutation = useCompleteFoundMutation();

  const items = data?.items ?? [];

  const hasItems = items.length > 0;
  const isEmpty = !isLoading && !isError && data && items.length === 0;

  useEffect(() => {
    const scrollContainer = document.getElementById('scroll-root');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  useEffect(() => {
    if (!isError || !error || error.status !== 401) return;

    toast.error(error.detail);
    redirectToLoginKeepPath();
  }, [isError, error, redirectToLoginKeepPath]);

  const handlePageChange = (targetPage: number) => {
    if (isFetching || targetPage === currentPage) return;

    const updatedParams = new URLSearchParams(searchParams);

    if (targetPage === DEFAULT_PAGE) {
      updatedParams.delete('page');
    } else {
      updatedParams.set('page', String(targetPage));
    }

    setSearchParams(updatedParams);
  };

  return (
    <div className="flex w-full justify-center bg-gray-50">
      <div className="flex min-h-full w-full max-w-[1104px] flex-col gap-6 px-4 py-8">
        <MyPageHeader totalFoundCount={data?.pageInfo?.totalElements ?? 0} />

        {isLoading && !data && (
          <div className="rounded-2xl bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
            서약한 분실물을 불러오는 중입니다...
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-2xl bg-white px-6 py-10 text-center text-sm text-red-500 shadow-sm">
            <p className="font-medium">서약한 분실물을 불러오는 중 오류가 발생했습니다.</p>
            {error?.detail && <p className="mt-2 text-xs text-red-400">{error.detail}</p>}
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Inbox className="h-6 w-6 text-slate-400" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-slate-900">아직 서약한 분실물이 없습니다.</p>
            <Link
              to="/"
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-teal-500 px-4 py-2 text-xs font-medium text-white hover:bg-teal-600"
            >
              분실물 찾으러 가기
            </Link>
          </div>
        )}

        {!isError && hasItems && (
          <section className="space-y-4">
            {items.map((item) => (
              <PledgedLostItemCard
                key={item.id}
                item={item}
                onCancelPledge={() => cancelPledgeMutation.mutate(item.id)}
                onCompleteFound={() => completeFoundMutation.mutate(item.id)}
                isCancelLoading={
                  cancelPledgeMutation.isPending && cancelPledgeMutation.variables === item.id
                }
                isCompleteLoading={
                  completeFoundMutation.isPending && completeFoundMutation.variables === item.id
                }
              />
            ))}
          </section>
        )}

        {data?.pageInfo && !isError && hasItems && (
          <div className="mt-auto pt-6">
            <Pagination
              page={currentPage}
              totalPages={data.pageInfo.totalPages}
              hasPrev={data.pageInfo.hasPrev}
              hasNext={data.pageInfo.hasNext}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

import { useSearchParams } from 'react-router-dom';
import LostListItem from './LostListItem';
import Pagenation from './Pagenation';
import { useLostItemsQuery } from '../../../../api/main/hooks/useMain';
import { isValidId } from '../../../../utils/isValidId';

export default function LostList() {
  const [searchParams] = useSearchParams();
  const rawPage = searchParams.get('page');
  const rawCategoryId = searchParams.get('categoryId');
  const rawAreaId = searchParams.get('schoolAreaId');
  const page = isValidId(rawPage) ? Number(rawPage) : 1;
  const categoryId = isValidId(rawCategoryId) ? Number(rawCategoryId) : 0;
  const schoolAreaId = isValidId(rawAreaId) ? Number(rawAreaId) : 0;

  const { data } = useLostItemsQuery(page, categoryId, schoolAreaId);
  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  if (totalCount === 0) {
    return (
      <div className="px-4 py-6">
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-sm text-teal-700">
          현재 확인된 분실물이 존재하지 않습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 py-4 md:h-[100dvh] md:overflow-hidden">
      <div className="relative hidden md:block">
        <h2 className="mb-2 text-lg font-semibold text-teal-700">분실물 목록</h2>
        <div className="mb-3 text-base text-gray-500">총 {totalCount}개</div>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10rem)' }}
      >
        <ul className="m-0 list-none space-y-3 p-0">
          {items.map((item) => (
            <LostListItem key={item.lostItemId} item={item} />
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center bg-white">
        <Pagenation />
      </div>
    </div>
  );
}

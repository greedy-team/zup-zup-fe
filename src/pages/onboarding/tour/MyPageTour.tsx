import { MyPageHeader } from '../../../component/mypage/MyPageHeader';
import { PledgedLostItemCard } from '../../../component/mypage/PledgedLostItemCard';
import type { PledgedLostItem } from '../../../types/mypage';

const MOCK_ITEMS: PledgedLostItem[] = [
  {
    id: 1,
    categoryId: 1,
    categoryName: '핸드폰',
    schoolAreaId: 1,
    schoolAreaName: '대양홀',
    foundAreaDetail: '1층 로비',
    createdAt: '2026-03-01T10:30:00',
    representativeImageUrl: '',
    pledgedAt: '2026-03-04T14:20:00',
    depositArea: '학생회관 401호',
  },
  {
    id: 2,
    categoryId: 3,
    categoryName: '지갑',
    schoolAreaId: 3,
    schoolAreaName: '학생회관',
    foundAreaDetail: '2층 복도',
    createdAt: '2026-02-28T15:00:00',
    representativeImageUrl: '',
    pledgedAt: '2026-03-03T09:45:00',
    depositArea: '경상관 101호',
  },
];

export default function MyPageTour() {
  return (
    <div className="flex w-full justify-center bg-gray-50">
      <div className="flex min-h-full w-full max-w-[1104px] flex-col gap-6 px-4 py-8">
        <MyPageHeader totalFoundCount={MOCK_ITEMS.length} />

        <section className="space-y-4">
          {MOCK_ITEMS.map((item) => (
            <PledgedLostItemCard
              key={item.id}
              item={item}
              onCancelPledge={() => {}}
              onCompleteFound={() => {}}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

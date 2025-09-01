import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLostItemBrief } from '../../api/find';
import type { LostItemBrief } from '../../types/find';
import { useAuthFlag } from '../../contexts/AuthFlag';
import { redirectToLoginKeepPath } from '../../utils/auth/loginRedirect';
import { useFindOutlet } from './FindLayout';

export default function FindInfo() {
  const { setNextHandler } = useFindOutlet();
  const { setUnauthenticated } = useAuthFlag();
  const { lostItemId: idParam } = useParams<{ lostItemId: string }>();
  const lostItemId = Number(idParam);

  const [item, setItem] = useState<LostItemBrief | null>(null);
  const [loading, setLoading] = useState(true);

  // 다음 버튼: 검증 없이 통과
  useEffect(() => {
    setNextHandler(() => true);
    return () => setNextHandler(null);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const brief = await getLostItemBrief(lostItemId);
        setItem(brief ?? null);
      } catch (e: any) {
        if (e?.status === 401) {
          setUnauthenticated();
          redirectToLoginKeepPath();
          return;
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [lostItemId]);

  if (loading) return <div className="p-4 text-sm text-gray-500">불러오는 중…</div>;
  if (!item) return <div className="p-4 text-sm text-red-600">정보를 가져오지 못했습니다.</div>;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-gray-600">분실물 카테고리</label>
        <div className="mt-1 rounded-lg bg-gray-100 p-3 text-gray-800">{item.categoryName}</div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-600">발견 장소</label>
        <div className="mt-1 rounded-lg bg-gray-100 p-3 text-gray-800">
          {item.schoolAreaName} {item.foundAreaDetail ? `· ${item.foundAreaDetail}` : ''}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-600">등록 날짜</label>
        <div className="mt-1 rounded-lg bg-gray-100 p-3 text-gray-800">
          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLostItemBriefQuery } from '../../api/find/hooks/useFind';
import { useFindOutlet } from '../../hooks/find/useFindOutlet';
import { showApiErrorToast } from '../../api/common/apiErrorToast';

export default function FindInfo() {
  const navigate = useNavigate();
  const { setNextButtonValidator } = useFindOutlet();
  const { lostItemId: idParam } = useParams<{ lostItemId: string }>();
  const lostItemId = Number(idParam);

  const { data: item, isLoading, error } = useLostItemBriefQuery(lostItemId);

  useEffect(() => {
    setNextButtonValidator(() => true);
    return () => setNextButtonValidator(null);
  }, [setNextButtonValidator]);

  useEffect(() => {
    if (!error) return;

    showApiErrorToast(error);
    navigate('/', { replace: true });
  }, [error, navigate]);

  if (isLoading) return <div className="p-4 text-sm text-gray-500">불러오는 중…</div>;
  if (!item)
    return <div className="p-4 text-sm text-red-600">분실물 정보를 가져오지 못했습니다.</div>;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-gray-600">분실물 카테고리</label>
        <div className="mt-1 rounded-lg bg-gray-100 p-3 text-gray-800">{item.categoryName}</div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-600">발견 장소</label>
        <div className="mt-1 rounded-lg bg-gray-100 p-3 text-gray-800">
          {item.schoolAreaName} {item.foundAreaDetail ? ` - ${item.foundAreaDetail}` : ''}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-600">등록 날짜</label>
        <div className="mt-1 rounded-lg bg-gray-100 p-3 text-gray-800">
          {new Date(item.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDetailQuery } from '../../api/find/hooks/useFind';
import { useAuthActions } from '../../store/hooks/useAuth';
import { useRedirectToLoginKeepPath } from '../../utils/auth/loginRedirect';
import { useFindOutlet } from '../../hooks/find/useFindOutlet';
import { showApiErrorToast } from '../../api/common/apiErrorToast';

export default function FindDetail() {
  const navigate = useNavigate();
  const { setNextButtonValidator } = useFindOutlet();
  const { lostItemId: idParam } = useParams<{ lostItemId: string }>();
  const lostItemId = Number(idParam);
  const { setAuthenticated, setUnauthenticated } = useAuthActions();

  const { data, isLoading, error } = useDetailQuery(lostItemId);
  const [active, setActive] = useState(0);
  const redirectToLoginKeepPath = useRedirectToLoginKeepPath();

  useEffect(() => {
    setNextButtonValidator(() => true);
    return () => setNextButtonValidator(null);
  }, [setNextButtonValidator]);

  useEffect(() => {
    if (data) {
      setAuthenticated();
    }
  }, [data, setAuthenticated]);

  useEffect(() => {
    if (!error) return;

    showApiErrorToast(error);

    if (error.status === 401) {
      setUnauthenticated();
      redirectToLoginKeepPath();
    } else {
      navigate('/', { replace: true });
    }
  }, [error, navigate, setUnauthenticated, redirectToLoginKeepPath]);

  if (isLoading)
    return <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">불러오는 중…</div>;
  if (!data)
    return <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">데이터가 없습니다.</div>;

  const mainUrl = data.imageUrls?.[active];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-semibold text-gray-600">사진</label>
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100">
          {mainUrl ? (
            <img src={mainUrl} alt="분실물 사진" className="h-full w-full object-cover" />
          ) : (
            <span className="text-gray-400">이미지 없음</span>
          )}
        </div>
        {data.imageUrls?.length > 1 && (
          <div className="mt-3 flex justify-center gap-2">
            {data.imageUrls.map((u, i) => (
              <button
                key={u + i}
                onClick={() => setActive(i)}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border ${
                  active === i ? 'ring-2 ring-teal-500' : 'border-gray-200'
                }`}
                aria-label={`분실물 썸네일-${i}`}
              >
                <img src={u} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-semibold text-gray-600">상세 설명</label>
        <div className="flex-grow rounded-lg bg-gray-100 p-4">
          <p className="whitespace-pre-wrap text-gray-800">
            {data.description || '상세 정보가 없습니다.'}
          </p>
        </div>
      </div>
    </div>
  );
}

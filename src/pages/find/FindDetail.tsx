import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getDetail } from '../../api/find';
import type { DetailResponse } from '../../types/find';
import { useAuthFlag } from '../../contexts/AuthFlag';
import { redirectToLoginKeepPath } from '../../utils/auth/loginRedirect';
import { useFindOutlet } from '../../hooks/find/useFindOutlet';

export default function FindDetail() {
  const navigate = useNavigate();
  const { setBeforeNext } = useFindOutlet();
  const { isAuthenticated, setAuthenticated, setUnauthenticated } = useAuthFlag();
  const { lostItemId: idParam } = useParams<{ lostItemId: string }>();
  const lostItemId = Number(idParam);

  const [data, setData] = useState<DetailResponse | null>(null);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBeforeNext(() => true);
    return () => setBeforeNext(null);
  }, [setBeforeNext]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getDetail(lostItemId);
        setData(res ?? null);
        setAuthenticated();
      } catch (e: any) {
        if (isAuthenticated && e?.status === 401) {
          alert('로그인 토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
          setUnauthenticated();
          redirectToLoginKeepPath();
          return;
        }
        if (e?.status === 401) {
          alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
          setUnauthenticated();
          redirectToLoginKeepPath();
          return;
        } else if (e?.status === 403) {
          alert('해당 분실물에 대한 열람 권한이 없습니다.');
          navigate('/', { replace: true });
          return;
        } else if (e?.status === 404) {
          alert('해당 id의 분실물이 존재하지 않습니다.');
          navigate('/', { replace: true });
          return;
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
          navigate('/', { replace: true });
          return;
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [lostItemId, setAuthenticated, setUnauthenticated]);

  if (loading)
    return <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">불러오는 중…</div>;
  if (!data)
    return <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">데이터가 없습니다.</div>;

  const mainUrl = data.imageUrls?.[active];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* 이미지 영역 */}
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

      {/* 설명 영역 */}
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

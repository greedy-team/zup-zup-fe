import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getDepositArea } from '../../api/find';
import type { DepositAreaResponse } from '../../types/find';
import { useAuthFlag } from '../../contexts/AuthFlag';
import { redirectToLoginKeepPath } from '../../utils/auth/loginRedirect';

export default function FindDeposit() {
  const navigate = useNavigate();
  const { lostItemId: idParam } = useParams();
  const lostItemId = Number(idParam);
  const { isAuthenticated, setAuthenticated, setUnauthenticated } = useAuthFlag();

  const [data, setData] = useState<DepositAreaResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getDepositArea(lostItemId);
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
  }, [lostItemId, isAuthenticated, setAuthenticated, setUnauthenticated, navigate]);

  if (loading)
    return <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">불러오는 중…</div>;
  if (!data)
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        보관 장소를 불러오지 못했습니다.
      </div>
    );

  return (
    <div className="rounded-xl bg-teal-50 p-6 text-center">
      <p className="text-gray-700">해당 분실물은 아래 위치에 보관 중입니다.</p>
      <p className="mt-3 text-2xl font-extrabold break-words text-teal-700">{data.depositArea}</p>
      <p className="mt-2 text-sm text-gray-600">
        해당 분실물 정보는 2주 후 삭제되므로, 기간 내에 꼭 찾아가시기 바랍니다.
      </p>
    </div>
  );
}

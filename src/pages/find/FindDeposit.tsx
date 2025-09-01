import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDepositArea } from '../../api/find';
import type { DepositAreaResponse } from '../../types/find';
import { useAuthFlag } from '../../contexts/AuthFlag';
import { redirectToLoginKeepPath } from '../../utils/auth/loginRedirect';

export default function FindDeposit() {
  const { lostItemId: idParam } = useParams();
  const lostItemId = Number(idParam);
  const { setAuthenticated, setUnauthenticated } = useAuthFlag();

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
  if (!data)
    return <div className="p-4 text-sm text-red-600">보관 장소를 불러오지 못했습니다.</div>;

  return (
    <div className="rounded-xl bg-teal-50 p-6 text-center">
      <p className="text-gray-700">해당 분실물은 아래 위치에 보관 중입니다.</p>
      <p className="mt-3 text-2xl font-extrabold text-teal-700">{data.depositArea}</p>
      <p className="mt-2 text-sm text-gray-600">학생증 지참 후 안내에 따라 수령하세요.</p>
    </div>
  );
}

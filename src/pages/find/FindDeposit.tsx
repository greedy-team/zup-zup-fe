import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDepositAreaQuery } from '../../api/find/hooks/useFind';
import { useAuthActions } from '../../store/hooks/useAuth';
import { useRedirectToLoginKeepPath } from '../../utils/auth/loginRedirect';
import { showApiErrorToast } from '../../api/common/apiErrorToast';

export default function FindDeposit() {
  const navigate = useNavigate();
  const { lostItemId: idParam } = useParams();
  const lostItemId = Number(idParam);
  const { setAuthenticated, setUnauthenticated } = useAuthActions();
  const redirectToLoginKeepPath = useRedirectToLoginKeepPath();
  const { data, isLoading, error } = useDepositAreaQuery(lostItemId);

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

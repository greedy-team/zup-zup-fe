import { useRef, useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { getLostItemBrief } from '../../api/find';
import { FIND_STEPS } from '../../constants/find';
import ProgressBar from '../../component/common/ProgressBar';
import { useAuthFlag } from '../../contexts/AuthFlag';
import { redirectToLoginKeepPath } from '../../utils/auth/loginRedirect';

type OutletCtx = {
  setNextHandler: (fn: (() => Promise<boolean> | boolean) | null) => void;
};

export default function FindLayout() {
  const { lostItemId: idParam } = useParams<{ lostItemId: string }>();
  const lostItemId = Number(idParam);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticated, setUnauthenticated } = useAuthFlag();

  const [loading, setLoading] = useState(true);
  const [isValuable, setIsValuable] = useState(true);

  const subpath = location.pathname.split('/').slice(-1)[0];
  const flow = isValuable
    ? ['info', 'quiz', 'detail', 'pledge', 'deposit']
    : ['info', 'detail', 'pledge', 'deposit'];

  const steps = isValuable ? FIND_STEPS.VALUABLE : FIND_STEPS.NON_VALUABLE;
  const currentIndex = Math.max(0, flow.indexOf(subpath));
  const progressCurrent = currentIndex + 1;

  const TITLES: Record<string, string> = {
    info: '물건 정보',
    quiz: '인증 퀴즈',
    detail: '상세 정보',
    pledge: '약관 동의',
    deposit: '보관 장소',
  };
  const title = TITLES[subpath] ?? '분실물 찾기';

  useEffect(() => {
    if (!Number.isFinite(lostItemId)) {
      navigate('/', { replace: true });
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const brief = await getLostItemBrief(lostItemId);
        setIsValuable(brief?.categoryId !== 99);
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

  const onNextRef = useRef<(() => Promise<boolean> | boolean) | null>(null);
  const setNextHandler: OutletCtx['setNextHandler'] = (fn) => {
    onNextRef.current = fn;
  };

  const base = `/find/${lostItemId}`;
  const goNext = () => {
    const next = flow[currentIndex + 1];
    if (!next) {
      navigate('/', { replace: true });
    } else {
      navigate(`${base}/${next}`);
    }
  };

  const handleClickNext = async () => {
    if (!onNextRef.current) {
      goNext();
      return;
    }
    const ok = await onNextRef.current();
    if (ok !== false) goNext();
  };

  if (loading) {
    return <div className="mx-auto max-w-3xl p-6 text-sm text-gray-500">불러오는 중…</div>;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <ProgressBar steps={steps as unknown as string[]} currentStep={progressCurrent} />

      <div className="mt-6 min-h-[320px]">
        <Outlet context={{ setNextHandler }} />
      </div>

      <div className="mt-8">
        <button
          onClick={handleClickNext}
          className="w-full rounded-lg bg-teal-500 py-3 text-base font-bold text-white transition hover:bg-teal-600"
        >
          다음
        </button>
      </div>
    </main>
  );
}

// 자식에서 사용할 훅
export function useFindOutlet() {
  return useOutletContext<OutletCtx>();
}

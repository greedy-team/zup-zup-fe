import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthFlag, broadcastLogin } from '../../contexts/AuthFlag';
import { loginPortal, type LoginRequest } from '../../api/auth';
import LoginLogo from '../../../assets/loginLogo.png';

export default function LoginPage() {
  const { setAuthenticated, setUnauthenticated } = useAuthFlag();
  const location = useLocation();
  const navigate = useNavigate();

  const sp = new URLSearchParams(location.search);
  const rawRedirect = sp.get('redirect');
  const redirectPath = rawRedirect && rawRedirect.startsWith('/') ? rawRedirect : '/';

  const [portalId, setPortalId] = useState('');
  const [portalPassword, setPortalPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!portalId.trim() || !portalPassword) {
      setErrorMessage('아이디와 비밀번호를 입력하세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: LoginRequest = { portalId, portalPassword };
      await loginPortal(payload);
      setAuthenticated();
      broadcastLogin();
      navigate(redirectPath, { replace: true });
    } catch (e: any) {
      setUnauthenticated();
      if (e?.status === 401) setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
      else if (e?.status === 400) setErrorMessage('요청 형식이 올바르지 않습니다.');
      else setErrorMessage('로그인에 실패했습니다. 잠시 후 다시 시도하세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24">
      <section className="overflow-hidden rounded-2xl border shadow-md">
        <div className="grid md:grid-cols-2">
          <aside className="hidden min-h-[520px] items-start justify-start bg-teal-50 px-10 py-12 md:flex">
            <div className="mx-auto w-full max-w-md">
              <img
                src={LoginLogo}
                alt="로그인 로고"
                className="h-16 w-auto max-w-[220px] object-contain opacity-90"
              />
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight">로그인 안내</h2>
              <ol className="mt-6 list-decimal space-y-4 pl-6 text-base leading-relaxed text-gray-700">
                <li>로그인을 위해선 세종대학교 포털에서 개인정보수집 동의가 되어있어야 합니다.</li>
                <li>
                  로그인 시 대양휴머니티칼리지를 통해 학생 기본 정보를 불러옵니다. (학번, 이름)
                </li>
                <li>사용자의 포털 비밀번호는 절대 저장되지 않습니다.</li>
              </ol>
            </div>
          </aside>

          <section className="bg-white px-8 py-10 md:px-10 md:py-12">
            <div className="mx-auto w-full max-w-md">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold">로그인</h1>
                <button
                  type="button"
                  aria-label="로그인 안내 보기"
                  onClick={() => setIsInfoOpen(true)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700 shadow-sm hover:bg-teal-200 focus:ring-2 focus:ring-teal-400 focus:outline-none md:hidden"
                  title="안내"
                >
                  i
                </button>
              </div>

              <p className="mt-3 text-base text-gray-600">세종대학교 포털 계정으로 로그인하세요.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium">학번</label>
                  <input
                    className="mt-2 w-full rounded-lg border p-3 text-base focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={portalId}
                    onChange={(e) => setPortalId(e.target.value)}
                    inputMode="text"
                    autoComplete="username"
                    placeholder="예: 2001111"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">비밀번호</label>
                  <input
                    type="password"
                    className="mt-2 w-full rounded-lg border p-3 text-base focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={portalPassword}
                    onChange={(e) => setPortalPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="비밀번호"
                  />
                </div>

                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-teal-600 py-3 text-lg font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                >
                  {isSubmitting ? '로그인 중…' : '로그인'}
                </button>
              </form>
            </div>
          </section>
        </div>
      </section>

      {isInfoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsInfoOpen(false);
          }}
        >
          <div className="max-h-[88vh] w-full max-w-md overflow-auto rounded-2xl bg-white p-7 shadow-2xl md:max-w-lg md:p-8">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-extrabold tracking-tight md:text-2xl">로그인 안내</h3>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setIsInfoOpen(false)}
                className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                ×
              </button>
            </div>

            <ol className="mt-5 list-decimal space-y-4 pl-6 text-base leading-relaxed text-gray-700 md:text-lg">
              <li>로그인을 위해선 세종대학교 포털에서 개인정보수집 동의가 되어있어야 합니다.</li>
              <li>로그인 시 대양휴머니티칼리지를 통해 학생 기본 정보를 불러옵니다. (학번, 이름)</li>
              <li>사용자의 포털 비밀번호는 절대 저장되지 않습니다.</li>
            </ol>

            <button
              type="button"
              onClick={() => setIsInfoOpen(false)}
              className="mt-7 w-full rounded-lg bg-teal-600 py-3 text-base font-semibold text-white hover:bg-teal-700 md:text-lg"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

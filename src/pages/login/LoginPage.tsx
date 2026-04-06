import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../api/auth/hooks/useAuth';
import LoginLogo from '../../../assets/loginLogo.png';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const sp = new URLSearchParams(location.search);
  const rawRedirect = sp.get('redirect');
  const redirectPath = rawRedirect && rawRedirect.startsWith('/') ? rawRedirect : '/';

  const [portalId, setPortalId] = useState('');
  const [portalPassword, setPortalPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!portalId.trim() || !portalPassword) {
      setErrorMessage('아이디와 비밀번호를 입력하세요.');
      return;
    }

    loginMutation.mutate(
      { portalId, portalPassword },
      {
        onSuccess: () => {
          navigate(redirectPath, { replace: true });
        },
      },
    );
  };

  const infoItems = [
    '로그인을 위해선 세종대학교 포털에서 개인정보수집 동의가 되어있어야 합니다.',
    '로그인 시 대양휴머니티칼리지를 통해 세종대학교 구성원임을 인증합니다.',
    '사용자의 학번 외의 정보는 절대 저장되지 않습니다.',
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 pt-12 pb-12 md:pt-20">
      <section className="overflow-hidden rounded-2xl shadow-lg">
        <div className="grid md:grid-cols-2">
          {/* 데스크탑 전용 안내 패널 */}
          <aside className="hidden min-h-[480px] flex-col items-start justify-center bg-teal-50 px-10 py-12 md:flex">
            <div className="w-full max-w-sm">
              <img
                src={LoginLogo}
                alt="로그인 로고"
                className="h-12 w-auto max-w-[180px] object-contain opacity-90"
              />
              <h2 className="mt-6 text-xl font-bold tracking-tight text-gray-800">로그인 안내</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-gray-500">
                {infoItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>
          </aside>

          {/* 로그인 폼 */}
          <section className="bg-white px-8 py-10 md:px-10 md:py-12">
            <div className="mx-auto w-full max-w-sm">
              <h1 className="text-xl font-bold text-gray-900">로그인</h1>
              <p className="mt-1.5 text-sm text-gray-400">세종대학교 포털 계정으로 로그인하세요.</p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">학번</label>
                  <input
                    className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    value={portalId}
                    onChange={(e) => setPortalId(e.target.value)}
                    inputMode="text"
                    autoComplete="username"
                    placeholder="예: 230XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                  <input
                    type="password"
                    className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    value={portalPassword}
                    onChange={(e) => setPortalPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="비밀번호"
                  />
                </div>

                {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}

                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="mt-2 w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                >
                  {loginMutation.isPending ? '로그인 중…' : '로그인'}
                </button>
              </form>

              {/* 모바일 전용 안내 */}
              <div className="mt-6 md:hidden">
                <p className="mb-2 text-xs font-medium text-gray-400">로그인 안내</p>
                <ol className="list-decimal space-y-1.5 pl-4">
                  {infoItems.map((item, i) => (
                    <li key={i} className="text-xs leading-relaxed text-gray-400">
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

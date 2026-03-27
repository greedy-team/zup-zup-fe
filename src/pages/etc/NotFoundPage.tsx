import { SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm space-y-6 px-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
          <SearchX className="h-10 w-10 text-teal-600" />
        </div>

        <div className="space-y-2">
          <p className="text-5xl font-extrabold text-gray-900">404</p>
          <p className="text-xl font-semibold text-gray-800">페이지를 찾을 수 없어요</p>
          <p className="text-sm text-gray-500">
            주소를 다시 확인하거나
            <br />
            아래 버튼을 눌러 이동해 주세요.
          </p>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full rounded-lg bg-teal-600 py-3 text-base font-semibold text-white hover:bg-teal-700"
          >
            홈으로 가기
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full rounded-lg border border-slate-200 bg-white py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            이전 페이지
          </button>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SECTIONS } from '../../component/onboarding/onboardingSteps';
import { useOnboardingStore } from '../../store/onboardingStore';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const startTour = useOnboardingStore((s) => s.actions.startTour);

  const handleSectionClick = (idx: number) => {
    startTour(idx);
    const section = SECTIONS[idx];
    // 첫 스텝에 전용 투어 경로가 있으면 그쪽으로 이동 (section.route로 이동 시 auth 리다이렉트 등 발생 가능)
    navigate(section.steps[0].route ?? section.route);
  };

  return (
    <div className="flex min-h-full w-full items-start justify-center self-start bg-gray-50 px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-teal-600">세종 줍줍</h1>
          <p className="mt-1 text-sm text-slate-400">서비스 가이드</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            세종대학교 캠퍼스의 분실물을 지도에서 한눈에 확인하고 관리하는 서비스예요.
            <br />
            아래 항목을 선택하면 해당 기능을 직접 화면에서 안내해 드려요.
          </p>
        </div>

        {/* 섹션 카드 목록 */}
        <div className="flex flex-col gap-3">
          {SECTIONS.map((section, idx) => (
            <button
              key={section.id}
              type="button"
              onClick={() => handleSectionClick(idx)}
              className="flex w-full cursor-pointer items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm transition hover:shadow-md hover:ring-1 hover:ring-teal-200"
            >
              {/* 아이콘 */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-500">
                {section.icon}
              </div>

              {/* 텍스트 */}
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-semibold text-slate-800">{section.label}</p>
                <p className="mt-0.5 truncate text-xs text-slate-400">{section.summary}</p>
              </div>

              {/* 스텝 수 + 화살표 */}
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400">
                  {section.steps.length}단계
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

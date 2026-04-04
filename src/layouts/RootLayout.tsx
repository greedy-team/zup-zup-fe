import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import SpinnerIcon from '../component/common/Icons/SpinnerIcon';
import Sidebar from '../component/root/layout/Sidebar';
import OnboardingOverlay from '../component/onboarding/OnboardingOverlay';
import SectionTourOverlay from '../component/onboarding/SectionTourOverlay';
import { useOnboardingStore } from '../store/onboardingStore';

export default function RootLayout() {
  const isActive = useOnboardingStore((s) => s.isActive);
  const complete = useOnboardingStore((s) => s.actions.complete);
  const tourSectionId = useOnboardingStore((s) => s.tourSectionId);

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden md:flex-row">
      <main
        id="scroll-root"
        className="order-1 flex min-h-0 min-w-0 flex-1 overflow-auto md:order-2"
      >
        <Suspense
          fallback={
            <div className="flex flex-1 items-center justify-center">
              <SpinnerIcon />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <div className="order-2 w-full shrink-0 md:order-1 md:w-18">
        <Sidebar />
      </div>

      {/* 첫 방문 오버레이 */}
      {isActive && <OnboardingOverlay onComplete={complete} />}

      {/* /onboarding 허브에서 시작하는 섹션 투어 오버레이 */}
      {tourSectionId !== null && <SectionTourOverlay />}
    </div>
  );
}

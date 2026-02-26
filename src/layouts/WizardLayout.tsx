import type { ReactNode } from 'react';
import ProgressBar from '../component/common/ProgressBar';

type WizardLayoutProps = {
  title: string;
  steps: string[];
  currentStep: number;
  /** 하단 고정 버튼 영역 */
  footer: ReactNode;
  children: ReactNode;
  /** ProgressBar 위에 렌더링되는 오버레이 (예: ResultModal) */
  overlay?: ReactNode;
};

export default function WizardLayout({
  title,
  steps,
  currentStep,
  footer,
  children,
  overlay,
}: WizardLayoutProps) {
  return (
    <div className="flex h-full w-full items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {overlay}
      <div className="flex h-full w-full max-w-4xl flex-col bg-white p-5 md:my-4 md:h-[calc(100%-2rem)] md:rounded-2xl md:p-6 lg:p-8">
        <h1 className="shrink-0 text-center text-2xl font-normal text-gray-800 md:text-3xl">
          {title}
        </h1>

        <div className="mt-3 shrink-0">
          <ProgressBar steps={steps} currentStep={currentStep} />
        </div>

        <div className="mt-4 min-h-0 grow overflow-y-auto pr-2 pb-3 sm:pr-3 md:pb-4">
          {children}
        </div>

        <div className="mt-3 shrink-0 md:mt-5">{footer}</div>
      </div>
    </div>
  );
}

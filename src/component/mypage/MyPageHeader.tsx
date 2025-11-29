import { User } from 'lucide-react';

type MyPageHeaderProps = {
  totalFoundCount: number;
};

export const MyPageHeader = ({ totalFoundCount }: MyPageHeaderProps) => {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500">
          <User className="h-6 w-6 text-white" aria-hidden="true" />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">마이페이지</h2>
          <p className="text-xs text-slate-500 sm:text-sm">나의 분실물 관리</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-teal-50 px-4 py-3 text-sm text-slate-500 sm:w-auto sm:justify-center sm:px-6">
        <dl className="flex items-center">
          <dt className="text-xs whitespace-nowrap sm:text-sm">총 찾은 분실물</dt>

          <span className="mx-4 h-6 w-px bg-teal-200" aria-hidden="true" />

          <dd className="flex items-baseline">
            <span className="text-xl font-semibold text-teal-600 sm:text-2xl">
              {totalFoundCount}
            </span>
            <span className="ml-1 text-xs text-slate-500 sm:text-sm">개</span>
          </dd>
        </dl>
      </div>
    </section>
  );
};

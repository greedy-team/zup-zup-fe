import { Outlet } from 'react-router-dom';
import Sidebar from '../component/root/layout/Sidebar';

export default function RootLayout() {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden md:flex-row">
      {/* main이 먼저, 사이드바가 나중(모바일에서는 아래쪽) */}
      <main
        id="scroll-root"
        className="order-1 flex min-h-0 min-w-0 flex-1 overflow-auto md:order-2"
      >
        <Outlet />
      </main>

      {/* 모바일: 가로 전체 폭 + 상단 보더 / 데스크탑: 고정폭 + 우측 보더 */}
      <div className="order-2 w-full shrink-0 md:order-1 md:w-18">
        <Sidebar />
      </div>
    </div>
  );
}

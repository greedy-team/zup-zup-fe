import { Outlet } from 'react-router-dom';
import Sidebar from '../component/root/layout/Sidebar';

export default function RootLayout() {
  return (
    <div className="flex h-dvh min-h-dvh overflow-hidden">
      {/*!!!!모바일 버전에서는 Sidebar가 화면 아래로 오도록 정렬!!!!*/}
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

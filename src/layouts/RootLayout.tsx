import { Outlet } from 'react-router-dom';
import Header from '../component/root/layout/Header';

export default function RootLayout() {
  return (
    <div className="flex h-dvh min-h-dvh flex-col overflow-hidden">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}

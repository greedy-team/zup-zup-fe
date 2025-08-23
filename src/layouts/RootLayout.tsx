import { Outlet } from 'react-router-dom';
import Header from '../component/root/layout/Header';

export default function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

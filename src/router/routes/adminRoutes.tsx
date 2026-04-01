import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const AdminPage = lazy(() => import('../../pages/admin/AdminPage'));

export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: (
      <Suspense>
        <AdminPage />
      </Suspense>
    ),
  },
];

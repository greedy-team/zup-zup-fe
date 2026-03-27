import { RouteObject } from 'react-router-dom';
import AdminPage from '../../pages/admin/AdminPage';

export const adminRoutes: RouteObject[] = [
  { path: 'admin', element: <AdminPage /> },
];

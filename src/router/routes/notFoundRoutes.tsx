import { RouteObject } from 'react-router-dom';
import NotFoundPage from '../../pages/etc/NotFoundPage';

export const notFoundRoutes: RouteObject[] = [
  { path: '*', element: <NotFoundPage /> },
];

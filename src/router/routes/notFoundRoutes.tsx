import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const NotFoundPage = lazy(() => import('../../pages/etc/NotFoundPage'));

export const notFoundRoutes: RouteObject[] = [
  { path: '*', element: <NotFoundPage /> },
];

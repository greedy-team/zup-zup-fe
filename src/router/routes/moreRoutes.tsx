import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const MorePage = lazy(() => import('../../pages/etc/MorePage'));
const AboutTeamPage = lazy(() => import('../../pages/etc/AboutTeamPage').then((m) => ({ default: m.AboutTeamPage })));

export const moreRoutes: RouteObject[] = [
  {
    path: 'more',
    children: [
      { index: true, element: <MorePage /> },
      { path: 'team', element: <AboutTeamPage /> },
    ],
  },
];

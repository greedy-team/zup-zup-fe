import { RouteObject } from 'react-router-dom';
import MorePage from '../../pages/etc/MorePage';
import { AboutTeamPage } from '../../pages/etc/AboutTeamPage';

export const moreRoutes: RouteObject[] = [
  {
    path: 'more',
    children: [
      { index: true, element: <MorePage /> },
      { path: 'team', element: <AboutTeamPage /> },
    ],
  },
];

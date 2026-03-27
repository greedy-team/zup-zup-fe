import { RouteObject } from 'react-router-dom';
import { MyPage } from '../../pages/mypage/MyPage';
import MorePage from '../../pages/etc/MorePage';
import { AboutTeamPage } from '../../pages/etc/AboutTeamPage';

export const mypageRoutes: RouteObject[] = [
  { path: 'mypage', element: <MyPage /> },
  {
    path: 'more',
    children: [
      { index: true, element: <MorePage /> },
      { path: 'team', element: <AboutTeamPage /> },
    ],
  },
];

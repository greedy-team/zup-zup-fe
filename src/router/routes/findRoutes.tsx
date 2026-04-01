import { Navigate, RouteObject } from 'react-router-dom';
import FindLayout from '../../pages/find/FindLayout';
import FindInfo from '../../pages/find/FindInfo';
import FindQuiz from '../../pages/find/FindQuiz';
import FindDetail from '../../pages/find/FindDetail';
import FindPledge from '../../pages/find/FindPledge';
import FindDeposit from '../../pages/find/FindDeposit';

export const findRoutes: RouteObject[] = [
  {
    path: 'find/:lostItemId',
    element: <FindLayout />,
    children: [
      { index: true, element: <Navigate to="info" replace /> },
      { path: 'info', element: <FindInfo /> },
      { path: 'quiz', element: <FindQuiz /> },
      { path: 'detail', element: <FindDetail /> },
      { path: 'pledge', element: <FindPledge /> },
      { path: 'deposit', element: <FindDeposit /> },
    ],
  },
];

import { Navigate, RouteObject } from 'react-router-dom';
import RegisterLayout from '../../pages/register/RegisterLayout';
import RegisterCategory from '../../pages/register/RegisterCategory';
import RegisterDetails from '../../pages/register/RegisterDetails';
import RegisterReview from '../../pages/register/RegisterReview';

export const registerRoutes: RouteObject[] = [
  {
    path: 'register/:schoolAreaId',
    element: <RegisterLayout />,
    children: [
      { index: true, element: <Navigate to="category" replace /> },
      { path: 'category', element: <RegisterCategory /> },
      { path: 'details', element: <RegisterDetails /> },
      { path: 'review', element: <RegisterReview /> },
    ],
  },
];

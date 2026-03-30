import { RouteObject } from 'react-router-dom';
import LoginPage from '../../pages/login/LoginPage';

export const authRoutes: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
];

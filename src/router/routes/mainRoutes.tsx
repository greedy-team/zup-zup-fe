import { RouteObject } from 'react-router-dom';
import MainPage from '../../pages/main/MainPage';
import LoginPage from '../../pages/login/LoginPage';

export const mainRoutes: RouteObject[] = [
  { index: true, element: <MainPage /> },
  { path: 'login', element: <LoginPage /> },
];

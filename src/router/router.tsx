import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import NotFoundPage from '../pages/etc/NotFoundPage';
import { adminRoutes } from './routes/adminRoutes';
import { findRoutes } from './routes/findRoutes';
import { mainRoutes } from './routes/mainRoutes';
import { mypageRoutes } from './routes/mypageRoutes';
import { onboardingRoutes } from './routes/onboardingRoutes';
import { registerRoutes } from './routes/registerRoutes';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      ...mainRoutes,
      ...findRoutes,
      ...registerRoutes,
      ...mypageRoutes,
      ...onboardingRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  ...adminRoutes,
]);

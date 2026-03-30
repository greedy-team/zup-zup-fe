import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import { adminRoutes } from './routes/adminRoutes';
import { authRoutes } from './routes/authRoutes';
import { findRoutes } from './routes/findRoutes';
import { mainRoutes } from './routes/mainRoutes';
import { moreRoutes } from './routes/moreRoutes';
import { mypageRoutes } from './routes/mypageRoutes';
import { notFoundRoutes } from './routes/notFoundRoutes';
import { onboardingRoutes } from './routes/onboardingRoutes';
import { registerRoutes } from './routes/registerRoutes';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      ...mainRoutes,
      ...authRoutes,
      ...findRoutes,
      ...registerRoutes,
      ...mypageRoutes,
      ...moreRoutes,
      ...onboardingRoutes,
      ...notFoundRoutes,
    ],
  },
  ...adminRoutes,
]);

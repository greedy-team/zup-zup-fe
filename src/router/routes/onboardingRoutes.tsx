import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

const OnboardingPage = lazy(() => import('../../pages/onboarding/OnboardingPage'));
const FindTourLayout = lazy(() => import('../../pages/onboarding/tour/FindTourLayout'));
const FindTourInfo = lazy(() => import('../../pages/onboarding/tour/FindTourInfo'));
const FindTourQuiz = lazy(() => import('../../pages/onboarding/tour/FindTourQuiz'));
const FindTourDetail = lazy(() => import('../../pages/onboarding/tour/FindTourDetail'));
const FindTourPledge = lazy(() => import('../../pages/onboarding/tour/FindTourPledge'));
const FindTourDeposit = lazy(() => import('../../pages/onboarding/tour/FindTourDeposit'));
const RegisterTourLayout = lazy(() => import('../../pages/onboarding/tour/RegisterTourLayout'));
const RegisterTourCategory = lazy(() => import('../../pages/onboarding/tour/RegisterTourCategory'));
const RegisterTourDetails = lazy(() => import('../../pages/onboarding/tour/RegisterTourDetails'));
const RegisterTourReview = lazy(() => import('../../pages/onboarding/tour/RegisterTourReview'));
const MyPageTour = lazy(() => import('../../pages/onboarding/tour/MyPageTour'));

export const onboardingRoutes: RouteObject[] = [
  {
    path: 'onboarding',
    children: [
      { index: true, element: <OnboardingPage /> },
      {
        path: 'find-tour',
        element: <FindTourLayout />,
        children: [
          { index: true, element: <Navigate to="info" replace /> },
          { path: 'info', element: <FindTourInfo /> },
          { path: 'quiz', element: <FindTourQuiz /> },
          { path: 'detail', element: <FindTourDetail /> },
          { path: 'pledge', element: <FindTourPledge /> },
          { path: 'deposit', element: <FindTourDeposit /> },
        ],
      },
      {
        path: 'register-tour',
        element: <RegisterTourLayout />,
        children: [
          { index: true, element: <Navigate to="category" replace /> },
          { path: 'category', element: <RegisterTourCategory /> },
          { path: 'details', element: <RegisterTourDetails /> },
          { path: 'review', element: <RegisterTourReview /> },
        ],
      },
      { path: 'mypage-tour', element: <MyPageTour /> },
    ],
  },
];

import { Navigate, RouteObject } from 'react-router-dom';
import OnboardingPage from '../../pages/onboarding/OnboardingPage';
import FindTourLayout from '../../pages/onboarding/tour/FindTourLayout';
import FindTourInfo from '../../pages/onboarding/tour/FindTourInfo';
import FindTourQuiz from '../../pages/onboarding/tour/FindTourQuiz';
import FindTourDetail from '../../pages/onboarding/tour/FindTourDetail';
import FindTourPledge from '../../pages/onboarding/tour/FindTourPledge';
import FindTourDeposit from '../../pages/onboarding/tour/FindTourDeposit';
import RegisterTourLayout from '../../pages/onboarding/tour/RegisterTourLayout';
import RegisterTourCategory from '../../pages/onboarding/tour/RegisterTourCategory';
import RegisterTourDetails from '../../pages/onboarding/tour/RegisterTourDetails';
import RegisterTourReview from '../../pages/onboarding/tour/RegisterTourReview';
import MyPageTour from '../../pages/onboarding/tour/MyPageTour';

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

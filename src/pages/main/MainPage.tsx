import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Main from '../../component/main/main/Main';
import RegisterConfirmModal from '../../component/main/modal/RegisterConfirmModal';
import OnboardingOverlay from '../../component/onboarding/OnboardingOverlay';
import { useOnboarding } from '../../hooks/useOnboarding';

const MainPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isOpen: isOnboardingOpen, complete: completeOnboarding } = useOnboarding();

  // lostItemId가 존재하면 찾기 프로세스로 라우팅
  useEffect(() => {
    const lostItemId = searchParams.get('lostItemId');
    if (lostItemId) {
      navigate(`/find/${lostItemId}`);
    }
  }, [searchParams, navigate]);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <Main />
      </div>

      <RegisterConfirmModal />
      {isOnboardingOpen && <OnboardingOverlay onComplete={completeOnboarding} />}
    </>
  );
};

export default MainPage;

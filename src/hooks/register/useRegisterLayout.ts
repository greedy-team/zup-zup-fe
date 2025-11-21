import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRegisterProcess } from './useRegisterProcess';
import { REGISTER_PROCESS_STEPS } from '../../constants/register';
import { SelectedModeContext } from '../../contexts/AppContexts';

export const useRegisterLayout = () => {
  const { schoolAreaId } = useParams<{ schoolAreaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const registerProcess = useRegisterProcess(Number(schoolAreaId) || null);
  const { setSelectedMode } = useContext(SelectedModeContext)!;

  const steps = REGISTER_PROCESS_STEPS.INDEXS;

  const currentStep = (() => {
    if (location.pathname.includes('category')) return 1;
    if (location.pathname.includes('details')) return 2;
    if (location.pathname.includes('review')) return 3;
    return 1;
  })();

  const goToPrevStep = () => {
    if (currentStep === 1) {
      registerProcess.resetForm();
      setSelectedMode('register');
      navigate('/', { replace: true });
    }
    if (currentStep === 2) {
      registerProcess.resetForm();
      navigate('category');
    }
    if (currentStep === 3) {
      navigate({
        pathname: 'details',
        search: `?categoryId=${registerProcess.selectedCategory?.id}`,
      });
    }
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      if (!registerProcess.selectedCategory) {
        toast.error('카테고리를 선택해주세요.');
        return;
      }

      navigate(
        {
          pathname: 'details',
          search: `?categoryId=${registerProcess.selectedCategory.id}`,
        },
        { replace: true },
      );
    }
    if (currentStep === 2) {
      if (!registerProcess.isStep2Valid) {
        toast.error('모든 필수 정보를 입력해주세요.');
        return;
      }

      navigate(
        {
          pathname: 'review',
          search: `?categoryId=${registerProcess.selectedCategory?.id}`,
        },
        { replace: true },
      );
    }
  };

  return {
    steps,
    currentStep,
    goToPrevStep,
    goToNextStep,
    ...registerProcess,
  };
};

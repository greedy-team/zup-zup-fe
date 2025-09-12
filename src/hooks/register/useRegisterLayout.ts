import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchSchoolAreas } from '../../api/register';
import { useRegisterProcess } from './useRegisterProcess';
import type { SchoolArea } from '../../types/register';
import { REGISTER_PROCESS_STEPS } from '../../constants/register';
import { SelectedModeContext } from '../../contexts/AppContexts';

export const useRegisterLayout = () => {
  const { schoolAreaId } = useParams<{ schoolAreaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const registerProcess = useRegisterProcess(Number(schoolAreaId) || null);
  const { setSelectedMode } = useContext(SelectedModeContext)!;

  const steps = REGISTER_PROCESS_STEPS.INDEXS;
  const [schoolAreas, setSchoolAreas] = useState<SchoolArea[]>([]);

  useEffect(() => {
    fetchSchoolAreas().then(setSchoolAreas).catch(console.error);
  }, []);

  const currentStep = (() => {
    if (location.pathname.includes('category')) return 1;
    if (location.pathname.includes('details')) return 2;
    if (location.pathname.includes('review')) return 3;
    return 1;
  })();

  const goToPrevStep = () => {
    if (currentStep === 1) {
      setSelectedMode('append');
      navigate('/');
    }
    if (currentStep === 2) navigate('category');
    if (currentStep === 3) navigate('details');
  };

  const goToNextStep = () => {
    if (currentStep === 1) navigate('details');
    if (currentStep === 2) navigate('review');
  };

  return {
    steps,
    currentStep,
    schoolAreas,
    goToPrevStep,
    goToNextStep,
    ...registerProcess,
  };
};

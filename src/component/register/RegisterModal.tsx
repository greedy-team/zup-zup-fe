import { useRegisterProcess } from '../../hooks/register/useRegisterProcess';
import { REGISTER_PROCESS_STEPS } from '../../constants/register';
import { useEffect, useState } from 'react';
import { fetchSchoolAreas } from '../../api/register';
import type { SchoolArea } from '../../types/register';
import type { ResultProps } from '../../types/register';

import ProgressBar from '../common/ProgressBar';
import ResultModal from '../common/ResultModal';
import Step1_CategorySelect from './steps/Step1_CategorySelect';
import Step2_DetailForm from './steps/Step2_DetailForm';
import Step3_Confirm from './steps/Step3_Confirm';
import CloseIcon from '../common/Icons/CloseIcon';
import SpinnerIcon from '../common/Icons/SpinnerIcon';

const RegisterModal = ({
  onClose,
  schoolAreaId,
  onModeChange,
}: ResultProps & { onModeChange?: () => void }) => {
  const {
    currentStep,
    isLoading,
    categories,
    selectedCategory,
    categoryFeatures,
    formData,
    resultModalContent,
    isStep2Valid,
    goToNextStep,
    goToPrevStep,
    setSelectedCategory,
    setFormData,
    handleRegister,
    handleFeatureChange,
  } = useRegisterProcess(onClose, schoolAreaId, onModeChange);

  const steps = REGISTER_PROCESS_STEPS.STEPS;
  const [schoolAreas, setSchoolAreas] = useState<SchoolArea[]>([]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).id === 'modal-overlay') {
      onClose();
    }
  };

  useEffect(() => {
    fetchSchoolAreas().then(setSchoolAreas).catch(console.error);
  }, []);

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOutsideClick}
    >
      {/* 결과 모달이 열려있으면 그 위에 렌더링 */}
      {resultModalContent && <ResultModal {...resultModalContent} />}

      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white p-8 shadow-xl">
        {/* 모달 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:cursor-pointer hover:text-gray-600"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <h1 className="text-center text-2xl font-bold text-gray-800">분실물 등록</h1>
        <ProgressBar steps={steps} currentStep={currentStep} />

        {/* 단계별 내용 렌더링 */}
        <div className="flex-grow overflow-y-auto pr-2">
          {currentStep === 1 && (
            <Step1_CategorySelect
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          )}
          {currentStep === 2 && (
            <Step2_DetailForm
              isLoading={isLoading}
              formData={formData}
              setFormData={setFormData}
              categoryFeatures={categoryFeatures}
              schoolAreas={schoolAreas}
              handleFeatureChange={handleFeatureChange}
            />
          )}
          {currentStep === 3 && (
            <Step3_Confirm
              selectedCategory={selectedCategory}
              formData={formData}
              categoryFeatures={categoryFeatures}
              schoolAreas={schoolAreas}
            />
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-6">
          {/* 이전 버튼 */}
          <div>
            {currentStep > 1 && (
              <button
                onClick={goToPrevStep}
                className="rounded-lg bg-gray-200 px-6 py-3 font-bold text-gray-700 hover:cursor-pointer hover:bg-gray-300"
              >
                이전
              </button>
            )}
          </div>

          {/* 다음 버튼 또는 등록하기 버튼 */}
          <div>
            {currentStep < steps.length ? (
              <button
                onClick={goToNextStep}
                disabled={
                  (currentStep === 1 && !selectedCategory) || (currentStep === 2 && !isStep2Valid)
                }
                className="rounded-lg bg-teal-500 px-6 py-3 font-bold text-white hover:cursor-pointer hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="rounded-lg bg-teal-500 px-6 py-3 font-bold text-white hover:cursor-pointer hover:bg-teal-600 disabled:bg-gray-300"
              >
                {isLoading ? <SpinnerIcon /> : '등록하기'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;

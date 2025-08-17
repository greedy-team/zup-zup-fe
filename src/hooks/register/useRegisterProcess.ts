import { useState, useEffect } from 'react';
import { fetchCategoryFeatures, postLostItem } from '../../api/register';
import type { Category, CategoryFeature, RegisterFormData } from '../../types/register';

const INITIAL_FORM_DATA: RegisterFormData = {
  featureAnswers: {},
  building: '',
  locationDetail: '',
  description: '',
  storageLocation: '',
  images: [],
};

export const useRegisterProcess = (onClose: () => void) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryFeatures, setCategoryFeatures] = useState<CategoryFeature[]>([]);
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA);
  const [resultModal, setResultModal] = useState({ isOpen: false });

  // 카테고리 선택 시, 해당 카테고리의 특징 질문들을 API로 가져옴
  useEffect(() => {
    if (selectedCategory) {
      setIsLoading(true);
      fetchCategoryFeatures(selectedCategory.id)
        .then(setCategoryFeatures)
        .finally(() => setIsLoading(false));
    }
  }, [selectedCategory]);

  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPrevStep = () => setCurrentStep((prev) => prev - 1);

  // 폼 데이터 유효성 검사
  const isStep2Valid =
    Object.keys(formData.featureAnswers).length === categoryFeatures.length &&
    !!formData.locationDetail &&
    !!formData.storageLocation &&
    formData.images.length > 0;

  // 최종 등록 처리
  const handleRegister = async () => {
    setIsLoading(true);
    const submissionData = {
      categoryId: selectedCategory?.id,
      ...formData,
    };
    try {
      await postLostItem(submissionData);
      setResultModal({
        isOpen: true,
        status: 'success',
        title: '등록 완료!',
        message: '분실물이 성공적으로 등록되었습니다.',
        buttonText: '홈으로',
        onConfirm: () => {
          setResultModal((prev) => ({ ...prev, isOpen: false }));
          onClose();
        },
      });
    } catch (error) {
      // 에러 처리
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    isLoading,
    selectedCategory,
    categoryFeatures,
    formData,
    isStep2Valid,
    resultModal,
    goToNextStep,
    goToPrevStep,
    setSelectedCategory,
    setFormData,
    handleRegister,
  };
};

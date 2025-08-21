import { useState, useEffect } from 'react';
import { fetchCategories, fetchCategoryFeatures, postLostItem } from '../../api/register';
import type {
  Category,
  Feature,
  RegisterFormData,
  LostItemRegisterRequest,
  FeatureSelection,
  ResultModalContent,
} from '../../types/register';

// 초기 폼 데이터 설정
const INITIAL_FORM_DATA: Omit<RegisterFormData, 'schoolAreaId'> = {
  detailLocation: '',
  storageName: '',
  features: [],
  description: '',
  images: [],
};

export const useRegisterProcess = (
  onClose: () => void,
  schoolAreaId: number | null,
  onModeChange?: () => void,
) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryFeatures, setCategoryFeatures] = useState<Feature[]>([]);
  const [formData, setFormData] = useState<RegisterFormData>({
    ...INITIAL_FORM_DATA,
    schoolAreaId,
  });
  const [resultModalContent, setResultModalContent] = useState<ResultModalContent | null>(null);

  // 초기 렌더링 시, 카테고리 목록을 가져오기
  useEffect(() => {
    setIsLoading(true);
    fetchCategories()
      .then(setCategories)
      .catch(console.error) // Add error handling
      .finally(() => setIsLoading(false));
  }, []);

  // 카테고리가 선택되면 해당 카테고리의 특징을 가져오기
  useEffect(() => {
    if (selectedCategory) {
      setIsLoading(true);
      setFormData((prev) => ({ ...prev, features: [] })); // 선택된 카테고리 변경 시 특징 초기화
      fetchCategoryFeatures(selectedCategory.categoryId)
        .then(setCategoryFeatures)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setCategoryFeatures([]);
    }
  }, [selectedCategory]);

  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPrevStep = () => setCurrentStep((prev) => prev - 1);

  // 2단계로 넘어가기 위한 검증 변수
  const isStep2Valid =
    formData.features.length === categoryFeatures.length &&
    !!formData.detailLocation.trim() &&
    !!formData.storageName.trim() &&
    formData.images.length > 0 &&
    !!formData.schoolAreaId;

  // 최종 등록 함수
  const handleRegister = async () => {
    if (!selectedCategory || !formData.schoolAreaId) {
      console.error('카테고리 또는 학교 구역이 선택되지 않았습니다.');
      return;
    }

    setIsLoading(true);

    const requestData: LostItemRegisterRequest = {
      categoryId: selectedCategory.categoryId,
      schoolAreaId: formData.schoolAreaId,
      features: formData.features,
      detailLocation: formData.detailLocation,
      storageName: formData.storageName,
      description: formData.description || undefined,
    };

    try {
      await postLostItem(requestData, formData.images);
      setResultModalContent({
        status: 'success',
        title: '등록 완료!',
        message: '분실물이 성공적으로 등록되었습니다.',
        buttonText: '홈으로',
        onConfirm: () => {
          setResultModalContent(null);
          onClose();
          // 등록 완료 후 조회 모드로 변경
          onModeChange?.();
        },
      });
    } catch (error) {
      setResultModalContent({
        status: 'error',
        title: '등록 실패',
        message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        buttonText: '확인',
        onConfirm: () => {
          setResultModalContent(null);
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리 특징 변경 핸들러
  const handleFeatureChange = (featureId: number, optionId: number) => {
    setFormData((prev) => {
      const otherFeatures = prev.features.filter((f) => f.featureId !== featureId);
      const newFeature: FeatureSelection = { featureId, optionId };
      return { ...prev, features: [...otherFeatures, newFeature] };
    });
  };

  return {
    currentStep,
    isLoading,
    categories,
    selectedCategory,
    categoryFeatures,
    formData,
    isStep2Valid,
    resultModalContent,
    goToNextStep,
    goToPrevStep,
    setSelectedCategory,
    setFormData,
    handleRegister,
    handleFeatureChange,
  };
};

import { useContext, useEffect, useState } from 'react';
import { postLostItem, fetchSchoolAreas } from '../../api/register';
import { useRegisterRouter } from './useRegisterRouter';
import { useRegisterData } from './useRegisterData';
import { useRegisterState } from './useRegisterState';
import { SelectedModeContext } from '../../contexts/AppContexts';
import type {
  Category,
  LostItemRegisterRequest,
  ResultModalContent,
  SchoolArea,
} from '../../types/register';

/**
 * 라우팅 기반 등록 프로세스를 위한 모든 하위 훅을 조합하는 컨테이너 훅
 */
export const useRegisterProcess = (schoolAreaIdArg?: number | null) => {
  const { navigate, categoryIdFromQuery, validSchoolAreaId } = useRegisterRouter(schoolAreaIdArg);

  const { isLoading, categories, categoryFeatures } = useRegisterData(categoryIdFromQuery);

  const { formData, setField, setImages, setFeature, resetForm } =
    useRegisterState(validSchoolAreaId);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [resultModalContent, setResultModalContent] = useState<ResultModalContent | null>(null);
  const [schoolAreas, setSchoolAreas] = useState<SchoolArea[]>([]);
  const { setSelectedMode } = useContext(SelectedModeContext)!;

  // 페이지 새로고침 시 URL 쿼리 파라미터를 이용해 selectedCategory 상태 복원
  useEffect(() => {
    if (categoryIdFromQuery && categories.length > 0) {
      const categoryFromUrl = categories.find((c) => c.id === categoryIdFromQuery);
      if (categoryFromUrl) {
        setSelectedCategory(categoryFromUrl);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [categories, categoryIdFromQuery]);

  // schoolAreaId 유효성 검증 및 schoolAreas 데이터 fetch
  useEffect(() => {
    fetchSchoolAreas()
      .then((areas) => {
        setSchoolAreas(areas);
        if (validSchoolAreaId && !areas.some((area) => area.id === validSchoolAreaId)) {
          alert(`유효하지 않은 schoolAreaId: ${validSchoolAreaId}`); // toast로 수정 필요
          navigate('/');
        }
      })
      .catch((err) => {
        console.error('학교 지역 검증 실패', err); // toast로 수정 필요
        navigate('/');
      });
  }, [validSchoolAreaId, navigate]);

  // 2단계로 넘어가기 위한 검증 변수
  const isStep2Valid =
    !!formData.foundAreaId &&
    categoryFeatures.every((feature) =>
      formData.featureOptions.some((option) => option.featureId === feature.id),
    ) &&
    !!formData.foundAreaDetail.trim() &&
    !!formData.depositArea.trim() &&
    formData.images.length > 0;

  // 최종 등록 함수
  const handleRegister = async () => {
    if (!selectedCategory || !formData.foundAreaId) {
      console.error('카테고리 또는 학교 구역이 선택되지 않았습니다.');
      return;
    }

    const requestData: LostItemRegisterRequest = {
      categoryId: selectedCategory.id,
      foundAreaId: formData.foundAreaId,
      foundAreaDetail: formData.foundAreaDetail,
      depositArea: formData.depositArea,
      featureOptions: formData.featureOptions,
      imageOrder: formData.imageOrder,
      description: formData.description || undefined,
    };

    try {
      await postLostItem(requestData, formData.images);
      await resetForm();
      setResultModalContent({
        status: 'success',
        title: '등록 완료!',
        message: '분실물이 성공적으로 등록되었습니다.',
        buttonText: '홈으로',
        onConfirm: () => {
          setResultModalContent(null);
          navigate('/', { replace: true });
          setSelectedMode('append');
        },
      });
    } catch (error) {
      await resetForm();
      setResultModalContent({
        status: 'error',
        title: '등록 실패',
        message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        buttonText: '확인',
        onConfirm: () => {
          setResultModalContent(null);
          navigate('/', { replace: true });
          setSelectedMode('append');
        },
      });
    }
  };

  return {
    isLoading,
    schoolAreas,
    categories,
    selectedCategory,
    setSelectedCategory,
    categoryFeatures,
    formData,
    setField,
    setImages,
    setFeature,
    resetForm,
    handleRegister,
    isStep2Valid,
    resultModalContent,
  };
};

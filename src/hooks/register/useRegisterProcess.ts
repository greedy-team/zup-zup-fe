import { useEffect } from 'react';
import { postLostItem } from '../../api/register';
import { useRegisterSchoolAreasQuery } from '../../api/register/hooks/useRegister';
import { useRegisterRouter } from './useRegisterRouter';
import { useRegisterData } from './useRegisterData';
import { useRegisterState } from './useRegisterState';
import { useSetSelectedMode } from '../../store/hooks/useMainStore';
import { useRegisterStore } from '../../store/registerStore';
import toast from 'react-hot-toast';
import type { LostItemRegisterRequest } from '../../types/register';

/**
 * 라우팅 기반 등록 프로세스를 위한 모든 하위 훅을 조합하는 컨테이너 훅
 */
export const useRegisterProcess = (schoolAreaIdArg?: number | null) => {
  const { navigate, categoryIdFromQuery, validSchoolAreaId } = useRegisterRouter(schoolAreaIdArg);

  const { isLoading, categories, categoryFeatures } = useRegisterData(categoryIdFromQuery);

  const { formData, setField, setImages, setFeature, resetForm } =
    useRegisterState(validSchoolAreaId);

  const { data: schoolAreas = [], isError: isSchoolAreasError } = useRegisterSchoolAreasQuery();

  const setSelectedMode = useSetSelectedMode();

  const selectedCategory = useRegisterStore((s) => s.selectedCategory);
  const setSelectedCategory = useRegisterStore((s) => s.actions.setSelectedCategory);
  const isPending = useRegisterStore((s) => s.isPending);
  const setIsPending = useRegisterStore((s) => s.actions.setIsPending);
  const resultModalContent = useRegisterStore((s) => s.resultModalContent);
  const setResultModalContent = useRegisterStore((s) => s.actions.setResultModalContent);

  // schoolAreaId 유효성 검증
  useEffect(() => {
    if (
      validSchoolAreaId != null &&
      schoolAreas.length > 0 &&
      !schoolAreas.some((area) => area.id === validSchoolAreaId)
    ) {
      toast.error(`유효하지 않은 schoolAreaId: ${validSchoolAreaId}`);
      navigate('/');
    }
  }, [validSchoolAreaId, schoolAreas, navigate]);

  useEffect(() => {
    if (isSchoolAreasError) {
      toast.error('학교 지역 검증 실패');
      navigate('/');
    }
  }, [isSchoolAreasError, navigate]);

  // 페이지 새로고침 시 URL 쿼리 파라미터를 이용해 selectedCategory 상태 복원
  useEffect(() => {
    if (categoryIdFromQuery != null && categories.length > 0) {
      const categoryFromUrl = categories.find((c) => c.id === categoryIdFromQuery) || null;
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory(null);
    }
  }, [categories, categoryIdFromQuery]);

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

    setIsPending(true);

    try {
      await postLostItem(requestData, formData.images);
      resetForm();
      setResultModalContent({
        status: 'success',
        title: '등록 완료!',
        message: '분실물이 성공적으로 등록되었습니다. 관리자의 승인 후 목록에 추가됩니다.',
        buttonText: '홈으로',
        onConfirm: () => {
          setResultModalContent(null);
          navigate('/', { replace: true });
          setSelectedMode('register');
        },
      });
    } catch (error) {
      resetForm();
      const message =
        (error as any)?.data?.error ||
        (error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      setResultModalContent({
        status: 'error',
        title: '등록 실패',
        message,
        buttonText: '확인',
        onConfirm: () => {
          setResultModalContent(null);
          navigate('/', { replace: true });
          setSelectedMode('register');
        },
      });
    } finally {
      setIsPending(false);
    }
  };

  return {
    isLoading,
    isPending,
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

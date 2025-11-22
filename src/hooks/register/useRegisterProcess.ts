import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { fetchCategories, fetchCategoryFeatures, postLostItem } from '../../api/register';
import { fetchSchoolAreas } from '../../api/register';
import type {
  SchoolArea,
  Category,
  Feature,
  RegisterFormData,
  LostItemRegisterRequest,
  FeatureSelection,
  ResultModalContent,
} from '../../types/register';
import { SelectedModeContext } from '../../contexts/AppContexts';

const INITIAL_FORM_DATA: Omit<RegisterFormData, 'foundAreaId'> = {
  foundAreaDetail: '',
  depositArea: '',
  featureOptions: [],
  description: '',
  images: [],
  imageOrder: [],
};

/**
 * 라우팅 기반 등록 프로세스 커스텀 훅
 * - schoolAreaId는 인자 또는 URL 파라미터 중 유효한 값을 사용
 */
export const useRegisterProcess = (schoolAreaIdArg?: number | null) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const { schoolAreaId: schoolAreaIdParam } = useParams<{ schoolAreaId: string }>();

  // URL이 /details 인지 확인
  const isDetailsRoute = location.pathname.includes('/details');

  // 쿼리에서 categoryId 읽기 (없거나 NaN이면 null)
  const categoryIdFromQuery = (() => {
    const v = Number(searchParams.get('categoryId'));
    return Number.isFinite(v) ? v : null;
  })();

  // 유효한 schoolAreaId 결정(인자 우선, 없으면 URL 파라미터 사용)
  const validSchoolAreaId = useMemo(() => {
    if (typeof schoolAreaIdArg === 'number') return schoolAreaIdArg;
    const n = Number(schoolAreaIdParam);
    return Number.isFinite(n) ? n : null;
  }, [schoolAreaIdArg, schoolAreaIdParam]);

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryFeatures, setCategoryFeatures] = useState<Feature[]>([]);
  const { setSelectedMode } = useContext(SelectedModeContext)!;
  const [formData, setFormData] = useState<RegisterFormData>({
    ...INITIAL_FORM_DATA,
    foundAreaId: validSchoolAreaId,
  });
  const [resultModalContent, setResultModalContent] = useState<ResultModalContent | null>(null);

  // schoolAreaId 변경 시 formData 동기화
  useEffect(() => {
    setFormData((prev) => ({ ...prev, foundAreaId: validSchoolAreaId || null }));
  }, [validSchoolAreaId]);

  // 초기 렌더링 시, 카테고리 목록을 가져오기
  useEffect(() => {
    setIsLoading(true);
    fetchCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // 카테고리 쿼리스트링이 바뀔 때마다 카테고리 특징 fetch
  useEffect(() => {
    if (!isDetailsRoute) return;
    if (!categoryIdFromQuery) return;

    // details 진입 시 사용자가 이전에 고른 특징 초기화
    setFormData((prev) => ({ ...prev, featureOptions: [] }));

    setIsLoading(true);
    fetchCategoryFeatures(categoryIdFromQuery)
      .then(setCategoryFeatures)
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isDetailsRoute, categoryIdFromQuery]);

  // 2단계로 넘어가기 위한 검증 변수
  const isStep2Valid =
    formData.featureOptions.length === categoryFeatures.length &&
    !!formData.foundAreaDetail.trim() &&
    !!formData.depositArea.trim() &&
    formData.images.length > 0 &&
    formData.imageOrder.length === formData.images.length &&
    !!formData.foundAreaId;

  // 최종 등록 함수
  const handleRegister = async () => {
    if (!selectedCategory || !formData.foundAreaId) {
      console.error('카테고리 또는 학교 구역이 선택되지 않았습니다.');
      return;
    }

    setIsLoading(true);

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
      setResultModalContent({
        status: 'success',
        title: '등록 완료!',
        message: '분실물이 성공적으로 등록되었습니다.',
        buttonText: '홈으로',
        onConfirm: () => {
          setResultModalContent(null);
          navigate('/', { replace: true });
          setSelectedMode('register');
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
          navigate('/', { replace: true });
          setSelectedMode('register');
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리 특징 변경 핸들러
  const handleFeatureChange = (featureId: number, optionId: number) => {
    setFormData((prev) => {
      const otherFeatures = prev.featureOptions.filter((f) => f.featureId !== featureId);
      const newFeature: FeatureSelection = { featureId, optionId };
      return { ...prev, featureOptions: [...otherFeatures, newFeature] };
    });
  };

  // schoolAreaId 유효성 검증
  useEffect(() => {
    if (validSchoolAreaId == null) return;

    fetchSchoolAreas()
      .then((areas: SchoolArea[]) => {
        const exists = areas.some((area) => area.id === validSchoolAreaId);
        if (!exists) {
          console.warn(`유효하지 않은 schoolAreaId: ${validSchoolAreaId}`);
          navigate('/');
        }
      })
      .catch((err) => {
        console.error('학교 지역 검증 실패', err);
        navigate('/');
      });
  }, []);

  return {
    isLoading,
    categories,
    selectedCategory,
    categoryFeatures,
    formData,
    isStep2Valid,
    resultModalContent,
    setSelectedCategory,
    setFormData,
    handleRegister,
    handleFeatureChange,
  };
};

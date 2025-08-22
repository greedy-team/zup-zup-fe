import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../component/main/header/Header';
import Main from '../../component/main/main/Main';
import RegisterConfirmModal from '../../component/main/modal/RegisterConfirmModal';
import {
  getCategories,
  getLostItemDetail,
  getLostItemSummary,
  getSchoolAreas,
} from '../../apis/main/mainApi';
import type { SchoolArea } from '../../types/map/map';
import type { Category, LostItemListItem, LostItemSummaryRow } from '../../types/lost/lostApi';

const MainPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<LostItemListItem[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [selectedAreaId, setSelectedAreaId] = useState<number>(0);

  const [schoolAreas, setSchoolAreas] = useState<SchoolArea[]>([]);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const [selectedMode, setSelectedMode] = useState<'register' | 'append'>('append');
  const [lostItemSummary, setLostItemSummary] = useState<LostItemSummaryRow[]>([]);
  const [isRegisterConfirmModalOpen, setIsRegisterConfirmModalOpen] = useState(false);

  // 카테고리별 요약 데이터 계산
  const getCategorySummary = useCallback(
    async (categoryId: number) => {
      if (categoryId === 0) {
        // 전체 카테고리인 경우 기존 summary 사용
        return lostItemSummary;
      }

      if (schoolAreas.length === 0) {
        return [];
      }

      try {
        // 각 학교 구역별로 해당 카테고리의 개수를 계산
        const categorySummaryPromises = schoolAreas.map(async (area) => {
          const { total } = await getLostItemDetail(1, 1000, categoryId, area.id);
          return {
            schoolAreaId: area.id,
            count: total,
          };
        });

        const categorySummary = await Promise.all(categorySummaryPromises);
        return categorySummary;
      } catch (error) {
        console.error('Failed to fetch category summary:', error);
        return [];
      }
    },
    [schoolAreas, lostItemSummary],
  );

  const [categorySummary, setCategorySummary] = useState<LostItemSummaryRow[]>([]);

  // 카테고리 변경 시 카테고리별 요약 데이터 업데이트
  useEffect(() => {
    const updateCategorySummary = async () => {
      const summary = await getCategorySummary(selectedCategoryId);
      setCategorySummary(summary);
    };
    updateCategorySummary();
  }, [selectedCategoryId, getCategorySummary]);

  // lostItemId가 존재하면 찾기 프로세스로 라우팅
  useEffect(() => {
    const lostItemId = searchParams.get('lostItemId');
    if (lostItemId) {
      navigate(`/find/${lostItemId}`);
    }
  }, [searchParams, navigate]);

  // 상태 → 메인 쿼리스트링 동기화
  useEffect(() => {
    const next = new URLSearchParams();
    next.set('categoryId', String(selectedCategoryId));
    next.set('schoolAreaId', String(selectedAreaId));
    next.set('page', String(page));
    setSearchParams(next, { replace: true });
  }, [selectedCategoryId, selectedAreaId, page, setSearchParams]);

  // 모드 토글 핸들러: 등록/찾기 모드 전환
  const toggleMode = () => {
    setSelectedMode(selectedMode === 'register' ? 'append' : 'register');
  };

  // 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  // 학교 구역 데이터 가져오기
  useEffect(() => {
    const fetchSchoolAreas = async () => {
      const data = await getSchoolAreas();
      const schoolAreasData = data.schoolAreas;
      setSchoolAreas(schoolAreasData);
    };
    fetchSchoolAreas();
  }, []);

  // 분실물 목록 데이터 가져오기 (페이지, 카테고리, 구역 변경 시)
  useEffect(() => {
    (async () => {
      const { items, total } = await getLostItemDetail(page, 5, selectedCategoryId, selectedAreaId);
      setItems(items);
      setTotalCount(total);
    })();
  }, [page, selectedCategoryId, selectedAreaId]);

  // 선택된 구역의 분실물 요약 데이터 가져오기
  useEffect(() => {
    const fetchLostItemSummary = async () => {
      try {
        const data = await getLostItemSummary(selectedAreaId);
        setLostItemSummary(data);
      } catch (error) {
        console.error('Failed to fetch lost item summary:', error);
        setLostItemSummary([]);
      }
    };
    fetchLostItemSummary();
  }, [selectedAreaId]);

  return (
    <>
      <div className="flex h-screen flex-col">
        <Header
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          selectedMode={selectedMode}
        />
        <Main
          pagination={{ page, setPage, totalCount: totalCount }}
          mapSelection={{
            selectedAreaId,
            setSelectedAreaId,
          }}
          mode={{ selectedMode, toggleMode }}
          selectedCategoryId={selectedCategoryId}
          lists={{ items, categories }}
          areas={{ schoolAreas, lostItemSummary: categorySummary }}
          ui={{ setIsRegisterConfirmModalOpen }}
        />
      </div>

      <RegisterConfirmModal
        setIsRegisterConfirmModalOpen={setIsRegisterConfirmModalOpen}
        isOpen={isRegisterConfirmModalOpen}
        onConfirm={() => {
          setIsRegisterConfirmModalOpen(false);
          // 등록은 페이지 방식으로 전환
          navigate(`/register/${selectedAreaId}`);
        }}
        onCancel={() => setIsRegisterConfirmModalOpen(false)}
      />
    </>
  );
};

export default MainPage;

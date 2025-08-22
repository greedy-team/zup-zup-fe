import { useEffect, useState, useCallback } from 'react';
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

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);

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
  }, [selectedCategoryId, getCategorySummary, isFindModalOpen, isRegisterModalOpen]);

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
  }, [page, selectedCategoryId, selectedAreaId, isFindModalOpen, isRegisterModalOpen]);

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

  // 카테고리나 구역 변경 시 페이지를 1페이지로 리셋
  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId, selectedAreaId]);

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
          lists={{ items, categories }}
          areas={{ schoolAreas, lostItemSummary: categorySummary }}
          ui={{ setIsRegisterConfirmModalOpen, setIsRegisterModalOpen, setIsFindModalOpen }}
          isRegisterModalOpen={isRegisterModalOpen}
          isFindModalOpen={isFindModalOpen}
        />
      </div>

      <RegisterConfirmModal
        setIsRegisterConfirmModalOpen={setIsRegisterConfirmModalOpen}
        isOpen={isRegisterConfirmModalOpen}
        onConfirm={() => {
          setIsRegisterConfirmModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onCancel={() => setIsRegisterConfirmModalOpen(false)}
        setIsRegisterModalOpen={setIsRegisterModalOpen}
      />
    </>
  );
};

export default MainPage;

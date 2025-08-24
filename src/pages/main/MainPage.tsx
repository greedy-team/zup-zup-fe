import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../component/main/header/Header';
import Main from '../../component/main/main/Main';
import {
  getCategories,
  getLostItemDetail,
  getLostItemSummary,
  getSchoolAreas,
} from '../../apis/main/mainApi';
import {
  CategoriesContext,
  ItemsContext,
  SchoolAreasContext,
  TotalCountContext,
  LostItemSummaryContext,
} from '../../contexts/AppContexts';
import RegisterConfirmModal from '../../component/main/modal/RegisterConfirmModal';
import { isValidId } from '../../utils/isValidId';
import { PAGE_SIZE } from '../../constants/main/pagenation';

const MainPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { setCategories } = useContext(CategoriesContext)!;
  const { setItems } = useContext(ItemsContext)!;
  const { setSchoolAreas } = useContext(SchoolAreasContext)!;
  const { setTotalCount } = useContext(TotalCountContext)!;
  const { setLostItemSummary } = useContext(LostItemSummaryContext)!;

  const rawCategoryId = searchParams.get('categoryId');
  const selectedCategoryId = isValidId(rawCategoryId) ? Number(rawCategoryId) : 0;
  const rawAreaId = searchParams.get('schoolAreaId');
  const selectedAreaId = isValidId(rawAreaId) ? Number(rawAreaId) : 0;
  const rawPage = searchParams.get('page');
  const page = isValidId(rawPage) ? Number(rawPage) : 1;

  // lostItemId가 존재하면 찾기 프로세스로 라우팅
  useEffect(() => {
    const lostItemId = searchParams.get('lostItemId');
    if (lostItemId) {
      navigate(`/find/${lostItemId}`);
    }
  }, [searchParams, navigate]);

  // 카테고리 데이터 가져오기 (context 상태를 채움)
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  // 학교 구역 데이터 가져오기 (context 상태를 채움)
  useEffect(() => {
    const fetchSchoolAreas = async () => {
      const data = await getSchoolAreas();
      const schoolAreasData = data.schoolAreas;
      setSchoolAreas(schoolAreasData);
    };
    fetchSchoolAreas();
  }, []);

  // 분실물 목록 데이터 가져오기 (페이지, 카테고리, 구역 변경 시) → context 상태를 채움
  useEffect(() => {
    (async () => {
      const { items, total } = await getLostItemDetail(
        page,
        PAGE_SIZE,
        selectedCategoryId,
        selectedAreaId,
      );
      setItems(items);
      setTotalCount(total);
    })();
  }, [page, selectedCategoryId, selectedAreaId]);

  // 선택된 구역/카테고리의 분실물 요약 데이터 가져오기 → context 상태를 채움 (단일 호출)
  useEffect(() => {
    const fetchLostItemSummary = async () => {
      try {
        const data = await getLostItemSummary(selectedAreaId, selectedCategoryId);
        setLostItemSummary(data);
      } catch (error) {
        console.error('분실물 요약 데이터 가져오기 실패:', error);
        setLostItemSummary([]);
      }
    };
    fetchLostItemSummary();
  }, [selectedAreaId, selectedCategoryId, setLostItemSummary]);

  return (
    <>
      <div className="flex h-screen flex-col">
        <Header />
        <Main />
      </div>

      <RegisterConfirmModal />
    </>
  );
};

export default MainPage;

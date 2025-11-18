import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContexts';
import { Toaster } from 'react-hot-toast';
// 헤더 부분 (카테고리 제외)
import RootLayout from './layouts/RootLayout';
// 메인 (카테고리 필터(찾기랑 등록에는 필요 없음 ) + 목록 + 지도)  헤당 쿼리의 스트링 값은 필수가 아님 카테고리가 전체인 경우 전체 구역인 경우 → /?categoryId=&schoolAreaId=&page=
import MainPage from './pages/main/MainPage';
import LoginPage from './pages/login/LoginPage';
// 찾기(Find) -> /find/:lostItemId/*
import FindLayout from './pages/find/FindLayout'; // 진행 바(진행바 생성을 여기서 해야함 귀중품 비 귀중품 판단해서)와 같은 찾기 단계의 공통 요소, 규칙 검사 단계를 건너띈 경우를 판단
import FindInfo from './pages/find/FindInfo'; // 정보 확인(물건 정보)
import FindQuiz from './pages/find/FindQuiz'; // 인증 퀴즈(비귀중품은 FindLayout에서 스킵)
import FindDetail from './pages/find/FindDetail'; // 상세 정보
import FindPledge from './pages/find/FindPledge'; // 약관 동의
import FindDeposit from './pages/find/FindDeposit';

// 등록(Register) 플로우 -> /register/*
import RegisterLayout from './pages/register/RegisterLayout'; // 규칙 검사 단계 건너띈 경우 판단, 진행 바와 같은 공통 요소
import RegisterCategory from './pages/register/RegisterCategory'; // 1) 카테고리 선택
import RegisterDetails from './pages/register/RegisterDetails'; // 2) 상세 정보 입력
import RegisterReview from './pages/register/RegisterReview'; // 3) 최종 확인 등록 버튼 누르고 등록 완료 모달이 뜨고 해당 모달의 확인을 눌러 메인으로 리다이렉트
// 관리자(Admin)  페이지
import AdminPage from './pages/admin/AdminPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          <Routes>
            {/* 공통 레이아웃인 헤더를 넣을 부분(카테고리를 제외한 부분) */}
            <Route element={<RootLayout />}>
              {/* 메인: (/?categoryId=&schoolAreaId=&page=), 필터/페이지네이션을 쿼리 스트링으로 판단 */}
              <Route index element={<MainPage />} />

              <Route path="login" element={<LoginPage />} />

              {/* 찾기: (/find/:lostItemId/*) */}
              <Route path="find/:lostItemId" element={<FindLayout />}>
                <Route index element={<Navigate to="info" replace />} />
                <Route path="info" element={<FindInfo />} />
                <Route path="quiz" element={<FindQuiz />} />
                <Route path="detail" element={<FindDetail />} />
                <Route path="pledge" element={<FindPledge />} />
                <Route path="deposit" element={<FindDeposit />} />
              </Route>

              {/* 등록: (/register/:schoolAreaId/*) */}
              <Route path="register/:schoolAreaId" element={<RegisterLayout />}>
                <Route index element={<Navigate to="category" replace />} />
                <Route path="category" element={<RegisterCategory />} />
                <Route path="details" element={<RegisterDetails />} />
                <Route path="review" element={<RegisterReview />} />
              </Route>
              <Route path="*" element={<MainPage />} />
            </Route>
            <Route path="admin" element={<AdminPage />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

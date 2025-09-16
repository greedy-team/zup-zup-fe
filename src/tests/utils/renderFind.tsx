import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '../../contexts/AppContexts';
import { AuthFlagProvider } from '../../contexts/AuthFlag';

import FindLayout from '../../pages/find/FindLayout';
import FindInfo from '../../pages/find/FindInfo';
import FindQuiz from '../../pages/find/FindQuiz';
import FindDetail from '../../pages/find/FindDetail';
import FindPledge from '../../pages/find/FindPledge';
import FindDeposit from '../../pages/find/FindDeposit';

/*MemoryRouter로 실제 라우팅 트리를 구성해 렌더링 하는 방법*/
export function renderFind(initialPath = '/find/10/info') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthFlagProvider>
        <AppProvider>
          <Routes>
            {/* 에러 발생시 navigate('/')로 홈으로 이동 */}
            <Route path="/" element={<div>Home</div>} />
            {/* 401 처리에서 로그인 페이지로 이동 */}
            <Route path="/login" element={<div>Login</div>} />

            <Route path="/find/:lostItemId" element={<FindLayout />}>
              <Route index element={<Navigate to="info" replace />} />
              <Route path="info" element={<FindInfo />} />
              <Route path="quiz" element={<FindQuiz />} />
              <Route path="detail" element={<FindDetail />} />
              <Route path="pledge" element={<FindPledge />} />
              <Route path="deposit" element={<FindDeposit />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthFlagProvider>
    </MemoryRouter>,
  );
}

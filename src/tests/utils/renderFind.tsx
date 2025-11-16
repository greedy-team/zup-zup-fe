import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppProvider } from '../../contexts/AppContexts';
import { AuthFlagProvider } from '../../contexts/AuthFlag';

import FindLayout from '../../pages/find/FindLayout';
import FindInfo from '../../pages/find/FindInfo';
import FindQuiz from '../../pages/find/FindQuiz';
import FindDetail from '../../pages/find/FindDetail';
import FindPledge from '../../pages/find/FindPledge';
import FindDeposit from '../../pages/find/FindDeposit';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

export function renderFind(initialPath = '/find/10/info') {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <AuthFlagProvider>
          <AppProvider>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
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
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useRedirectToLoginKeepPath() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    if (location.pathname === '/login') return;

    const from = `${location.pathname}${location.search}`;
    const redirect = encodeURIComponent(from);

    navigate(`/login?redirect=${redirect}`, { replace: true });
  }, [location.pathname, location.search, navigate]);
}

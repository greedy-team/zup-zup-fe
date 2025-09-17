import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthFlag, broadcastLogout } from '../../../contexts/AuthFlag';
import { logout } from '../../../api/auth';

export default function Authentication() {
  const { isAuthenticated, setUnauthenticated } = useAuthFlag();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname.startsWith('/login')) return null;

  const goLoginPage = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    setUnauthenticated();
    broadcastLogout();
    navigate('/', { replace: true });
  };

  return (
    <div>
      {!isAuthenticated ? (
        <button
          type="button"
          className="h-9 rounded-md bg-teal-600 px-4 text-base font-medium text-white transition-colors hover:bg-teal-700 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none sm:h-auto sm:px-2.5 sm:py-1.5 sm:text-sm md:px-3 md:py-1.5 lg:px-3.5 lg:py-2"
          onClick={goLoginPage}
        >
          로그인
        </button>
      ) : (
        <button
          type="button"
          className="h-9 rounded-md bg-teal-600 px-4 text-base font-medium text-white transition-colors hover:bg-teal-700 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none sm:h-auto sm:px-2.5 sm:py-1.5 sm:text-sm md:px-3 md:py-1.5 lg:px-3.5 lg:py-2"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      )}
    </div>
  );
}

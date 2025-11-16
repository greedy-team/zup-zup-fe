import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthFlag } from '../../../store/hooks/useAuth';
import { useLogoutMutation } from '../../../api/auth/hooks/useAuth';
import { redirectToLoginKeepPath } from '../../../utils/auth/loginRedirect';

export default function Authentication() {
  const isAuthenticated = useAuthFlag();
  const logoutMutation = useLogoutMutation();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname.startsWith('/login')) return null;

  const goLoginPage = () => {
    redirectToLoginKeepPath();
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/', { replace: true });
      },
    });
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

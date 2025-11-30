import { useNavigate } from 'react-router-dom';
import { useAuthFlag } from '../../../store/hooks/useAuth';
import LoginIcon from '../../../../assets/login.svg?react';
import LogoutIcon from '../../../../assets/logout.svg?react';
import { useLogoutMutation } from '../../../api/auth/hooks/useAuth';
import { useRedirectToLoginKeepPath } from '../../../utils/auth/loginRedirect';

export default function Authentication() {
  const isAuthenticated = useAuthFlag();
  const logoutMutation = useLogoutMutation();
  const redirectToLoginKeepPath = useRedirectToLoginKeepPath();
  const navigate = useNavigate();

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
    <div className="flex h-full w-full flex-shrink-0 flex-col items-center justify-center md:aspect-square">
      {!isAuthenticated ? (
        <button
          type="button"
          onClick={goLoginPage}
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center transition focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:outline-none"
        >
          <LoginIcon className="h-6 w-8 cursor-pointer sm:h-12 sm:w-12 md:h-8 md:w-8" />
          <span className="text-xs text-gray-600 group-hover:text-teal-500 sm:text-lg md:text-sm">
            로그인
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center transition focus-visible:ring-2 focus-visible:outline-none"
        >
          <LogoutIcon className="h-6 w-8 cursor-pointer sm:h-12 sm:w-12 md:h-8 md:w-8" />
          <span className="text-xs text-gray-600 group-hover:text-teal-500 sm:text-lg md:text-sm">
            로그아웃
          </span>
        </button>
      )}
    </div>
  );
}

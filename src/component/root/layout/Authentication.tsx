import { useNavigate } from 'react-router-dom';
import { useAuthFlag, broadcastLogout } from '../../../contexts/AuthFlag';
import { logout } from '../../../api/auth';
import LoginIcon from '../../../../assets/login.svg?react';
import LogoutIcon from '../../../../assets/logout.svg?react';

export default function Authentication() {
  const isAuthenticated = useAuthFlag();
  const logoutMutation = useLogoutMutation();

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
    <div className="flex aspect-square flex-shrink-0 flex-col items-center justify-center">
      {!isAuthenticated ? (
        <button
          type="button"
          onClick={goLoginPage}
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
        >
          <LoginIcon className="h-6 w-6 cursor-pointer sm:h-15 sm:w-15 md:h-8 md:w-8" />
          <span className="text-xs text-gray-600 group-hover:text-teal-500 sm:text-lg md:text-sm">
            로그인
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
        >
          <LogoutIcon className="h-6 w-6 cursor-pointer sm:h-15 sm:w-15 md:h-8 md:w-8" />
          <span className="text-xs text-gray-600 group-hover:text-teal-500 sm:text-lg md:text-sm">
            로그아웃
          </span>
        </button>
      )}
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { useAuthFlag } from '../../../store/hooks/useAuth';
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

  const buttonBaseClass =
    'group flex h-full w-full cursor-pointer flex-col items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300';

  return (
    <div className="flex h-full w-full flex-shrink-0 flex-col items-center justify-center md:aspect-square">
      {!isAuthenticated ? (
        <button type="button" onClick={goLoginPage} className={buttonBaseClass}>
          <LogIn className="h-6 w-6 text-gray-600 group-hover:text-teal-500 sm:h-15 sm:w-15 md:h-8 md:w-8" />
          <span className="mt-1 text-xs text-gray-600 group-hover:text-teal-500 sm:text-lg md:text-sm">
            로그인
          </span>
        </button>
      ) : (
        <button type="button" onClick={handleLogout} className={buttonBaseClass}>
          <LogOut className="h-6 w-6 text-gray-600 group-hover:text-teal-500 sm:h-15 sm:w-15 md:h-8 md:w-8" />
          <span className="mt-1 text-xs text-gray-600 group-hover:text-teal-500 sm:text-lg md:text-sm">
            로그아웃
          </span>
        </button>
      )}
    </div>
  );
}

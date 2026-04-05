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
          <LogIn className="h-5 w-5 text-gray-700 group-hover:text-teal-600 md:h-8 md:w-8 md:text-gray-600 md:group-hover:text-teal-500" />
          <span className="mt-0.5 text-[10px] font-medium text-gray-700 group-hover:text-teal-600 md:text-sm md:font-normal md:text-gray-600 md:group-hover:text-teal-500">
            로그인
          </span>
        </button>
      ) : (
        <button type="button" onClick={handleLogout} className={buttonBaseClass}>
          <LogOut className="h-5 w-5 text-teal-600 group-hover:text-teal-700 md:h-8 md:w-8 md:text-gray-600 md:group-hover:text-teal-500" />
          <span className="mt-0.5 text-[10px] font-medium text-teal-600 group-hover:text-teal-700 md:text-sm md:font-normal md:text-gray-600 md:group-hover:text-teal-500">
            로그아웃
          </span>
        </button>
      )}
    </div>
  );
}

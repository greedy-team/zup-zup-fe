import { useNavigate } from 'react-router-dom';
import { useAuthFlag, broadcastLogout } from '../../../contexts/AuthFlag';
import { logout } from '../../../api/auth';
import LoginIcon from '../../../../assets/login.png';
import LogoutIcon from '../../../../assets/logout.png';

export default function Authentication() {
  const { isAuthenticated, setUnauthenticated } = useAuthFlag();
  const navigate = useNavigate();

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
    <div className="flex aspect-square flex-shrink-0 flex-col items-center justify-center">
      {!isAuthenticated ? (
        <button
          type="button"
          onClick={goLoginPage}
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
        >
          <img
            src={LoginIcon}
            alt="login"
            className="h-6 w-6 cursor-pointer sm:h-15 sm:w-15 md:h-8 md:w-8"
          />
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
          <img
            src={LogoutIcon}
            alt="logout"
            className="h-6 w-6 cursor-pointer sm:h-15 sm:w-15 md:h-8 md:w-8"
          />
          <span className="text-xs text-gray-600 group-hover:text-teal-500 sm:text-lg md:text-sm">
            로그아웃
          </span>
        </button>
      )}
    </div>
  );
}

import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthFlag, broadcastLogout } from '../../../contexts/AuthFlag';
import { logout } from '../../../api/auth';
import LoginIcon from '../../../../assets/login.png';
import LogoutIcon from '../../../../assets/logout.png';

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
    <div className="flex flex-shrink-0 flex-col items-center justify-center">
      {!isAuthenticated ? (
        <button type="button" onClick={goLoginPage}>
          <img src={LoginIcon} alt="login" className="h-8 w-8" />
        </button>
      ) : (
        <button type="button" onClick={handleLogout}>
          <img src={LogoutIcon} alt="logout" className="h-8 w-8" />
        </button>
      )}
    </div>
  );
}

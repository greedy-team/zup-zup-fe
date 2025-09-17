import { createContext, useContext, useEffect, useCallback, useState } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean; // 현재 탭의 UI 구성을 위한 로그인 상태 관리 프론트엔드에서는 확실한 로그인 여부를 확인이 불가하므로 해당 값은 UI적 용도임
  setAuthenticated: () => void; // 로그인이 필요한 호출 성공시 또는 로그인 확인 호출 성공시 UI적 상태 값을 true로 바꾸는 역할을 한다.
  setUnauthenticated: () => void; // 로그인 실패시 로그인이 필요한 서비스 실패 시, 로그아웃시 UI적 상태 값을 false로 바꾸는 역할을 한다.
};

// 저장 키 (sessionStorage / localStorage)
const AUTH_FLAG_SESSION_STORAGE_KEY = 'auth.authed'; // (UI적 상태의 새로 고침시 페이지 이동시 초기화 방지, UI적 상태이므로 신뢰도가 낮으므로 sessionStorage로 관리하여 탭간의 공유 막음)
const AUTH_LOGIN_BROADCAST_STORAGE_KEY = 'auth.login-broadcast'; // 다른 탭에 로그인 전파 (StorageEvent로 저장소 변환을 이벤트 등록하여 다른 탭에 전파를 파악해야 하므로)
const AUTH_LOGOUT_BROADCAST_STORAGE_KEY = 'auth.logout-broadcast'; // 다른 탭에 로그아웃 전파 (StorageEvent로 저장소 변환을 이벤트 등록하여 다른 탭에 전파를 파악해야 하므로)

const AuthContext = createContext<AuthContextValue | null>(null);

// 세션에 저장된 초기 플래그 읽기 (새로고침 페이지 이동의 발생 시 세션 저장소의 데이터를 읽어서 UI적 로그인 여부 판단을 위해서)
function readInitialAuthFlag(): boolean {
  try {
    return sessionStorage.getItem(AUTH_FLAG_SESSION_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

// 세션 저장소에 에 플래그를 저장
function writeAuthFlag(flag: boolean) {
  try {
    sessionStorage.setItem(AUTH_FLAG_SESSION_STORAGE_KEY, flag ? '1' : '0');
  } catch {}
}

export function AuthFlagProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(readInitialAuthFlag);

  // 로그인 상태 변경 시 세션 저장소에도 반영하기 위한 로직(사실 값이 바뀔때마다 항상 저장을 같이해주면 되지만 아닌 경우를 위해서)
  useEffect(() => {
    writeAuthFlag(isAuthenticated);
  }, [isAuthenticated]);

  // 다른 탭에서 로그인/로그아웃 저장소 변화 이벤트를 감지하여 UI 상태를 변경하고 반영하기 위한 로직
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === AUTH_LOGIN_BROADCAST_STORAGE_KEY) {
        setIsAuthenticated(true);
        writeAuthFlag(true);
      } else if (e.key === AUTH_LOGOUT_BROADCAST_STORAGE_KEY) {
        setIsAuthenticated(false);
        writeAuthFlag(false);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage); // 언마운트시 이벤트 리스너를 해제하기 위해서
  }, []);

  const setAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
    writeAuthFlag(true);
  }, []);
  const setUnauthenticated = useCallback(() => {
    setIsAuthenticated(false);
    writeAuthFlag(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, setUnauthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthFlag() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthFlag 훅이 AuthFlagProvider 외부에서 사용 되었습니다.'); // 잘못된 위치에서 훅 사용을 막기 위한 용도
  return ctx;
}

// 로그인/로그아웃 시 다른 탭에도 알리기(설정 값을 날짜로 설정한 이유는 항상 다른 값으로 설정하여 변화 인지가 가능하게 하기 위해서 입니다.)
// try catch로 구성한 이유는 스토리지 접근이 차단된 모드나 브라우저의 경우를 위해서 오류가 있어도 작동하도록
export function broadcastLogin() {
  try {
    localStorage.setItem(AUTH_LOGIN_BROADCAST_STORAGE_KEY, String(Date.now()));
  } catch {}
}
export function broadcastLogout() {
  try {
    localStorage.setItem(AUTH_LOGOUT_BROADCAST_STORAGE_KEY, String(Date.now()));
  } catch {}
}

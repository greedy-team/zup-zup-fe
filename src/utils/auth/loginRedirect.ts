let isLoginRedirecting = false;

export function redirectToLoginKeepPath() {
  if (isLoginRedirecting) return;
  if (location.pathname === '/login') return;
  isLoginRedirecting = true;

  const from = `${location.pathname}${location.search}`;
  const redirect = encodeURIComponent(from);
  location.assign(`/login?redirect=${redirect}`);
}

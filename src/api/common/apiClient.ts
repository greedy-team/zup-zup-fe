const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T | undefined> {
  const method = (options.method || 'GET').toUpperCase();
  const hasBody = options.body != null && !(options.body instanceof FormData);

  const headers = new Headers(options.headers || {});

  if (hasBody && method !== 'GET' && method !== 'HEAD' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(BASE_URL + url, {
    ...options,
    method,
    credentials: 'include',
    headers,
  });

  if (res.status === 204) return undefined;

  const data = await res.json().catch(() => undefined);

  if (!res.ok) {
    throw { status: res.status, data };
  }

  return data as T;
}

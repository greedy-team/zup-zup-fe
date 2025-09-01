const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T | undefined> {
  const res = await fetch(BASE_URL + url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) return undefined;

  const data = await res.json().catch(() => undefined);

  if (!res.ok) {
    throw { status: res.status, data };
  }

  return data as T;
}

export type HttpMethod = 'GET' | 'POST';

/** Minimal fetch wrapper — replace with auth + retries in production. */
export async function apiRequest<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
    ...init,
    headers: {'Content-Type': 'application/json', ...init?.headers},
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

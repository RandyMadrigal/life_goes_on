const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export interface ApiOk<T> {
  ok: true;
  data: T;
}
export interface ApiErr {
  ok: false;
  message: string;
}
export type ApiResult<T> = ApiOk<T> | ApiErr;

async function req<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...init.headers },
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, data: body.data ?? body };
    return { ok: false, message: body.message ?? "Something went wrong" };
  } catch {
    return { ok: false, message: "Network error — is the API server running?" };
  }
}

export const api = {
  get: <T>(path: string) => req<T>(path, { method: "GET" }),
  post: <T>(path: string, data: unknown) =>
    req<T>(path, { method: "POST", body: JSON.stringify(data) }),
  patch: <T>(path: string, data: unknown) =>
    req<T>(path, { method: "PATCH", body: JSON.stringify(data) }),
};

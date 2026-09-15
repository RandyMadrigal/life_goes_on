import type { ApiEnvelope } from "life-goes-on-shared";
import { getAccessToken, setAccessToken } from "./authToken";

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

// These auth-lifecycle endpoints can legitimately return 401 on their own
// (bad credentials, dead refresh token) — retrying them through the refresh
// flow would either be nonsensical or risk an infinite loop.
const NO_REFRESH_RETRY_PATHS = new Set(["/api/v1/admin/login", "/api/v1/admin/refresh"]);

// Coalesces concurrent 401s into a single refresh call. Without this, three
// requests failing at once would each try to consume the same rotating
// refresh token — only the first succeeds, and the rest look like reuse.
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${BASE}/api/v1/admin/refresh`, {
          method: "POST",
          credentials: "include",
        });
        const body = (await res.json().catch(() => ({}))) as Partial<
          ApiEnvelope<{ accessToken: string }>
        >;
        if (res.ok && body.data?.accessToken) {
          setAccessToken(body.data.accessToken);
          return true;
        }
        setAccessToken(null);
        return false;
      } catch {
        setAccessToken(null);
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

async function req<T>(
  path: string,
  init: RequestInit = {},
  isRetry = false,
): Promise<ApiResult<T>> {
  try {
    const token = getAccessToken();
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });

    if (res.status === 401 && !isRetry && !NO_REFRESH_RETRY_PATHS.has(path)) {
      const refreshed = await refreshAccessToken();
      if (refreshed) return req<T>(path, init, true);
    }

    const body = (await res.json().catch(() => ({}))) as Partial<ApiEnvelope<T>>;
    if (res.ok) return { ok: true, data: (body.data ?? body) as T };
    return { ok: false, message: body.message ?? "Something went wrong" };
  } catch {
    return { ok: false, message: "Network error — is the API server running?" };
  }
}

export const api = {
  get: <T>(path: string) => req<T>(path, { method: "GET" }),
  post: <T>(path: string, data: unknown) =>
    req<T>(path, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(path: string, data: unknown) =>
    req<T>(path, { method: "PUT", body: JSON.stringify(data) }),
  patch: <T>(path: string, data: unknown) =>
    req<T>(path, { method: "PATCH", body: JSON.stringify(data) }),
  delete: <T>(path: string) => req<T>(path, { method: "DELETE" }),
};

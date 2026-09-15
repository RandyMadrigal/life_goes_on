// The admin access token lives only in memory — never in localStorage or
// sessionStorage, so an XSS payload can't read it off disk, and it
// disappears on every full page reload (recovered transparently via the
// refresh-token cookie the next time an API call needs it — see api.ts).
let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

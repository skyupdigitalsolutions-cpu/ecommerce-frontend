import axios from "axios";

// Dev: baseURL "/api" is proxied to the backend by Vite (same-origin, so the
// httpOnly refresh cookie works). Prod: set VITE_API_URL to the full API URL.
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // send/receive the refresh cookie
});

// Access token lives in memory only (not localStorage) - more resistant to XSS.
// On a page reload it's gone, but AuthContext calls /auth/refresh on startup to
// mint a new one from the refresh cookie.
let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// If a request 401s, try one refresh, then replay the original request.
let refreshing = null;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isAuthCall = original?.url?.includes("/auth/");

    if (status === 401 && !original._retried && !isAuthCall) {
      original._retried = true;
      try {
        // De-dupe concurrent refreshes into a single request.
        refreshing = refreshing || api.post("/auth/refresh");
        const { data } = await refreshing;
        refreshing = null;
        setAccessToken(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        refreshing = null;
        setAccessToken(null);
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

// Normalize backend errors to a plain message string.
export const errMsg = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors?.[0]?.message ||
  error?.message ||
  "Something went wrong";

export default api;

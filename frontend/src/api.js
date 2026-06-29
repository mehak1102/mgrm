import axios from "axios";
import { clearAllAuthClientState, getStoredToken } from "./utils/authStorage";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "/api" : "http://localhost:5000/api"),
  withCredentials: true,
});

let onUnauthorized = () => {};

export function setUnauthorizedHandler(handler) {
  onUnauthorized = typeof handler === "function" ? handler : () => {};
}

API.interceptors.request.use((req) => {
  const token = getStoredToken();
  if (token) req.headers.Authorization = `Bearer ${token}`;
  else delete req.headers.Authorization;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearAllAuthClientState();
      onUnauthorized();
    }
    return Promise.reject(err);
  }
);

export default API;

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API, { setUnauthorizedHandler } from "../api";
import {
  clearAllAuthClientState,
  clearAuthStorage,
  getStoredToken,
  isStoredSessionExpired,
  persistAuth,
} from "../utils/authStorage";

const AuthContext = createContext(null);

function normalizeUser(payload) {
  if (!payload) return null;
  return {
    id: payload.id || payload._id,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const applyLoggedOut = useCallback(
    (meta) => {
      setUser(null);
      if (meta?.expired) {
        if (window.location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
        toast.error("Your session has expired. Please log in again.");
      }
    },
    [navigate]
  );

  useEffect(() => {
    setUnauthorizedHandler(applyLoggedOut);
    return () => setUnauthorizedHandler(() => {});
  }, [applyLoggedOut]);

  useEffect(() => {
    let cancelled = false;

    async function validateSession() {
      const token = getStoredToken();

      if (!token) {
        clearAuthStorage();
        if (!cancelled) {
          setUser(null);
          setAuthReady(true);
        }
        return;
      }

      try {
        const res = await API.get("/auth/me");
        const nextUser = normalizeUser(res.data);
        if (!cancelled) {
          persistAuth(token, nextUser);
          setUser(nextUser);
        }
      } catch {
        clearAllAuthClientState();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    }

    validateSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (form) => {
    const res = await API.post("/auth/login", form);
    persistAuth(res.data.token, res.data.user);
    setUser(normalizeUser(res.data.user));
  }, []);

  const register = useCallback(async (form) => {
    const res = await API.post("/auth/register", form);
    persistAuth(res.data.token, res.data.user);
    setUser(normalizeUser(res.data.user));
  }, []);

  const logout = useCallback(async () => {
    try {
      await API.post("/auth/logout");
    } catch {
      // Always clear client session even if the network call fails.
    }

    clearAllAuthClientState();
    setUser(null);

    window.history.replaceState(null, "", "/login");
    navigate("/login", { replace: true });
    toast.success("Logged out successfully");
  }, [navigate]);

  const expireSession = useCallback(
    (message = "Your session has expired. Please log in again.") => {
      clearAllAuthClientState();
      setUser(null);
      if (window.location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
      toast.error(message);
    },
    [navigate]
  );

  useEffect(() => {
    if (!user) return undefined;

    const checkSession = () => {
      if (isStoredSessionExpired()) {
        expireSession();
      }
    };

    checkSession();
    const intervalId = window.setInterval(checkSession, 60_000);
    return () => window.clearInterval(intervalId);
  }, [user, expireSession]);

  const value = useMemo(
    () => ({ user, authReady, login, register, logout }),
    [user, authReady, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

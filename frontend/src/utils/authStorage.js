const AUTH_LOCAL_KEYS = [
  "token",
  "accessToken",
  "refreshToken",
  "mgrm_user",
  "user",
];

const AUTH_LOCAL_PREFIXES = ["clerk", "__clerk"];

function getTokenExpiryMs(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload?.exp) return payload.exp * 1000;
  } catch {
    /* ignore malformed token */
  }
  return null;
}

export function isStoredSessionExpired() {
  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");
  if (!token) return false;
  const expiresAt = getTokenExpiryMs(token);
  return expiresAt != null && Date.now() >= expiresAt;
}

export function getStoredToken() {
  if (isStoredSessionExpired()) {
    clearAuthStorage();
    return null;
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    null
  );
}

export function getStoredUser() {
  try {
    const raw =
      localStorage.getItem("mgrm_user") || localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function persistAuth(token, user) {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("mgrm_user", JSON.stringify(user));
  localStorage.removeItem("user");
}

export function clearAuthStorage() {
  AUTH_LOCAL_KEYS.forEach((key) => localStorage.removeItem(key));

  Object.keys(localStorage).forEach((key) => {
    const lower = key.toLowerCase();
    if (
      AUTH_LOCAL_PREFIXES.some((prefix) => key.startsWith(prefix)) ||
      (lower.includes("persist") &&
        (lower.includes("auth") || lower.includes("user") || lower.includes("token")))
    ) {
      localStorage.removeItem(key);
    }
  });
}

export function clearAuthSession() {
  sessionStorage.clear();
}

export function clearAllAuthClientState() {
  clearAuthStorage();
  clearAuthSession();
}

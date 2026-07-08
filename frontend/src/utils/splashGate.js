export const SPLASH_STORAGE_KEY = "mgrm_splash_seen";
export const SPLASH_REPLAY_EVENT = "mgrm-splash-replay";

export function isSplashSeen() {
  try {
    return sessionStorage.getItem(SPLASH_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markSplashSeen() {
  try {
    sessionStorage.setItem(SPLASH_STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearSplashSeen() {
  try {
    sessionStorage.removeItem(SPLASH_STORAGE_KEY);
    localStorage.removeItem(SPLASH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function requestSplashReplay() {
  clearSplashSeen();
  window.dispatchEvent(new CustomEvent(SPLASH_REPLAY_EVENT));
}

export function clearSplashPending() {
  document.documentElement.classList.remove("splash-pending");
  document.body.style.overflow = "";
}

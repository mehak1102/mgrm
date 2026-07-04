export const SPLASH_STORAGE_KEY = "mgrm_splash_seen";

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

export function clearSplashPending() {
  document.documentElement.classList.remove("splash-pending");
  document.body.style.overflow = "";
}

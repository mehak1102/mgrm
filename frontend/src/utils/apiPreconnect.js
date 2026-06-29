export function preconnectApi() {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl || typeof document === "undefined") return;

  try {
    const origin = new URL(apiUrl).origin;
    if (document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) return;

    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  } catch {
    // Ignore invalid API URL.
  }
}

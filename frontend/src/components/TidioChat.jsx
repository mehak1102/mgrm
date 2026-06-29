import { useEffect } from "react";

const DEFAULT_TIDIO_SRC =
  "//code.tidio.co/gwubyscacg2xxkq5hgjtpmmzavua5rbq.js";

function positionTidioWidget() {
  const api = window.tidioChatApi;
  if (!api?.adjustStyles) return;

  // Sit left of the WhatsApp / logo floating stack (FloatingHelp).
  api.adjustStyles(
    "#tidio { right: 5.75rem !important; bottom: 1.5rem !important; }"
  );
  api.adjustStyles(
    "@media only screen and (max-width: 640px) { #tidio { right: 1rem !important; bottom: 5.5rem !important; } }"
  );
}

function onTidioReady() {
  positionTidioWidget();
}

function bindTidioReady() {
  if (window.tidioChatApi) {
    window.tidioChatApi.on("ready", onTidioReady);
    onTidioReady();
    return;
  }

  document.addEventListener("tidioChat-ready", onTidioReady, { once: true });
}

export default function TidioChat() {
  useEffect(() => {
    if (window.__mgrmTidioInit) {
      bindTidioReady();
      return;
    }
    window.__mgrmTidioInit = true;

    const src =
      import.meta.env.VITE_TIDIO_EMBED_SRC?.trim() || DEFAULT_TIDIO_SRC;

    if (
      document.querySelector(`script[src="${src}"]`) ||
      document.querySelector('script[src*="code.tidio.co"]')
    ) {
      bindTidioReady();
      return;
    }

    bindTidioReady();

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}

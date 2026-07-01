import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, MessageCircle, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  copyProductLink,
  getWhatsAppShareUrl,
  shareProductNative,
} from "../../utils/shareProduct";

export default function ProductShareButton({ product, compact = false }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const handleNativeShare = async () => {
    try {
      const result = await shareProductNative(product);
      if (result === "shared") toast.success(t("global.thanksSharing"));
      setOpen(false);
    } catch {
      /* handled in util */
    }
  };

  const handleCopy = async () => {
    try {
      await copyProductLink(product);
      setOpen(false);
    } catch {
      toast.error(t("global.copyFailed"));
    }
  };

  const whatsappUrl = getWhatsAppShareUrl(product);

  return (
    <div ref={rootRef} className="product-share relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`product-share__trigger ${compact ? "product-share__trigger--compact" : ""}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Share ${product?.name || "product"}`}
      >
        <Share2 size={compact ? 18 : 19} aria-hidden />
        {!compact ? <span>Share</span> : null}
      </button>

      {open ? (
        <div className="product-share__menu" role="menu">
          <button
            type="button"
            role="menuitem"
            className="product-share__menu-item"
            onClick={handleNativeShare}
          >
            <Share2 size={16} aria-hidden />
            Share product
          </button>
          <a
            role="menuitem"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="product-share__menu-item"
            onClick={() => setOpen(false)}
          >
            <MessageCircle size={16} aria-hidden />
            {t("global.whatsapp")}
          </a>
          <button
            type="button"
            role="menuitem"
            className="product-share__menu-item"
            onClick={handleCopy}
          >
            <Copy size={16} aria-hidden />
            Copy link
          </button>
        </div>
      ) : null}
    </div>
  );
}

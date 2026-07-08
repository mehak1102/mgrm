import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Plus } from "lucide-react";
import API from "../../api";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { productPriceSaleProps } from "../../utils/productPriceStyle";

const BUNDLE_DISCOUNT_RATE = 0.05;

export default function FrequentlyBoughtTogether({ productId, primaryProduct }) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isBlue } = useTheme();
  const [paired, setPaired] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    let ignore = false;
    setLoading(true);
    API.get(`/recommendations/product/${productId}/also-bought?limit=4`)
      .then((res) => {
        if (ignore) return;
        const list = (res.data.products || []).filter((p) => p._id !== productId);
        setPaired(list[0] || null);
      })
      .catch(() => {
        if (!ignore) setPaired(null);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [productId]);

  if (loading || !paired || !primaryProduct) return null;

  const primaryPrice = Number(primaryProduct.discountPrice || primaryProduct.price || 0);
  const pairedPrice = Number(paired.discountPrice || paired.price || 0);
  const combined = primaryPrice + pairedPrice;
  const savings = Math.floor(combined * BUNDLE_DISCOUNT_RATE);
  const bundleTotal = combined - savings;

  const addBundle = () => {
    addToCart(primaryProduct, 1);
    addToCart(paired, 1);
    sessionStorage.setItem("mgrm_bundle_discount", String(savings));
    sessionStorage.setItem("mgrm_bundle_pair", JSON.stringify([productId, paired._id]));
  };

  return (
    <section className="mt-10 rounded-[28px] border border-edge bg-card p-5 sm:p-6 shadow-theme-md">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-brand mb-1">
        {t("productDetail.bundleBadge")}
      </p>
      <h2 className="text-2xl font-black text-fg">{t("productDetail.bundleTitle")}</h2>
      <p className="text-sm text-fg-muted mt-1">{t("productDetail.bundleCopy")}</p>

      <div className="mt-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={primaryProduct.images?.[0] || "/products/knee.png"}
            alt={primaryProduct.name}
            className="w-20 h-20 rounded-xl object-contain bg-app-muted p-2 shrink-0"
          />
          <Plus size={18} className="text-fg-muted shrink-0" />
          <img
            src={paired.images?.[0] || "/products/knee.png"}
            alt={paired.name}
            className="w-20 h-20 rounded-xl object-contain bg-app-muted p-2 shrink-0"
          />
        </div>

        <div className="text-center sm:text-right shrink-0">
          <p className="text-xs text-fg-muted line-through">₹{combined}</p>
          <p {...productPriceSaleProps(isBlue, "text-2xl font-black")}>₹{bundleTotal}</p>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {t("productDetail.bundleSavings", { amount: savings })}
          </p>
        </div>
      </div>

      <div className="mt-5 flex justify-start">
        <button
          type="button"
          onClick={addBundle}
          className="inline-flex items-center justify-center gap-2 btn-primary rounded-xl px-5 py-2.5 text-sm font-black"
        >
          <ShoppingCart size={16} />
          {t("productDetail.bundleCta")}
        </button>
      </div>
    </section>
  );
}

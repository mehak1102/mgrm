import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  X,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import FloatingMedicalBg from "./FloatingMedicalBg";
import { useTheme } from "../context/ThemeContext";
import { productPriceSaleProps } from "../utils/productPriceStyle";

export default function CartDrawer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isBlue } = useTheme();
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQty,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useCart();

  const shipping = cartTotal >= 499 || cartTotal === 0 ? 0 : 49;
  const grandTotal = cartTotal + shipping;

  const closeAndGo = (path) => {
    setCartOpen(false);
    navigate(path);
  };

  return (
    <>
      {cartOpen && (
        <div className="fixed inset-0 z-[999]">
          <div
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />

          <aside className="cart-drawer-panel absolute right-0 top-0 h-full bg-[#f6f7fb] bg-app dark:bg-zinc-950 shadow-2xl overflow-hidden">
            <FloatingMedicalBg />

            <div className="relative z-10 h-full flex flex-col">
              <div className="bg-white/90 bg-card/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-purple-700 font-black tracking-widest text-xs">
                    {t("cart.shoppingBag")}
                  </p>
                  <h2 className="text-3xl font-black">{t("cart.yourCart")}</h2>
                  <p className="text-gray-500 dark:text-zinc-400 text-sm">
                    {t("common.itemsCount", { count: cartCount })}
                  </p>
                </div>

                <button
                  onClick={() => setCartOpen(false)}
                  className="w-11 h-11 rounded-full bg-slate-100 bg-surface-hover grid place-items-center hover:bg-slate-200 transition"
                >
                  <X />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 grid place-items-center px-6">
                  <div className="bg-white/90 bg-card/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[34px] p-9 text-center shadow-[0_25px_80px_rgba(15,23,42,0.10)] border border-white">
                    <div className="w-20 h-20 mx-auto rounded-full bg-purple-50 text-purple-700 grid place-items-center">
                      <ShoppingCart size={38} />
                    </div>

                    <h3 className="text-3xl font-black mt-5">{t("cart.emptyTitle")}</h3>
                    <p className="text-gray-500 dark:text-zinc-400 mt-2">
                      {t("cart.emptyCopy")}
                    </p>

                    <button
                      onClick={() => closeAndGo("/shop")}
                      className="mt-7 inline-flex items-center gap-2 bg-purple-700 text-white px-7 py-4 rounded-full font-black hover:bg-purple-800 transition"
                    >
                      {t("common.browseProducts")} <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                    {cart.map((item) => {
                      const maxStock = Number(item.stock || 10);
                      const price = Number(item.discountPrice || item.price || 0);

                      return (
                        <div
                          key={`${item._id}-${item.selectedSize || "default"}`}
                          className="bg-app dark:bg-zinc-950/95 backdrop-blur rounded-[28px] p-4 shadow-[0_18px_55px_rgba(15,23,42,0.08)] border border-white"
                        >
                          <div className="flex gap-4">
                            <Link
                              to={`/product/${item.slug}`}
                              onClick={() => setCartOpen(false)}
                              className="w-24 h-24 rounded-2xl bg-slate-50 bg-card overflow-hidden shrink-0"
                            >
                              <img
                                src={item.image || item.images?.[0] || "/products/knee.png"}
                                onError={(e) => {
                                  e.currentTarget.src = "/products/knee.png";
                                }}
                                className="w-full h-full object-cover"
                                alt={item.name}
                              />
                            </Link>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between gap-3">
                                <Link
                                  to={`/product/${item.slug}`}
                                  onClick={() => setCartOpen(false)}
                                  className="font-black line-clamp-2 hover:text-purple-700 transition"
                                >
                                  {item.name}
                                </Link>

                                <button
                                  onClick={() =>
                                    removeFromCart(item._id, item.selectedSize)
                                  }
                                  className="text-red-500 bg-red-50 rounded-xl w-9 h-9 grid place-items-center shrink-0"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                                {item.category || t("common.supportProduct")}
                                {item.selectedSize ? ` • ${t("common.size")} ${item.selectedSize}` : ""}
                              </p>

                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center bg-slate-100 bg-surface-hover rounded-xl overflow-hidden">
                                  <button
                                    onClick={() =>
                                      updateQty(
                                        item._id,
                                        item.selectedSize,
                                        Math.max(1, item.qty - 1)
                                      )
                                    }
                                    className="w-10 h-10 grid place-items-center disabled:opacity-40"
                                    disabled={item.qty <= 1}
                                  >
                                    <Minus size={15} />
                                  </button>

                                  <span className="w-10 text-center font-black">
                                    {item.qty}
                                  </span>

                                  <button
                                    onClick={() =>
                                      updateQty(
                                        item._id,
                                        item.selectedSize,
                                        Math.min(maxStock, item.qty + 1)
                                      )
                                    }
                                    disabled={item.qty >= maxStock}
                                    className="w-10 h-10 grid place-items-center disabled:opacity-40"
                                  >
                                    <Plus size={15} />
                                  </button>
                                </div>

                                <div className="text-right">
                                  <p className="text-xs text-gray-500 dark:text-zinc-400/80">
                                    ₹{price} × {item.qty}
                                  </p>
                                  <p
                                    {...productPriceSaleProps(isBlue, "font-black text-lg")}
                                  >
                                    ₹{price * item.qty}
                                  </p>
                                </div>
                              </div>

                              {item.qty >= maxStock && (
                                <p className="text-xs text-red-500 font-bold mt-2">
                                  {t("cart.maxStock")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-app dark:bg-zinc-950/95 backdrop-blur-xl border-t px-6 py-5">
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        [t("cart.certified"), ShieldCheck],
                        [t("cart.fastShip"), Truck],
                        [t("cart.premium"), Sparkles],
                      ].map(([text, Icon]) => (
                        <div
                          key={text}
                          className="bg-slate-50 bg-card dark:bg-zinc-900 rounded-2xl p-3 text-center"
                        >
                          <Icon
                            size={19}
                            className="mx-auto text-purple-700"
                          />
                          <p className="text-xs font-black mt-1">{text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-zinc-400">{t("common.subtotal")}</span>
                        <b {...productPriceSaleProps(isBlue)}>₹{cartTotal}</b>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-zinc-400">{t("common.shipping")}</span>
                        <b>{shipping === 0 ? t("common.free") : `₹${shipping}`}</b>
                      </div>

                      {cartTotal > 0 && cartTotal < 499 && (
                        <p className="text-xs text-purple-700 font-bold bg-purple-50 rounded-xl p-3">
                          {t("cart.freeShippingNudge", { amount: 499 - cartTotal })}
                        </p>
                      )}

                      <div className="border-t pt-3 flex justify-between text-xl">
                        <span className="font-black">{t("common.total")}</span>
                        <span
                          {...productPriceSaleProps(isBlue, "font-black text-purple-700")}
                        >
                          ₹{grandTotal}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => closeAndGo("/checkout")}
                      className="mt-5 w-full bg-purple-700 text-white py-4 rounded-2xl font-black hover:bg-purple-800 transition flex items-center justify-center gap-2"
                    >
                      {t("common.checkout")} <ArrowRight size={18} />
                    </button>

                    <button
                      onClick={() => closeAndGo("/shop")}
                      className="mt-3 w-full bg-slate-100 bg-surface-hover text-slate-900 dark:text-zinc-100 py-4 rounded-2xl font-black hover:bg-slate-200 transition"
                    >
                      {t("common.continueShopping")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
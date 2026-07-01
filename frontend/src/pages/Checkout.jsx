import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CreditCard, MapPin, ShieldCheck } from "lucide-react";
import API from "../api";
import { useCart } from "../context/CartContext";
import FloatingMedicalBg from "../components/FloatingMedicalBg";
import { useTheme } from "../context/ThemeContext";
import { productPriceSaleProps } from "../utils/productPriceStyle";
import DeliveryTrustBadge from "../components/DeliveryTrustBadge";
import { loadRazorpay } from "../utils/loadRazorpay";
import toast from "react-hot-toast";
import {
  SectionLabel,
  SectionHeading,
  FadeUpText,
} from "../components/typography/TypographyMotion";

const inputClass =
  "theme-panel w-full rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/35 dark:focus:ring-cyan-500/35";

const sectionCard =
  "bg-card dark:bg-zinc-900/95 dark:border dark:border-white/10 rounded-[34px] p-7 shadow-theme-md dark:shadow-[0_25px_80px_rgba(0,0,0,0.4)] transition-colors duration-300";

const iconWrap =
  "w-12 h-12 shrink-0 rounded-2xl grid place-items-center bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)] text-brand dark:bg-cyan-950/50 dark:text-cyan-400";

const cartLineClass =
  "flex items-center gap-3 rounded-2xl p-3 border border-edge bg-app-muted dark:bg-zinc-800/80 dark:border-white/10";

const paymentOptionClass =
  "flex items-center gap-3 p-4 rounded-2xl border border-edge dark:border-white/10 bg-card dark:bg-zinc-800/60 cursor-pointer text-fg transition-colors hover:border-[var(--accent-primary)]/30 dark:hover:border-cyan-500/30";

export default function Checkout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cart, cartTotal, clearCart } = useCart();
  const { isBlue } = useTheme();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const shipping = cartTotal >= 499 || cartTotal === 0 ? 0 : 49;
  const grandTotal = cartTotal + shipping;
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  const placeOrderAfterPayment = async (paymentData) => {
    const res = await API.post("/orders", {
      userName: form.name,
      userEmail: form.email,
      userPhone: form.phone,
      address: `${form.address}, ${form.city}, ${form.pincode}`,
      items: cart,
      total: grandTotal,
      paymentMethod,
      paymentStatus: "Paid",
      razorpayPaymentId: paymentData.razorpay_payment_id,
      razorpayOrderId: paymentData.razorpay_order_id,
    });

    localStorage.setItem("mgrm_last_order", JSON.stringify(res.data));

    toast.success(t("orders.successTitle"));
    clearCart();
    navigate("/order-success");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error(t("checkout.phoneInvalid"));
      return;
    }

    if (!/^[0-9]{6}$/.test(form.pincode)) {
      toast.error(t("checkout.pincodeInvalid"));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Enter a valid email address");
      return;
    }

    if (paymentMethod === "COD") {
      const res = await API.post("/orders", {
        userName: form.name,
        userEmail: form.email,
        userPhone: form.phone,
        address: `${form.address}, ${form.city}, ${form.pincode}`,
        items: cart,
        total: grandTotal,
        paymentMethod: "COD",
        paymentStatus: "Pending",
      });

      localStorage.setItem("mgrm_last_order", JSON.stringify(res.data));

      toast.success(t("orders.successTitle"));

      clearCart();
      navigate("/order-success");
      return;
    }

    if (!cart.length) {
      alert(t("checkout.cartEmpty"));
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        alert("Razorpay SDK failed to load");
        setLoading(false);
        return;
      }

      const orderRes = await API.post("/payment/create-order", {
        amount: grandTotal,
      });

      const { key, orderId, amount, currency } = orderRes.data;

      const options = {
        key,
        amount,
        currency,
        name: "MGRM Medicare",
        description: t("productDetail.medicalSupport"),
        order_id: orderId,

        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },

        notes: {
          address: `${form.address}, ${form.city}, ${form.pincode}`,
        },

        theme: {
          color: "#6d28d9",
        },

        handler: async function (response) {
          const verifyRes = await API.post("/payment/verify", response);

          if (verifyRes.data.success) {
            await placeOrderAfterPayment(response);
          } else {
            alert(t("checkout.paymentFailed"));
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.response?.data?.msg || t("checkout.paymentFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page relative min-h-screen bg-app-gradient dark:bg-zinc-950 overflow-hidden transition-colors duration-300">
      <FloatingMedicalBg />

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-12">
        <div className="mb-10">
          <SectionLabel className="theme-text text-sm font-black tracking-widest uppercase">
            {t("checkout.badge")}
          </SectionLabel>
          <SectionHeading
            text={t("checkout.title")}
            as="h1"
            className="checkout-page-heading text-5xl font-black mt-2 text-fg"
          />
          <FadeUpText className="text-fg-muted mt-2">
            {t("checkout.subtitle")}
          </FadeUpText>
        </div>

        <form onSubmit={handlePayment} className="grid lg:grid-cols-[1fr_420px] gap-8">
          <section className={sectionCard}>
            <div className="flex items-center gap-3 mb-6">
              <div className={iconWrap}>
                <MapPin />
              </div>
              <div>
                <h2 className="text-3xl font-black text-fg">{t("checkout.deliveryDetails")}</h2>
                <p className="text-fg-muted">{t("checkout.deliveryCopy")}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder={t("checkout.fullName")}
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                  })
                }
                className={inputClass}
              />

              <input
                required
                type="tel"
                placeholder={t("checkout.phoneNumber")}
                maxLength={10}
                pattern="[0-9]{10}"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
                className={inputClass}
              />

              <input
                required
                type="email"
                placeholder={t("checkout.emailAddress")}
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className={inputClass}
              />

              <input
                required
                type="text"
                placeholder={t("checkout.city")}
                value={form.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    city: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                  })
                }
                className={inputClass}
              />

              <input
                required
                type="text"
                placeholder={t("checkout.pincode")}
                maxLength={6}
                pattern="[0-9]{6}"
                value={form.pincode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                  })
                }
                className={inputClass}
              />

              <textarea
                required
                placeholder={t("checkout.fullAddress")}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={`${inputClass} md:col-span-2 min-h-32 resize-y`}
              />
            </div>
          </section>

          <aside className={`${sectionCard} h-fit sticky top-24`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={iconWrap}>
                <CreditCard />
              </div>
              <div>
                <h2 className="text-3xl font-black text-fg">{t("checkout.orderSummary")}</h2>
                <p className="text-fg-muted">{t("checkout.productsCount", { count: cart.length })}</p>
              </div>
            </div>

            <div className="grid gap-4 max-h-[320px] overflow-auto pr-1">
              {cart.map((item) => (
                <div key={`${item._id}-${item.selectedSize}`} className={cartLineClass}>
                  <img
                    src={item.image || "/products/knee.png"}
                    onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                    className="w-16 h-16 rounded-xl object-cover bg-card dark:bg-zinc-700"
                    alt={item.name}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm line-clamp-1 text-fg">{item.name}</p>
                    <p className="text-xs text-fg-muted">
                      {t("common.qty")} {item.qty} {item.selectedSize ? `• ${item.selectedSize}` : ""}
                    </p>
                  </div>

                  <b
                    {...productPriceSaleProps(isBlue, "text-fg shrink-0")}
                  >
                    ₹{Number(item.discountPrice || item.price || 0) * Number(item.qty || 1)}
                  </b>
                </div>
              ))}
            </div>

            <DeliveryTrustBadge seed="checkout-summary" className="mt-5" />

            <div className="border-t border-edge dark:border-white/10 mt-6 pt-5 space-y-3">
              <div className="flex justify-between text-fg-muted">
                <span>{t("common.subtotal")}</span>
                <b {...productPriceSaleProps(isBlue, "text-fg")}>₹{cartTotal}</b>
              </div>

              <div className="flex justify-between text-fg-muted">
                <span>{t("common.shipping")}</span>
                <b className="text-fg">{shipping === 0 ? t("common.free") : `₹${shipping}`}</b>
              </div>

              <div className="border-t border-edge dark:border-white/10 pt-4 flex justify-between text-2xl">
                <span className="font-black text-fg">{t("common.total")}</span>
                <span {...productPriceSaleProps(isBlue, "font-black theme-text")}>
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl p-4 flex gap-3 font-bold text-sm bg-emerald-50 text-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
              <ShieldCheck size={20} className="shrink-0" />
              {t("checkout.razorpayNote")}
            </div>

            <div className="mt-5 space-y-3">
              <label className={paymentOptionClass}>
                <input
                  type="radio"
                  name="payment"
                  value="Razorpay"
                  checked={paymentMethod === "Razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-[var(--accent-primary)]"
                />
                <span className="font-bold">{t("checkout.payOnline")}</span>
              </label>

              <label className={paymentOptionClass}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-[var(--accent-primary)]"
                />
                <span className="font-bold">{t("checkout.cod")}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="btn-primary w-full mt-5 rounded-2xl py-4 font-black transition disabled:opacity-60"
            >
              {loading
                ? t("common.processing")
                : paymentMethod === "COD"
                  ? t("checkout.placeOrder")
                  : t("checkout.payAmount", { amount: grandTotal })}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}

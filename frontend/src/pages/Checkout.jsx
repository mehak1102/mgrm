import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, ShieldCheck } from "lucide-react";
import API from "../api";
import { useCart } from "../context/CartContext";
import FloatingMedicalBg from "../components/FloatingMedicalBg";
import { loadRazorpay } from "../utils/loadRazorpay";
import toast from "react-hot-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();

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
  
    localStorage.setItem(
      "mgrm_last_order",
      JSON.stringify(res.data)
    );
  
    toast.success("Order placed successfully");
    clearCart();
    navigate("/order-success");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    
    if (!/^[0-9]{6}$/.test(form.pincode)) {
      toast.error("Pincode must be 6 digits");
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
    
      localStorage.setItem(
        "mgrm_last_order",
        JSON.stringify(res.data)
      );
    
      toast.success("Order placed successfully");
    
      clearCart();
      navigate("/order-success");
      return;
    }
   

    if (!cart.length) {
      alert("Cart is empty");
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
        description: "Medical support products",
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
            alert("Payment verification failed");
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
      // alert(err.response?.data?.msg || "Payment failed");
      toast.error(err.response?.data?.msg || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#f6f7fb] dark:bg-zinc-950 overflow-hidden">
      <FloatingMedicalBg />

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-12">
        <div className="mb-10">
          <p className="text-purple-700 font-black tracking-widest text-sm">
            SECURE CHECKOUT
          </p>
          <h1 className="text-5xl font-black mt-2">Checkout</h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-2">
            Pay safely using Razorpay.
          </p>
        </div>

        <form onSubmit={handlePayment} className="grid lg:grid-cols-[1fr_420px] gap-8">
          <section className="bg-white dark:bg-zinc-900 rounded-[34px] p-7 shadow-[0_25px_80px_rgba(15,23,42,0.09)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-2xl grid place-items-center">
                <MapPin />
              </div>
              <div>
                <h2 className="text-3xl font-black">Delivery Details</h2>
                <p className="text-gray-500 dark:text-zinc-400">Enter customer and address details.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* <input
                required
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500"
              /> */}
              <input
  required
  type="text"
  placeholder="Full Name"
  value={form.name}
  onChange={(e) =>
    setForm({
      ...form,
      name: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
    })
  }
  className="bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500"
/>

              {/* <input
                required
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500"
              /> */}
              <input
  required
  type="tel"
  placeholder="Phone Number"
  maxLength={10}
  pattern="[0-9]{10}"
  value={form.phone}
  onChange={(e) =>
    setForm({
      ...form,
      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
    })
  }
  className="bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500"
/>

              {/* <input
                required
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500"
              /> */}
              <input
  required
  type="email"
  placeholder="Email Address"
  value={form.email}
  onChange={(e) =>
    setForm({
      ...form,
      email: e.target.value,
    })
  }
  className="bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500"
/>

              {/* <input
                required
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500"
              /> */}
              <input
  required
  type="text"
  placeholder="City"
  value={form.city}
  onChange={(e) =>
    setForm({
      ...form,
      city: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
    })
  }
  className="bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500"
/>

<input
  required
  type="text"
  placeholder="Pincode"
  maxLength={6}
  pattern="[0-9]{6}"
  value={form.pincode}
  onChange={(e) =>
    setForm({
      ...form,
      pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
    })
  }
  className="bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500"
/>

              <textarea
                required
                placeholder="Full Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="md:col-span-2 bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500 min-h-32"
              />
            </div>
          </section>

          <aside className="bg-white dark:bg-zinc-900 rounded-[34px] p-7 shadow-[0_25px_80px_rgba(15,23,42,0.09)] h-fit sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-2xl grid place-items-center">
                <CreditCard />
              </div>
              <div>
                <h2 className="text-3xl font-black">Order Summary</h2>
                <p className="text-gray-500 dark:text-zinc-400">{cart.length} products</p>
              </div>
            </div>

            <div className="grid gap-4 max-h-[320px] overflow-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item._id}-${item.selectedSize}`}
                  className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900 rounded-2xl p-3"
                >
                  <img
                    src={item.image || "/products/knee.png"}
                    onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                    className="w-16 h-16 rounded-xl object-cover bg-white dark:bg-zinc-900"
                    alt={item.name}
                  />

                  <div className="flex-1">
                    <p className="font-black text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      Qty: {item.qty} {item.selectedSize ? `• ${item.selectedSize}` : ""}
                    </p>
                  </div>

                  <b>₹{Number(item.discountPrice || item.price || 0) * Number(item.qty || 1)}</b>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-5 space-y-3">
              <div className="flex justify-between text-gray-500 dark:text-zinc-400">
                <span>Subtotal</span>
                <b className="text-slate-900 dark:text-zinc-100">₹{cartTotal}</b>
              </div>

              <div className="flex justify-between text-gray-500 dark:text-zinc-400">
                <span>Shipping</span>
                <b className="text-slate-900 dark:text-zinc-100">{shipping === 0 ? "Free" : `₹${shipping}`}</b>
              </div>

              <div className="border-t pt-4 flex justify-between text-2xl">
                <span className="font-black">Total</span>
                <span className="font-black text-purple-700">₹{grandTotal}</span>
              </div>
            </div>

            <div className="mt-5 bg-green-50 text-green-700 rounded-2xl p-4 flex gap-3 font-bold text-sm">
              <ShieldCheck size={20} />
              Razorpay secure payment enabled.
            </div>

            <div className="mt-5 space-y-3">
  <label className="flex items-center gap-3 p-4 rounded-2xl border cursor-pointer">
    <input
      type="radio"
      name="payment"
      value="Razorpay"
      checked={paymentMethod === "Razorpay"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <span className="font-bold">Pay Online (Razorpay)</span>
  </label>

  <label className="flex items-center gap-3 p-4 rounded-2xl border cursor-pointer">
    <input
      type="radio"
      name="payment"
      value="COD"
      checked={paymentMethod === "COD"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <span className="font-bold">Cash on Delivery (COD)</span>
  </label>
</div>

            <button
              disabled={loading || cart.length === 0}
              className="w-full mt-5 bg-purple-700 text-white rounded-2xl py-4 font-black hover:bg-purple-800 transition disabled:opacity-60"
            >
              {/* {loading ? "Processing..." : `Pay ₹${grandTotal}`}
               */}
               {loading
  ? "Processing..."
  : paymentMethod === "COD"
  ? "Place Order"
  : `Pay ₹${grandTotal}`}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}
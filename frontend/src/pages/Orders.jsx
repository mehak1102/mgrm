import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import API from "../api";
import FloatingMedicalBg from "../components/FloatingMedicalBg";

const statusStyle = {
  Placed:
    "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80 dark:bg-blue-500/20 dark:text-blue-300 dark:ring-blue-400/40",
  Packed:
    "bg-amber-50 text-amber-800 ring-1 ring-amber-200/80 dark:bg-amber-500/20 dark:text-amber-300 dark:ring-amber-400/40",
  Shipped:
    "bg-purple-50 text-purple-700 ring-1 ring-purple-200/80 dark:bg-purple-500/20 dark:text-purple-300 dark:ring-purple-400/40",
  Delivered:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80 dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-400/40",
  Cancelled:
    "bg-red-50 text-red-700 ring-1 ring-red-200/80 dark:bg-red-500/20 dark:text-red-300 dark:ring-red-400/40",
};

const statusIcon = {
  Placed: Clock,
  Packed: Package,
  Shipped: Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle,
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#f6f7fb] dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <FloatingMedicalBg />

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-12">
        <section className="mb-10">
          <p className="text-purple-700 font-black tracking-widest text-sm">
            PURCHASE HISTORY
          </p>
          <h1 className="text-5xl font-black mt-2 text-slate-900 dark:text-white">My Orders</h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-2">
            Track your orders, items, payment amount and delivery status.
          </p>
        </section>

        {loading ? (
          <div className="grid gap-5">
            {[1, 2, 3].map((x) => (
              <div
                key={x}
                className="h-40 bg-white dark:bg-zinc-900 rounded-[30px] animate-pulse shadow"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-[34px] p-12 text-center shadow-[0_25px_80px_rgba(15,23,42,0.09)]">
            <ShoppingBag className="mx-auto text-purple-500" size={56} />
            <h2 className="text-3xl font-black mt-4">No orders yet</h2>
            <p className="text-gray-500 dark:text-zinc-400 mt-2">
              Start shopping and your orders will appear here.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-6 bg-purple-700 text-white px-7 py-4 rounded-full font-black hover:bg-purple-800 transition"
            >
              Browse Products <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              const StatusIcon = statusIcon[order.status] || Clock;

              return (
                <article
                  key={order._id}
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[34px] p-6 md:p-7 shadow-[0_25px_80px_rgba(15,23,42,0.09)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.35)] border border-white dark:border-white/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 border-b pb-5">
                    <div>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold">
                        ORDER ID
                      </p>
                      <h2 className="text-xl md:text-2xl font-black mt-1 text-slate-900 dark:text-white">
                        #{order._id}
                      </h2>

                      <p className="text-gray-500 dark:text-zinc-400 mt-2 text-sm">
                        {new Date(order.createdAt || Date.now()).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm ${
                          statusStyle[order.status] ||
                          "bg-gray-100 text-gray-700 ring-1 ring-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:ring-white/10"
                        }`}
                      >
                        <StatusIcon size={17} />
                        {order.status || "Placed"}
                      </span>

                      <span className="bg-slate-950 text-white px-5 py-2 rounded-full font-black">
                        ₹{order.total || 0}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 mt-5">
                    {order.items?.map((item, index) => (
                      <div
                        key={`${item._id || item.name}-${item.selectedSize || index}`}
                        className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 rounded-3xl p-4 border border-transparent dark:border-white/5"
                      >
                        <img
                          src={item.image || item.images?.[0] || "/products/knee.png"}
                          onError={(e) => {
                            e.currentTarget.src = "/products/knee.png";
                          }}
                          className="w-20 h-20 rounded-2xl object-cover bg-white dark:bg-zinc-900"
                          alt={item.name}
                        />

                        <div className="flex-1">
                          <h3 className="font-black text-slate-900 dark:text-white">{item.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                            Qty: {item.qty}{" "}
                            {item.selectedSize ? `• Size: ${item.selectedSize}` : ""}
                          </p>
                        </div>

                        <p className="font-black">
                          ₹{Number(item.discountPrice || item.price || 0) * Number(item.qty || 1)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid md:grid-cols-3 gap-4">
                    <div className="rounded-3xl bg-purple-50 dark:bg-purple-500/15 border border-purple-100 dark:border-purple-400/20 p-5 transition-colors duration-300">
                      <p className="text-sm text-purple-700 dark:text-purple-300 font-black">
                        CUSTOMER
                      </p>
                      <p className="font-black mt-1 text-slate-900 dark:text-white">
                        {order.userName || "Customer"}
                      </p>
                      <p className="text-gray-500 dark:text-zinc-400 text-sm">
                        {order.userEmail || "No email"}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-cyan-50 dark:bg-cyan-500/15 border border-cyan-100 dark:border-cyan-400/20 p-5 transition-colors duration-300">
                      <p className="text-sm text-cyan-700 dark:text-cyan-300 font-black">
                        PAYMENT
                      </p>
                      <p className="font-black mt-1 text-slate-900 dark:text-white">
                        {order.paymentMethod || "Cash / Manual"}
                      </p>
                      <p className="text-gray-500 dark:text-zinc-400 text-sm">
                        Total paid: ₹{order.total || 0}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-green-50 dark:bg-emerald-500/15 border border-green-100 dark:border-emerald-400/20 p-5 transition-colors duration-300">
                      <p className="text-sm text-green-700 dark:text-emerald-300 font-black">
                        DELIVERY
                      </p>
                      <p className="font-black mt-1 text-slate-900 dark:text-white">
                        {order.status === "Delivered"
                          ? "Delivered"
                          : "In progress"}
                      </p>
                      <p className="text-gray-500 dark:text-zinc-400 text-sm">
                        We will update status soon.
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
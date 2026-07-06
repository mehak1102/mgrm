import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  MapPin,
  CreditCard,
} from "lucide-react";
import API from "../../api";

const STATUS_STEPS = ["Placed", "Packed", "Shipped", "Delivered"];

const statusConfig = {
  Placed: { icon: Clock, chip: "bg-blue-500/15 text-blue-600 dark:text-blue-300 ring-blue-500/25", dot: "bg-blue-500" },
  Packed: { icon: Package, chip: "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-amber-500/25", dot: "bg-amber-500" },
  Shipped: { icon: Truck, chip: "bg-purple-500/15 text-purple-700 dark:text-purple-300 ring-purple-500/25", dot: "bg-purple-500" },
  Delivered: { icon: CheckCircle2, chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-500/25", dot: "bg-emerald-500" },
  Cancelled: { icon: XCircle, chip: "bg-red-500/15 text-red-600 dark:text-red-300 ring-red-500/25", dot: "bg-red-500" },
};

const FILTERS = ["all", "active", "delivered", "cancelled"];

function resolveProductPath(item, slugById) {
  if (item.slug) return `/product/${item.slug}`;
  const id = item._id || item.productId;
  if (id && slugById?.[id]) return `/product/${slugById[id]}`;
  return null;
}

function downloadInvoice(order, t) {
  const itemsHtml = (order.items || [])
    .map(
      (item) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
         <td style="padding:8px;border-bottom:1px solid #eee">${item.qty || 1}</td>
         <td style="padding:8px;border-bottom:1px solid #eee">₹${Number(item.discountPrice || item.price || 0) * Number(item.qty || 1)}</td></tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><head><title>Invoice</title></head>
  <body style="font-family:sans-serif;padding:40px;max-width:640px;margin:0 auto">
    <h1 style="margin:0 0 4px">MGRM Medicare</h1>
    <p style="color:#666;margin:0 0 24px">${t("orders.invoice")}</p>
    <p><strong>${t("orders.orderId")}:</strong> #${order._id.slice(-6).toUpperCase()}</p>
    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0">
      <thead><tr style="background:#f8fafc">
        <th style="padding:8px;text-align:left">${t("common.product")}</th>
        <th style="padding:8px;text-align:left">${t("common.qty")}</th>
        <th style="padding:8px;text-align:left">${t("common.total")}</th>
      </tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <p style="font-size:20px;font-weight:bold">₹${order.total}</p>
  </body></html>`;

  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  w.print();
}

function StatusTimeline({ status, dt }) {
  if (status === "Cancelled") return null;
  const currentIdx = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0 mt-4">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        const cfg = statusConfig[step];

        return (
          <div key={step} className="flex items-center flex-1 min-w-0 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`w-7 h-7 rounded-full grid place-items-center ring-2 transition-all ${
                  done
                    ? `${cfg.dot} ring-transparent text-white`
                    : `ring-slate-300/60 dark:ring-white/20 ${dt.chip} bg-transparent`
                }`}
              >
                {done && <cfg.icon size={13} strokeWidth={2.5} />}
              </div>
              <span
                className={`text-[9px] font-bold uppercase tracking-wide text-center leading-tight ${
                  active ? dt.stat : dt.muted
                }`}
              >
                {step}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 mb-4 rounded-full transition-colors ${
                  i < currentIdx ? cfg.dot : "bg-slate-200 dark:bg-white/15"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, dt, t, translateStatus, expanded, onToggle, onRoute, slugById }) {
  const cfg = statusConfig[order.status] || statusConfig.Placed;
  const StatusIcon = cfg.icon;
  const items = order.items || [];
  const previewItems = items.slice(0, 3);
  const extraCount = items.length - previewItems.length;

  const goToProduct = (e, item) => {
    e.stopPropagation();
    const path = resolveProductPath(item, slugById);
    if (path) onRoute(path);
  };

  return (
    <article className={`rounded-2xl overflow-hidden ${dt.chip} transition-shadow hover:shadow-md`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-4 sm:p-5"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`text-sm font-black tracking-tight ${dt.stat}`}>
                #{order._id.slice(-6).toUpperCase()}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ring-1 ${cfg.chip}`}
              >
                <StatusIcon size={12} strokeWidth={2.5} />
                {translateStatus(order.status)}
              </span>
            </div>
            <p className={`text-xs mt-1 ${dt.muted}`}>
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <p className={`text-lg font-black shrink-0 ${dt.stat}`}>₹{order.total?.toLocaleString("en-IN")}</p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3 mt-4">
            <div className="flex -space-x-2 shrink-0">
              {previewItems.map((item, i) => {
                const path = resolveProductPath(item, slugById);
                const thumb = (
                  <img
                    src={item.image || item.images?.[0] || "/products/knee.png"}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = "/products/knee.png";
                    }}
                    className={`w-10 h-10 rounded-xl object-cover border-2 border-white/80 dark:border-slate-800 shadow-sm ${
                      path ? "transition-transform group-hover:scale-105" : ""
                    }`}
                  />
                );

                return path ? (
                  <button
                    key={`${item._id || item.name}-${i}`}
                    type="button"
                    onClick={(e) => goToProduct(e, item)}
                    className="group relative z-[1] hover:z-10"
                    aria-label={item.name}
                  >
                    {thumb}
                  </button>
                ) : (
                  <div key={`${item._id || item.name}-${i}`}>{thumb}</div>
                );
              })}
              {extraCount > 0 && (
                <div
                  className={`w-10 h-10 rounded-xl grid place-items-center text-[10px] font-black border-2 border-white/80 dark:border-slate-800 ${dt.card}`}
                >
                  +{extraCount}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              {resolveProductPath(items[0], slugById) ? (
                <button
                  type="button"
                  onClick={(e) => goToProduct(e, items[0])}
                  className={`text-xs font-bold truncate text-left w-full ${dt.accent} hover:underline`}
                >
                  {items[0]?.name}
                  {items.length > 1 && (
                    <span className={`font-medium no-underline ${dt.muted}`}>
                      {" "}
                      {t("dashboard.orders.moreItems", { count: items.length - 1 })}
                    </span>
                  )}
                </button>
              ) : (
                <p className={`text-xs font-bold truncate ${dt.stat}`}>
                  {items[0]?.name}
                  {items.length > 1 && (
                    <span className={`font-medium ${dt.muted}`}>
                      {" "}
                      {t("dashboard.orders.moreItems", { count: items.length - 1 })}
                    </span>
                  )}
                </p>
              )}
              <p className={`text-[11px] ${dt.muted}`}>
                {t("dashboard.orders.itemCount", { count: items.reduce((s, it) => s + (it.qty || 1), 0) })}
              </p>
            </div>
            <span className={`shrink-0 ${dt.muted}`}>
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </span>
          </div>
        )}
      </button>

      {expanded && (
        <div className={`px-4 sm:px-5 pb-5 border-t border-slate-200/80 dark:border-white/10`}>
          <StatusTimeline status={order.status} dt={dt} />

          <div className="space-y-2 mt-4">
            {items.map((item, index) => {
              const path = resolveProductPath(item, slugById);
              const rowClass = `flex items-center gap-3 rounded-xl p-2.5 ${dt.card}${
                path ? " cursor-pointer transition-all hover:ring-2 hover:ring-indigo-300/40 dark:hover:ring-cyan-300/30" : ""
              }`;

              const content = (
                <>
                  <img
                    src={item.image || item.images?.[0] || "/products/knee.png"}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = "/products/knee.png";
                    }}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${path ? dt.accent : dt.stat}`}>{item.name}</p>
                    <p className={`text-[10px] ${dt.muted}`}>
                      {t("common.qty")} {item.qty || 1}
                      {item.selectedSize ? ` · ${t("common.size")} ${item.selectedSize}` : ""}
                    </p>
                  </div>
                  <p className={`text-xs font-black shrink-0 ${dt.stat}`}>
                    ₹{(Number(item.discountPrice || item.price || 0) * Number(item.qty || 1)).toLocaleString("en-IN")}
                  </p>
                </>
              );

              return path ? (
                <button
                  key={`${item._id || item.name}-${item.selectedSize || index}`}
                  type="button"
                  onClick={(e) => goToProduct(e, item)}
                  className={`w-full text-left ${rowClass}`}
                >
                  {content}
                </button>
              ) : (
                <div
                  key={`${item._id || item.name}-${item.selectedSize || index}`}
                  className={rowClass}
                >
                  {content}
                </div>
              );
            })}
          </div>

          <div className="grid sm:grid-cols-2 gap-2 mt-4">
            {order.address && (
              <div className={`rounded-xl p-3 flex gap-2.5 ${dt.card}`}>
                <MapPin size={14} className={`shrink-0 mt-0.5 ${dt.muted}`} />
                <div className="min-w-0">
                  <p className={`text-[10px] font-bold uppercase tracking-wide ${dt.muted}`}>
                    {t("orders.delivery")}
                  </p>
                  <p className={`text-xs mt-0.5 ${dt.stat}`}>{order.address}</p>
                </div>
              </div>
            )}
            <div className={`rounded-xl p-3 flex gap-2.5 ${dt.card}`}>
              <CreditCard size={14} className={`shrink-0 mt-0.5 ${dt.muted}`} />
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wide ${dt.muted}`}>
                  {t("orders.payment")}
                </p>
                <p className={`text-xs font-bold mt-0.5 ${dt.stat}`}>
                  {order.paymentMethod || "Razorpay"}
                </p>
                <p className={`text-[10px] ${dt.muted}`}>
                  {order.paymentStatus || "Paid"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => downloadInvoice(order, t)}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl ${dt.subtleAction || "text-brand"}`}
            >
              <Download size={14} />
              {t("dashboard.orders.downloadInvoice")}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function OrdersSection({ dt, onRoute }) {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [slugById, setSlugById] = useState({});

  const translateStatus = (status) => {
    const normalized = (status || "Placed").toLowerCase();
    return t(`orders.${normalized}`, status || "Placed");
  };

  useEffect(() => {
    API.get("/orders/my")
      .then((r) => setOrders(r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));

    API.get("/products")
      .then((r) => {
        const map = {};
        for (const p of r.data?.products || []) {
          if (p._id && p.slug) map[p._id] = p.slug;
        }
        setSlugById(map);
      })
      .catch(() => {});
  }, []);

  const stats = useMemo(() => {
    const active = orders.filter((o) => ["Placed", "Packed", "Shipped"].includes(o.status)).length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    return { total: orders.length, active, delivered };
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (filter === "active" && !["Placed", "Packed", "Shipped"].includes(order.status)) return false;
      if (filter === "delivered" && order.status !== "Delivered") return false;
      if (filter === "cancelled" && order.status !== "Cancelled") return false;
      if (!q) return true;
      const idMatch = order._id.toLowerCase().includes(q);
      const itemMatch = (order.items || []).some((it) => it.name?.toLowerCase().includes(q));
      return idMatch || itemMatch;
    });
  }, [orders, filter, search]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-28 rounded-2xl animate-pulse ${dt.chip}`} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`rounded-3xl p-8 sm:p-10 text-center ${dt.card}`}>
        <div className={`w-16 h-16 rounded-2xl mx-auto grid place-items-center mb-4 ${dt.chip}`}>
          <ShoppingBag size={28} className={dt.accent} />
        </div>
        <h3 className={`text-lg font-black ${dt.stat}`}>{t("orders.emptyTitle")}</h3>
        <p className={`text-sm mt-2 max-w-xs mx-auto ${dt.muted}`}>{t("orders.emptyCopy")}</p>
        <button
          type="button"
          onClick={() => onRoute("/shop")}
          className="btn-primary mt-6 px-6 py-3 rounded-xl text-sm font-black"
        >
          {t("common.browseProducts")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: t("dashboard.orders.statTotal"), value: stats.total, accent: dt.accent },
          { label: t("dashboard.orders.statActive"), value: stats.active, accent: "text-amber-500" },
          { label: t("dashboard.orders.statDelivered"), value: stats.delivered, accent: "text-emerald-500" },
        ].map(({ label, value, accent }) => (
          <div key={label} className={`rounded-2xl p-3 sm:p-4 text-center ${dt.chip}`}>
            <p className={`text-xl sm:text-2xl font-black ${accent}`}>{value}</p>
            <p className={`text-[10px] sm:text-xs font-bold mt-0.5 ${dt.muted}`}>{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dt.muted}`} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dashboard.orders.searchPlaceholder")}
            className={`${dt.input} pl-9`}
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 custom-scroll">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 text-[11px] font-bold px-3 py-2 rounded-xl transition-colors ${
                filter === f ? "btn-primary" : dt.chip
              }`}
            >
              {t(`dashboard.orders.filter.${f}`)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className={`text-sm text-center py-8 ${dt.muted}`}>{t("dashboard.orders.noResults")}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              dt={dt}
              t={t}
              translateStatus={translateStatus}
              expanded={expandedId === order._id}
              onToggle={() => setExpandedId((id) => (id === order._id ? null : order._id))}
              onRoute={onRoute}
              slugById={slugById}
            />
          ))}
        </div>
      )}
    </div>
  );
}

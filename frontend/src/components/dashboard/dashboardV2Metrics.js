import { DASHBOARD_ASSETS } from "./dashboardV2Data";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function bucketByWeek(items, dateKey = "createdAt") {
  const now = Date.now();
  let thisWeek = 0;
  let lastWeek = 0;

  for (const item of items) {
    const ts = new Date(item?.[dateKey] || 0).getTime();
    if (Number.isNaN(ts)) continue;
    const age = now - ts;
    if (age < WEEK_MS) thisWeek += 1;
    else if (age < WEEK_MS * 2) lastWeek += 1;
  }

  return { thisWeek, lastWeek };
}

export function formatWeekTrend(thisWeek, lastWeek) {
  if (thisWeek === 0 && lastWeek === 0) return null;
  if (lastWeek === 0) {
    return thisWeek > 0 ? `↑ ${thisWeek} new` : null;
  }
  const pct = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  if (pct === 0) return "→ 0%";
  return pct > 0 ? `↑ ${pct}%` : `↓ ${Math.abs(pct)}%`;
}

export function getOrderTrend(orders) {
  const { thisWeek, lastWeek } = bucketByWeek(orders);
  return formatWeekTrend(thisWeek, lastWeek);
}

export function getNewOrderCount(orders) {
  const { thisWeek } = bucketByWeek(orders);
  return thisWeek;
}

export function getDeliveredTrend(orders) {
  const delivered = orders.filter((o) => o.status === "Delivered");
  const { thisWeek, lastWeek } = bucketByWeek(delivered);
  return formatWeekTrend(thisWeek, lastWeek);
}

export function getOpenOrderCount(orders) {
  return orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;
}

export function countOpenSupportTickets(messages = []) {
  return messages.filter((m) => m.status !== "resolved").length;
}

export function resolveHeroProduct(products = [], recommended = []) {
  const pool = [...recommended, ...products];
  const match =
    pool.find((p) => p?.slug && /knee/i.test(p.name || "")) ||
    pool.find((p) => p?.slug);

  return {
    image: DASHBOARD_ASSETS.heroBrace,
    name: match?.name || "Knee Support Brace",
    slug: match?.slug ?? null,
  };
}

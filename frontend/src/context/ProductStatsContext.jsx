import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  FALLBACK_PRODUCT_STATS,
  fetchProductStats,
  getBootstrapProductStats,
  normalizeProductStats,
} from "../utils/productStatsLoader";
import { loadCachedProductStats } from "../utils/productStatsCache";
import { bodyCategories } from "../data/siteData";

const ProductStatsContext = createContext(null);

function initialStats() {
  return getBootstrapProductStats();
}

export function ProductStatsProvider({ children }) {
  const cachedOnMount = !!loadCachedProductStats();
  const [stats, setStats] = useState(initialStats);
  const [hasExactStats, setHasExactStats] = useState(cachedOnMount);

  useEffect(() => {
    let ignore = false;

    fetchProductStats()
      .then((next) => {
        if (!ignore) {
          setStats(next);
          setHasExactStats(true);
        }
      })
      .catch(() => {
        if (!ignore) {
          setStats({
            ...FALLBACK_PRODUCT_STATS,
            categoryCounts: { ...FALLBACK_PRODUCT_STATS.categoryCounts },
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const getCategoryCount = (query) => stats.categoryCounts[query] ?? 0;

  const categoriesWithCounts = useMemo(
    () =>
      bodyCategories.map((cat) => ({
        ...cat,
        count: getCategoryCount(cat.query),
      })),
    [stats.categoryCounts]
  );

  const formatProductCount = (n, { suffix = "+" } = {}) => {
    const value =
      n == null || (n === 0 && !hasExactStats)
        ? FALLBACK_PRODUCT_STATS.bodyTotal
        : n;
    if (value === 0) return suffix ? "0" : "0";
    return suffix ? `${value}${suffix}` : String(value);
  };

  const value = useMemo(
    () => ({
      totalProducts: stats.total,
      bodyTotal: stats.bodyTotal,
      activityTotal: stats.activityTotal,
      hasExactStats,
      getCategoryCount,
      categoriesWithCounts,
      formatProductCount,
    }),
    [stats, hasExactStats, categoriesWithCounts]
  );

  return (
    <ProductStatsContext.Provider value={value}>
      {children}
    </ProductStatsContext.Provider>
  );
}

export function useProductStats() {
  const ctx = useContext(ProductStatsContext);
  if (!ctx) {
    throw new Error("useProductStats must be used within ProductStatsProvider");
  }
  return ctx;
}

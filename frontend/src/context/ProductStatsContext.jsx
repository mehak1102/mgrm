import { createContext, useContext, useEffect, useMemo, useState } from "react";
import API from "../api";
import { bodyCategories } from "../data/siteData";
import { productMatchesCategory } from "../utils/categoryProductMatch";

const ProductStatsContext = createContext(null);

export function ProductStatsProvider({ children }) {
  const [stats, setStats] = useState({
    total: 0,
    bodyTotal: 0,
    activityTotal: 0,
    products: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    API.get("/products/stats")
      .then((res) => {
        if (!ignore) setStats(res.data);
      })
      .catch(() => {
        if (!ignore) {
          setStats({ total: 0, bodyTotal: 0, activityTotal: 0, products: [] });
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const categoryCounts = useMemo(() => {
    const map = {};
    for (const cat of bodyCategories) {
      map[cat.query] = stats.products.filter((p) =>
        productMatchesCategory(p, cat.query)
      ).length;
    }
    return map;
  }, [stats.products]);

  const getCategoryCount = (query) => categoryCounts[query] ?? 0;

  const categoriesWithCounts = useMemo(
    () =>
      bodyCategories.map((cat) => ({
        ...cat,
        count: getCategoryCount(cat.query),
      })),
    [categoryCounts]
  );

  const formatProductCount = (n, { suffix = "+" } = {}) => {
    if (loading) return "—";
    if (n === 0) return suffix ? "0" : "0";
    return suffix ? `${n}${suffix}` : String(n);
  };

  const value = useMemo(
    () => ({
      totalProducts: stats.total,
      bodyTotal: stats.bodyTotal,
      activityTotal: stats.activityTotal,
      loading,
      getCategoryCount,
      categoriesWithCounts,
      formatProductCount,
    }),
    [stats, loading, categoryCounts, categoriesWithCounts]
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

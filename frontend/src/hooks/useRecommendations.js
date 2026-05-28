import { useEffect, useState } from "react";
import API from "../api";
import { getBehavior } from "../utils/recommendationBehavior";

export function useHomeRecommendations({ cart = [], limit = 12 } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [strategy, setStrategy] = useState("");

  useEffect(() => {
    let ignore = false;
    const behavior = getBehavior();
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("searches", (behavior.recentSearches || []).join(","));
    params.set("viewed", (behavior.viewedProductIds || []).join(","));
    params.set("categories", (behavior.clickedCategories || []).join(","));
    params.set(
      "cart",
      cart.map((item) => item?._id).filter(Boolean).join(",")
    );

    API.get(`/recommendations/home?${params.toString()}`)
      .then((res) => {
        if (ignore) return;
        setProducts(res.data.products || []);
        setStrategy(res.data.strategy || "");
      })
      .catch(() => {
        if (ignore) return;
        setProducts([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [cart, limit]);

  return { products, loading, strategy };
}

export function useProductRecommendations(productId, limit = 8) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    let ignore = false;
    API.get(`/recommendations/product/${productId}?limit=${limit}`)
      .then((res) => {
        if (!ignore) setProducts(res.data.products || []);
      })
      .catch(() => {
        if (!ignore) setProducts([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [productId, limit]);

  return { products, loading };
}

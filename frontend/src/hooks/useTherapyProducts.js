import { useEffect, useState } from "react";
import API from "../api";
import { getCategoryMeta } from "../data/therapyRecommendationsData";

export async function fetchTherapyProductsGrouped(categories) {
  if (!categories?.length) return [];

  const results = await Promise.all(
    categories.map((query) =>
      API.get(`/products?category=${encodeURIComponent(query)}&bodyOnly=true`)
        .then((res) => ({
          query,
          products: res.data.products || [],
        }))
        .catch(() => ({ query, products: [] }))
    )
  );

  return results.map(({ query, products }) => {
    const catMeta = getCategoryMeta(query);
    const seen = new Set();
    const unique = [];

    for (const product of products) {
      const id = product._id || product.slug;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      unique.push(product);
    }

    return {
      query,
      label: catMeta.label,
      color: catMeta.color,
      image: catMeta.image,
      products: unique,
      count: unique.length,
    };
  });
}

export async function fetchTherapyProducts(categories) {
  const groups = await fetchTherapyProductsGrouped(categories);
  const merged = [];
  const seen = new Set();

  for (const group of groups) {
    for (const product of group.products) {
      const id = product._id || product.slug;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      merged.push(product);
    }
  }

  return merged;
}

export function useTherapyProductsGrouped(categories) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const key = categories?.join("|") || "";

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetchTherapyProductsGrouped(categories)
      .then((list) => {
        if (!ignore) setGroups(list);
      })
      .catch(() => {
        if (!ignore) setGroups([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [key, categories]);

  const totalCount = groups.reduce((sum, g) => sum + g.count, 0);

  return { groups, loading, totalCount };
}

export function useTherapyProducts(categories) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const key = categories?.join("|") || "";

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetchTherapyProducts(categories)
      .then((list) => {
        if (!ignore) setProducts(list);
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
  }, [key, categories]);

  return { products, loading };
}

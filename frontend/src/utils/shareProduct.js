import toast from "react-hot-toast";

export function getProductShareUrl(product) {
  const slug = product?.slug;
  if (!slug) return window.location.href;
  return `${window.location.origin}/product/${slug}`;
}

export function getProductShareText(product) {
  const title = product?.name || "MGRM Medicare Product";
  return `Check out ${title} on MGRM Medicare — orthopedic supports trusted across India.`;
}

export function getWhatsAppShareUrl(product) {
  const url = getProductShareUrl(product);
  const text = `${getProductShareText(product)} ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export async function copyProductLink(product) {
  const url = getProductShareUrl(product);
  const text = `${getProductShareText(product)}\n${url}`;
  await navigator.clipboard.writeText(text);
  toast.success("Link copied to clipboard!");
  return "copied";
}

export async function shareProductNative(product) {
  const url = getProductShareUrl(product);
  const title = product?.name || "MGRM Medicare Product";
  const text = getProductShareText(product);

  if (navigator.share) {
    await navigator.share({ title, text, url });
    return "shared";
  }

  await copyProductLink(product);
  return "copied";
}

export async function shareProduct(product) {
  try {
    return await shareProductNative(product);
  } catch (err) {
    if (err?.name === "AbortError") return "cancelled";
    toast.error("Could not share this product");
    return "failed";
  }
}

export function getCatalogPdfUrl() {
  const base =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "/api" : "http://localhost:5000/api");
  const root = base.startsWith("http") ? base.replace(/\/api\/?$/, "") : "";
  return `${root}/api/products/catalog/pdf`;
}

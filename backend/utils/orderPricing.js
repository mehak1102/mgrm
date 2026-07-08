import Product from "../models/Product.js";

export const FREE_SHIPPING_THRESHOLD = 499;
export const SHIPPING_FEE = 49;

export class OrderValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "OrderValidationError";
  }
}

export async function validateAndPriceCart(items, options = {}) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new OrderValidationError("Cart is empty");
  }

  const productIds = items.map((item) => item.productId || item._id).filter(Boolean);
  if (productIds.length !== items.length) {
    throw new OrderValidationError("Each cart item must include a product id");
  }

  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const validatedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const productId = String(item.productId || item._id);
    const product = productMap.get(productId);

    if (!product) {
      throw new OrderValidationError("One or more products are no longer available");
    }

    const qty = Math.max(1, Math.floor(Number(item.qty) || 1));
    if (qty > product.stock) {
      throw new OrderValidationError(`Insufficient stock for ${product.name}`);
    }

    const unitPrice = Number(product.discountPrice ?? product.price);
    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;

    validatedItems.push({
      productId: product._id,
      _id: product._id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      discountPrice: unitPrice,
      image: product.images?.[0] || "",
      selectedSize: item.selectedSize || "",
      qty,
      stock: product.stock,
      lineTotal,
    });
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;

  let bundleDiscount = 0;
  if (validatedItems.length >= 2 && options.bundleDiscount) {
    const maxBundle = Math.floor(subtotal * 0.05);
    bundleDiscount = Math.min(
      Math.max(0, Math.floor(Number(options.bundleDiscount))),
      maxBundle
    );
  }

  const grandTotal = Math.max(0, subtotal + shipping - bundleDiscount);

  return { items: validatedItems, subtotal, shipping, bundleDiscount, grandTotal };
}

import API from "../api";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { trackCartProducts } from "../utils/recommendationBehavior";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("mgrm_cart") || "[]");
  });

  const [cartOpen, setCartOpen] = useState(false);

  const saveCart = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem("mgrm_cart", JSON.stringify(nextCart));
  };

  const getStock = (product) => {
    return Number(product?.stock || product?.quantity || 10);
  };

  const addToCart = async (product, qty = 1, size = "") => {
    const selectedSize = size || product?.sizes?.[0] || "";
    const stock = getStock(product);
    const safeQty = Math.min(stock, Math.max(1, Number(qty) || 1));

    try {
      await API.post("/cart", {
        productId: product._id,
        qty: safeQty,
        size: selectedSize,
      });
    } catch (err) {
      console.log("Backend cart failed, using local");
    }

    const nextCart = [...cart];

    const existingIndex = nextCart.findIndex(
      (item) => item._id === product._id && item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      nextCart[existingIndex].qty = Math.min(
        stock,
        nextCart[existingIndex].qty + safeQty
      );

      nextCart[existingIndex].stock = stock;
    } else {
      nextCart.push({
        _id: product._id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: Number(product.price || 0),
        discountPrice: Number(product.discountPrice || product.price || 0),
        image: product.images?.[0] || product.image || "",
        selectedSize,
        stock,
        qty: safeQty,
      });
    }

    saveCart(nextCart);
    setCartOpen(true);
    toast.success("Added to cart");
  };

  const updateQty = (id, selectedSize, qty) => {
    const nextCart = cart.map((item) => {
      if (item._id === id && item.selectedSize === selectedSize) {
        const stock = Number(item.stock || 10);
        const safeQty = Math.min(stock, Math.max(1, Number(qty) || 1));

        return { ...item, qty: safeQty };
      }

      return item;
    });

    saveCart(nextCart);
  };

  const increaseQty = (id, selectedSize) => {
    const nextCart = cart.map((item) => {
      if (item._id === id && item.selectedSize === selectedSize) {
        const stock = Number(item.stock || 10);
        return { ...item, qty: Math.min(stock, item.qty + 1) };
      }

      return item;
    });

    saveCart(nextCart);
  };

  const decreaseQty = (id, selectedSize) => {
    const nextCart = cart.map((item) => {
      if (item._id === id && item.selectedSize === selectedSize) {
        return { ...item, qty: Math.max(1, item.qty - 1) };
      }

      return item;
    });

    saveCart(nextCart);
  };

  const removeFromCart = (id, selectedSize) => {
    const nextCart = cart.filter(
      (item) => !(item._id === id && item.selectedSize === selectedSize)
    );

    saveCart(nextCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + Number(item.qty || 0), 0),
    [cart]
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + Number(item.discountPrice || item.price || 0) * Number(item.qty || 0),
        0
      ),
    [cart]
  );

  useEffect(() => {
    trackCartProducts(cart.map((item) => item._id).filter(Boolean));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        updateQty,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
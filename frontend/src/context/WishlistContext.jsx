import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("mgrm_wishlist") || "[]");
  });

  const getProductId = (product) => product?._id || product?.id || product?.slug;

  const saveWishlist = (next) => {
    setWishlist(next);
    localStorage.setItem("mgrm_wishlist", JSON.stringify(next));
  };

  const isWishlisted = (product) => {
    const id = typeof product === "string" ? product : getProductId(product);
    return wishlist.some((item) => getProductId(item) === id);
  };

  const isLiked = isWishlisted;

const toggleWishlist = (product) => {
  const id = getProductId(product);
  if (!id) return;

  if (isWishlisted(product)) {
    saveWishlist(wishlist.filter((item) => getProductId(item) !== id));
    toast.success("Removed from wishlist");
  } else {
    saveWishlist([...wishlist, product]);
    toast.success("Added to wishlist");
  }
};

  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        count: wishlistCount,
        isWishlisted,
        isLiked,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}
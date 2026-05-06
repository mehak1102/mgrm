// import { Routes, Route } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Navbar from "./components/Navbar";
// import CartDrawer from "./components/CartDrawer";
// import FloatingHelp from "./components/FloatingHelp";
// import Home from "./pages/Home";
// import Shop from "./pages/Shop";
// import ProductDetail from "./pages/ProductDetail";
// import Checkout from "./pages/Checkout";
// import OrderSuccess from "./pages/OrderSuccess";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// // import Admin from "./pages/Admin";

// import AdminDashboard from "./pages/AdminDashboard";
// import ProtectedAdmin from "./components/ProtectedAdmin";
// // import Login from "./pages/Login";
// // import Register from "./pages/Register";
// import MyOrders from "./pages/MyOrders";
// import Footer from "./components/Footer";

// import ShopByBody from "./pages/ShopByBody";
// import ShopByActivity from "./pages/ShopByActivity";
// import Blogs from "./pages/Blogs";
// import Support from "./pages/Support";

// // import Blogs from "./pages/Blogs";
// import BlogDetail from "./pages/BlogDetail";
// import Wishlist from "./pages/Wishlist"; // top me import
// import Orders from "./pages/Orders";
// import ScrollToTop from "./components/ScrollToTop";



// const themes = {
//   blue: {
//     primary: "#25319a",
//     accent: "#21a8df",
//     soft: "#eef8ff",
//     bg1: "#f8fbff",
//     bg2: "#eaf7ff",
//     border: "#dbeafe",
//   },
//   teal: {
//     primary: "#0f766e",
//     accent: "#14b8a6",
//     soft: "#ecfeff",
//     bg1: "#f0fdfa",
//     bg2: "#ccfbf1",
//     border: "#99f6e4",
//   },
//   purple: {
//     primary: "#4c1d95",
//     accent: "#8b5cf6",
//     soft: "#f5f3ff",
//     bg1: "#faf5ff",
//     bg2: "#ede9fe",
//     border: "#ddd6fe",
//   },
//   luxury: {
//     primary: "#111827",
//     accent: "#d97706",
//     soft: "#fffbeb",
//     bg1: "#fffaf0",
//     bg2: "#fef3c7",
//     border: "#fde68a",
//   },
// };

// export default function App() {
//   const [theme, setTheme] = useState(
//     localStorage.getItem("mgrm_theme") || "blue"
//   );

//   useEffect(() => {
//     const selected = themes[theme];
//     Object.entries(selected).forEach(([key, value]) => {
//       document.documentElement.style.setProperty(`--${key}`, value);
//     });
//     localStorage.setItem("mgrm_theme", theme);
//   }, [theme]);

//   return (
//     <>
//       <Navbar theme={theme} setTheme={setTheme} />
//       <ScrollToTop />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/shop" element={<Shop />} />
//         <Route path="/product/:slug" element={<ProductDetail />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/order-success" element={<OrderSuccess />} />
//         <Route path="/login" element={<Login />} />
// <Route path="/register" element={<Register />} />
// {/* <Route path="/admin" element={<Admin />} /> */}

// <Route path="/login" element={<Login />} />
// <Route path="/register" element={<Register />} />
// {/* <Route path="/orders" element={<MyOrders />} /> */}
// <Route
//   path="/admin"
//   element={
//     <ProtectedAdmin>
//       <AdminDashboard />
//     </ProtectedAdmin>
//   }
// />
// <Route path="/shop-by-body" element={<ShopByBody />} />
// <Route path="/shop-by-activity" element={<ShopByActivity />} />
// <Route path="/blogs" element={<Blogs />} />
// <Route path="/blogs/:slug" element={<BlogDetail />} />
// <Route path="/support" element={<Support />} />
// <Route path="/wishlist" element={<Wishlist />} />
// <Route path="/orders" element={<Orders />} />

//       </Routes>
//       <Footer />
//       <CartDrawer />
//       <FloatingHelp />
      
//     </>
//   );
// }

import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import FloatingHelp from "./components/FloatingHelp";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedAdmin from "./components/ProtectedAdmin";
import Orders from "./pages/Orders";
import ShopByBody from "./pages/ShopByBody";
import ShopByActivity from "./pages/ShopByActivity";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Support from "./pages/Support";
import Wishlist from "./pages/Wishlist";

import { useAuth } from "./context/AuthContext";

const themes = {
  blue: {
    primary: "#25319a",
    accent: "#21a8df",
    soft: "#eef8ff",
    bg1: "#f8fbff",
    bg2: "#eaf7ff",
    border: "#dbeafe",
  },
  teal: {
    primary: "#0f766e",
    accent: "#14b8a6",
    soft: "#ecfeff",
    bg1: "#f0fdfa",
    bg2: "#ccfbf1",
    border: "#99f6e4",
  },
  purple: {
    primary: "#4c1d95",
    accent: "#8b5cf6",
    soft: "#f5f3ff",
    bg1: "#faf5ff",
    bg2: "#ede9fe",
    border: "#ddd6fe",
  },
  luxury: {
    primary: "#111827",
    accent: "#d97706",
    soft: "#fffbeb",
    bg1: "#fffaf0",
    bg2: "#fef3c7",
    border: "#fde68a",
  },
};

export default function App() {
  const location = useLocation();
  const { user } = useAuth();

  const [theme, setTheme] = useState(
    localStorage.getItem("mgrm_theme") || "blue"
  );

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const selected = themes[theme];

    Object.entries(selected).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });

    localStorage.setItem("mgrm_theme", theme);
  }, [theme]);

  return (
    <>
      {!hideLayout && <Navbar theme={theme} setTheme={setTheme} />}

      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop-by-body" element={<ShopByBody />} />
        <Route path="/shop-by-activity" element={<ShopByActivity />} />

        <Route path="/product/:slug" element={<ProductDetail />} />

        <Route
          path="/checkout"
          element={user ? <Checkout /> : <Navigate to="/login" replace />}
        />

        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />

        <Route path="/support" element={<Support />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminDashboard />
            </ProtectedAdmin>
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
      {!hideLayout && <CartDrawer />}
      {!hideLayout && <FloatingHelp />}

      <Toaster position="top-right" />
    </>
  );
}
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import AboutUs from "./pages/AboutUs";
import DashboardRedirect from "./pages/DashboardRedirect";

import { useAuth } from "./context/AuthContext";
import UserDashboardOverlay from "./components/dashboard/UserDashboardOverlay";
import { useDashboard } from "./context/DashboardContext";

export default function App() {
  const location = useLocation();
  const { user } = useAuth();

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-app text-fg dark:bg-slate-950 dark:text-zinc-100 transition-colors duration-300">
      {!hideLayout && <Navbar />}

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
        <Route
          path="/dashboard"
          element={user ? <DashboardRedirect /> : <Navigate to="/login" replace />}
        />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />

        <Route path="/support" element={<Support />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/about-us" element={<AboutUs />} />

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

      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "!bg-card dark:!bg-slate-900 !text-fg dark:!text-white !border !border-edge dark:!border-white/10 transition-colors duration-300 [&_p]:dark:!text-slate-300",
        }}
      />
      <UserDashboardOverlay />
    </div>
  );
}

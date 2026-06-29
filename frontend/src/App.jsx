import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import FloatingHelp from "./components/FloatingHelp";
import TidioChat from "./components/TidioChat";
import Footer from "./components/Footer";
import InstagramFeed from "./components/InstagramFeed";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedAdmin from "./components/ProtectedAdmin";

import { useAuth } from "./context/AuthContext";
import { useDashboard } from "./context/DashboardContext";
import { RecommendedByPhysiotherapist } from "./routes.jsx";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Orders = lazy(() => import("./pages/Orders"));
const ShopByBody = lazy(() => import("./pages/ShopByBody"));
const ShopByActivity = lazy(() => import("./pages/ShopByActivity"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Support = lazy(() => import("./pages/Support"));
const StoreLocator = lazy(() => import("./pages/StoreLocator"));
const WarrantyInformation = lazy(() => import("./pages/WarrantyInformation"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Careers = lazy(() => import("./pages/Careers"));
const DashboardRedirect = lazy(() => import("./pages/DashboardRedirect"));
const UserDashboardOverlay = lazy(() => import("./components/dashboard/UserDashboardOverlay"));

function RouteFallback() {
  return null;
}

function DashboardHost() {
  const { user, authReady } = useAuth();
  const { isOpen } = useDashboard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  if (!authReady || !user || !mounted) return null;

  return (
    <Suspense fallback={null}>
      <UserDashboardOverlay />
    </Suspense>
  );
}

export default function App() {
  const location = useLocation();
  const { user, authReady } = useAuth();

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

  const requireAuth = (element) => {
    if (!authReady) return <RouteFallback />;
    return user ? element : <Navigate to="/login" replace />;
  };

  return (
    <div className="min-h-screen bg-app text-fg dark:bg-slate-950 dark:text-zinc-100 transition-colors duration-300 overflow-x-clip max-w-[100vw]">
      {!hideLayout && <Navbar />}

      <ScrollToTop />

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop-by-body" element={<ShopByBody />} />
          <Route path="/shop-by-activity" element={<ShopByActivity />} />

          <Route path="/product/:slug" element={<ProductDetail />} />

          <Route path="/checkout" element={requireAuth(<Checkout />)} />

          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/dashboard" element={requireAuth(<DashboardRedirect />)} />

          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />

          <Route path="/support" element={<Support />} />
          <Route path="/support/store-locator" element={<StoreLocator />} />
          <Route path="/support/warranty" element={<WarrantyInformation />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/recommended-by-physiotherapist" element={<RecommendedByPhysiotherapist />} />

          <Route
            path="/admin"
            element={
              <ProtectedAdmin>
                <AdminDashboard />
              </ProtectedAdmin>
            }
          />
        </Routes>
      </Suspense>

      {!hideLayout && <InstagramFeed />}
      {!hideLayout && <Footer />}
      {!hideLayout && <CartDrawer />}
      {!hideLayout && <FloatingHelp />}
      <TidioChat />

      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "!bg-card dark:!bg-slate-900 !text-fg dark:!text-white !border !border-edge dark:!border-white/10 transition-colors duration-300 [&_p]:dark:!text-slate-300",
        }}
      />
      <DashboardHost />
    </div>
  );
}

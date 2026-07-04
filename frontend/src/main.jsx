import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AppGate from "./components/AppGate";
import "./i18n";
import "./index.css";
import "./theme/splash-screen.css";
import "./theme/language-switcher.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DashboardProvider } from "./context/DashboardContext";
import { ProductStatsProvider } from "./context/ProductStatsContext";
import { getStoredTheme } from "./theme/tokens";
import { loadThemeStyles } from "./theme/loadThemeStyles";
import { primeProductStatsFetch } from "./utils/productStatsLoader";
import { preconnectApi } from "./utils/apiPreconnect";

preconnectApi();
primeProductStatsFetch();

// Do not block first paint — theme bundles load in the background.
loadThemeStyles(getStoredTheme());

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <AppGate>
        <AuthProvider>
          <DashboardProvider>
            <CartProvider>
              <WishlistProvider>
                <ProductStatsProvider>
                  <App />
                </ProductStatsProvider>
              </WishlistProvider>
            </CartProvider>
          </DashboardProvider>
        </AuthProvider>
      </AppGate>
    </ThemeProvider>
  </BrowserRouter>
);

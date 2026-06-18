import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DashboardProvider } from "./context/DashboardContext";
import { getStoredTheme } from "./theme/tokens";
import { loadThemeStyles } from "./theme/loadThemeStyles";

async function bootstrap() {
  await loadThemeStyles(getStoredTheme());

  ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DashboardProvider>
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
          </DashboardProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

bootstrap();

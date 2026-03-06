import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductProvider>
      <CartProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </CartProvider>
    </ProductProvider>
  </StrictMode>
);
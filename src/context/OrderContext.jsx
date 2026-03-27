import { createContext, useContext, useCallback } from "react";
import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "https://huriacollection.com/api" });

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const placeOrder = useCallback(async (customer, cartItems, subtotal, shipping, total) => {
    const items = cartItems.map((item) => ({
      productId: item._id || item.id,
      name: item.name,
      category: item.category || "",
      price: item.price,
      qty: item.qty,
      img: item.img || "",
      selectedSize: item.selectedSize || null,
      selectedColor: item.selectedColor || null,
    }));

    const { data } = await API.post("/orders", {
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
      },
      items,
      subtotal,
      shipping,
      total,
    });

    return data;
  }, []);

  return (
    <OrderContext.Provider value={{ placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);

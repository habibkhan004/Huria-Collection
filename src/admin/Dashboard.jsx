import { useState, useEffect } from "react";
import axios from "axios";
import { useProducts } from "../context/ProductContext";
import { C } from "../theme/colors";
import { Package, Tag, Sparkles, Truck, ShoppingBag, Calendar, Clock, CheckCircle, TruckIcon, Archive, XCircle } from "lucide-react";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

export default function Dashboard() {
  const { allProducts = [] } = useProducts() || {};
  const [orderStats, setOrderStats] = useState(null);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const { data } = await API.get("/orders/stats");
        setOrderStats(data.stats || null);
      } catch {
        setOrderStats(null);
      }
    };
    fetchOrderStats();
  }, []);

  const totalProducts = allProducts.length;
  const saleProducts = allProducts.filter((p) => p.sale).length;
  const newProducts = allProducts.filter((p) => p.isNew).length;
  const freeShipping = allProducts.filter((p) => p.shippingFee === 0).length;

  const productCards = [
    { title: "Total Products", value: totalProducts, icon: Package },
    { title: "On Sale", value: saleProducts, icon: Tag },
    { title: "New Arrivals", value: newProducts, icon: Sparkles },
    { title: "Free Shipping", value: freeShipping, icon: Truck },
  ];

  const orderCards = orderStats
    ? [
        { title: "Total Orders", value: orderStats.total, icon: ShoppingBag },
        { title: "Today's Orders", value: orderStats.today ?? 0, icon: Calendar },
        { title: "Pending", value: orderStats.pending, icon: Clock },
        { title: "Confirmed", value: orderStats.confirmed, icon: CheckCircle },
        { title: "Shipped", value: orderStats.shipped, icon: TruckIcon },
        { title: "Delivered", value: orderStats.delivered, icon: Archive },
        { title: "Cancelled", value: orderStats.cancelled, icon: XCircle },
      ]
    : [];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-widest uppercase" style={{ color: C.text }}>
          Dashboard
        </h1>
        <p className="mt-2 text-sm" style={{ color: C.textMid }}>
          Overview of your store performance
        </p>
      </div>

      {/* Product Stats */}
      <div>
        <h2 className="text-lg font-bold mb-3" style={{ color: C.text }}>
          Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productCards.map(({ title, value, icon: Icon }) => (
            <div
              key={title}
              className="p-6 rounded-2xl shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ background: C.white }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase" style={{ color: C.textMid }}>
                    {title}
                  </p>
                  <h2 className="text-3xl font-black mt-2" style={{ color: C.pinkDark }}>
                    {value}
                  </h2>
                </div>
                <div className="p-3 rounded-xl" style={{ background: C.pinkPale, color: C.pinkDark }}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Stats */}
      {orderCards.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: C.text }}>
            Orders
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {orderCards.map(({ title, value, icon: Icon }) => (
              <div
                key={title}
                className="p-4 rounded-2xl shadow-md transition-all hover:shadow-lg"
                style={{ background: C.white }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase truncate" style={{ color: C.textMid }}>
                      {title}
                    </p>
                    <h2 className="text-xl font-black mt-1" style={{ color: C.pinkDark }}>
                      {value}
                    </h2>
                  </div>
                  <div className="p-2 rounded-lg flex-shrink-0" style={{ background: C.pinkPale, color: C.pinkDark }}>
                    <Icon size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Insight */}
      <div className="p-6 rounded-2xl shadow-md" style={{ background: C.white }}>
        <h3 className="text-lg font-bold tracking-wide mb-4" style={{ color: C.text }}>
          Quick Insight
        </h3>
        <p style={{ color: C.textMid }}>
          You currently have{" "}
          <span style={{ color: C.pinkDark, fontWeight: "bold" }}>{saleProducts}</span> products on sale and{" "}
          <span style={{ color: C.pinkDark, fontWeight: "bold" }}>{newProducts}</span> new arrivals. Consider promoting
          them on the homepage banner.
          {orderStats && orderStats.pending > 0 && (
            <>
              {" "}
              You have <span style={{ color: C.pinkDark, fontWeight: "bold" }}>{orderStats.pending}</span> pending
              orders to process.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

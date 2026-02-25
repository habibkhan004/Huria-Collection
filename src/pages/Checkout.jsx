import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const C = {
  pink: "#e75480",
  pinkDark: "#b5355c",
  pinkPale: "#fde8ef",
  cream: "#fff8f2",
  creamSoft: "#fdf1ea",
  creamDeep: "#f5e6dc",
  text: "#3b1f2b",
  textMid: "#7a4058",
  white: "#ffffff",
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();

  // 🔥 Dynamic Shipping (highest shipping fee in cart)
  const shippingTotal =
    items && items.length > 0
      ? Math.max(...items.map((item) => item.shippingFee || 0))
      : 0;

  const finalTotal = totalPrice + shippingTotal;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  if (!items || items.length === 0) {
    return (
      <div
        style={{ background: C.cream, minHeight: "70vh" }}
        className="flex flex-col items-center justify-center gap-6"
      >
        <h2 style={{ color: C.text }} className="text-xl font-bold">
          Your cart is empty
        </h2>

        <button
          onClick={() => navigate("/")}
          style={{ background: C.pink, color: C.white }}
          className="px-6 py-3 rounded-full font-semibold shadow-md"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!form.name || !form.phone || !form.address || !form.city) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      console.log("Order Data:", {
        customer: form,
        items,
        subtotal: totalPrice,
        shipping: shippingTotal,
        total: finalTotal,
      });

      clearCart();
      navigate("/");
      alert("Order placed successfully!");
    }, 1200);
  };

  return (
    <div
      style={{ background: C.cream, minHeight: "100vh" }}
      className="py-8 px-6"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14">
        
        {/* LEFT — Customer Details */}
        <div>
          <h2
            style={{ color: C.text }}
            className="text-3xl font-black mb-8"
          >
            Checkout
          </h2>

          <div className="flex flex-col gap-5">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              style={{
                background: C.white,
                border: `1px solid ${C.creamDeep}`,
              }}
              className="p-4 rounded-xl focus:outline-none"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              style={{
                background: C.white,
                border: `1px solid ${C.creamDeep}`,
              }}
              className="p-4 rounded-xl focus:outline-none"
            />

            <input
              name="address"
              placeholder="Full Address"
              value={form.address}
              onChange={handleChange}
              style={{
                background: C.white,
                border: `1px solid ${C.creamDeep}`,
              }}
              className="p-4 rounded-xl focus:outline-none"
            />

            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              style={{
                background: C.white,
                border: `1px solid ${C.creamDeep}`,
              }}
              className="p-4 rounded-xl focus:outline-none"
            />
          </div>

          <div
            style={{
              background: C.pinkPale,
              color: C.text,
            }}
            className="mt-6 p-4 rounded-xl text-sm"
          >
            Payment Method: <strong>Cash on Delivery</strong>
          </div>


        </div>

        {/* RIGHT — Order Summary */}
        <div
          style={{
            background: C.white,
            border: `1px solid ${C.creamDeep}`,
          }}
          className="p-6 rounded-2xl shadow-sm"
        >
          <h3
            style={{ color: C.text }}
            className="text-xl font-bold mb-6"
          >
            Order Summary
          </h3>

          <div className="flex flex-col gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm"
              >
                <div>
                  <p style={{ color: C.text }} className="font-semibold">
                    {item.name}
                  </p>
                  <p style={{ color: C.textMid }}>
                    Quantity: {item.qty}
                  </p>
                </div>

                <p style={{ color: C.pink }} className="font-bold">
                  PKR {(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{ borderTop: `1px solid ${C.creamDeep}` }}
            className="mt-2 pt-6 space-y-3 text-sm"
          >
            <div className="flex justify-between">
              <span style={{ color: C.textMid }}>Subtotal</span>
              <span>PKR {totalPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span style={{ color: C.textMid }}>Shipping</span>
              <span>
                {shippingTotal === 0
                  ? "Free"
                  : `PKR ${shippingTotal.toLocaleString()}`}
              </span>
            </div>

            <div
              className="flex justify-between text-lg font-black pt-4"
              style={{ borderTop: `1px solid ${C.creamDeep}` }}
            >
              <span>Total</span>
              <span style={{ color: C.pink }}>
                PKR {finalTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
                  <button
            onClick={handlePlaceOrder}
            disabled={loading}
            style={{
              background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
              color: C.white,
              opacity: loading ? 0.7 : 1,
            }}
            className="mt-2 w-full py-4 rounded-full font-bold shadow-lg transition"
          >
            {loading
              ? "Placing Order..."
              : `Place Order — PKR ${finalTotal.toLocaleString()}`}
          </button>
      </div>
    </div>
  );
}
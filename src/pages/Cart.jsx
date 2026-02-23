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

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQty, clearCart, totalPrice } = useCart();

  if (!items || items.length === 0) {
    return (
      <div style={{ background: C.cream, minHeight: "70vh" }}
        className="flex flex-col items-center justify-center gap-6">
        <h2 style={{ color: C.text }} className="text-xl font-bold">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/")}
          style={{ background: C.pink, color: C.white }}
          className="px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }} className="py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 style={{ color: C.text }} className="text-3xl font-black mb-10">
          Shopping Cart
        </h1>

        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              style={{ background: C.white, border: `1px solid ${C.creamDeep}` }}
              className="flex gap-6 p-6 rounded-2xl shadow-sm"
            >
              <img
                src={item.imgs?.[0] || item.img}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h3 style={{ color: C.text }} className="font-bold text-lg">
                  {item.name}
                </h3>

                <p style={{ color: C.textMid }} className="text-sm mt-1">
                  Qty: {item.qty}
                  {item.selectedSize && ` | Size: ${item.selectedSize}`}
                  {item.selectedColor && ` | ${item.selectedColor}`}
                </p>

                <p style={{ color: C.pink }} className="font-bold mt-2">
                  PKR {item.price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  style={{ background: C.pinkPale }}
                  className="px-3 py-1 rounded-lg font-bold"
                >
                  -
                </button>

                <span className="font-bold">{item.qty}</span>

                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  style={{ background: C.pinkPale }}
                  className="px-3 py-1 rounded-lg font-bold"
                >
                  +
                </button>
              </div>

              <div style={{ color: C.text }} className="font-bold text-right w-28">
                PKR {(item.price * item.qty).toLocaleString()}
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{ color: C.pinkDark }}
                className="font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div
          style={{ borderTop: `2px solid ${C.creamDeep}` }}
          className="mt-12 pt-8 flex justify-between items-center"
        >
          <button
            onClick={clearCart}
            style={{ color: C.textMid }}
            className="font-medium"
          >
            Clear Cart
          </button>

          <div className="text-right">
            <p style={{ color: C.text }} className="text-xl font-black">
              Total: PKR {totalPrice.toLocaleString()}
            </p>

            <button
              onClick={() => navigate("/checkout")}
              style={{
                background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
                color: C.white,
              }}
              className="mt-4 px-8 py-3 rounded-full font-bold shadow-lg hover:opacity-95"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
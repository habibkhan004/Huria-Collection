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
      <div className="bg-[#fff8f2] min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <h2 className="text-xl font-bold text-[#3b1f2b] text-center">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-full font-semibold shadow-md bg-[#e75480] text-white hover:opacity-90"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#fff8f2] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-[#3b1f2b] mb-8">
          Shopping Cart
        </h1>

        {/* Items */}
        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#f5e6dc] rounded-2xl shadow-sm p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

                {/* Image */}
                <img
                  src={item.imgs?.[0] || item.img}
                  alt={item.name}
                  className="w-full sm:w-28 h-40 sm:h-28 object-cover rounded-xl"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#3b1f2b]">
                    {item.name}
                  </h3>

                  <p className="text-sm text-[#7a4058] mt-1">
                    Qty: {item.qty}
                    {item.selectedSize && ` | Size: ${item.selectedSize}`}
                    {item.selectedColor && ` | ${item.selectedColor}`}
                  </p>

                  <p className="font-bold mt-2 text-[#e75480]">
                    PKR {item.price.toLocaleString()}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="px-3 py-1 rounded-lg font-bold bg-[#fde8ef]"
                    >
                      -
                    </button>

                    <span className="font-bold">{item.qty}</span>

                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="px-3 py-1 rounded-lg font-bold bg-[#fde8ef]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price + Remove */}
                <div className="flex sm:flex-col justify-between sm:items-end mt-4 sm:mt-0">
                  <div className="font-bold text-[#3b1f2b]">
                    PKR {(item.price * item.qty).toLocaleString()}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#b5355c] font-semibold mt-2 sm:mt-4"
                  >
                    Remove
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-12 pt-8 border-t-2 border-[#f5e6dc] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">

          <button
            onClick={clearCart}
            className="font-medium text-[#7a4058]"
          >
            Clear Cart
          </button>

          <div className="w-full sm:w-auto text-left sm:text-right">
            <p className="text-xl font-black text-[#3b1f2b]">
              Total: PKR {totalPrice.toLocaleString()}
            </p>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-4 w-full sm:w-auto px-8 py-3 rounded-full font-bold shadow-lg bg-gradient-to-r from-[#e75480] to-[#b5355c] text-white hover:opacity-95"
            >
              Proceed to Checkout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
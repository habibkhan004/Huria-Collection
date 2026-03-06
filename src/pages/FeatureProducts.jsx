import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Truck } from "lucide-react";
import { useProducts } from "../context/ProductContext";

const C = {
  pink:      "#e75480",
  pinkDark:  "#b5355c",
  pinkLight: "#f4a7b9",
  pinkPale:  "#fde8ef",
  cream:     "#fff8f2",
  creamDeep: "#ecddc8",
  creamDark: "#f5e6dc",
  text:      "#3b1f2b",
  textMid:   "#7a4058",
  white:     "#ffffff",
};

const ProductCard = ({ product, idx }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col cursor-pointer overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        animation: `fp-fadeUp 0.5s ease ${idx * 0.07}s both`,
        background: C.white,
        border: `1px solid ${hovered ? C.pinkLight : C.creamDeep}`,
        boxShadow: hovered
          ? "0 20px 48px rgba(231,84,128,0.15), 0 4px 16px rgba(0,0,0,0.06)"
          : "0 2px 12px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden" style={{ background: C.creamDark }}>
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
        />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.sale && (
            <span className="px-2.5 py-[3px] text-[10px] font-extrabold rounded-full"
              style={{ background: C.pink, color: C.white }}>
              {product.saleLabel}
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-[3px] text-[10px] font-extrabold rounded-full"
              style={{ background: C.text, color: C.white }}>
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-1.5 p-3 pt-2.5">
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "black" }}>
          {product.category}
        </span>

        <h3 className="text-sm font-bold leading-snug" style={{ color: "black" }}>
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-[19px] font-black" style={{ color: C.pink }}>
            PKR {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-[14px] line-through" style={{ color: "black" }}>
              PKR {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {product.shippingFee === 0 && (
          <div className="flex items-center gap-1">
            <Truck size={11} color="#16a34a" />
            <span className="text-[10px] font-bold" style={{ color: "#16a34a" }}>Free Delivery</span>
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
          className="mt-auto flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wide transition-all duration-200"
          style={{
            background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
            color: C.white,
            boxShadow: `0 4px 14px rgba(231,84,128,0.28)`,
            marginTop: "10px",
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 20px rgba(231,84,128,0.4)`}
          onMouseLeave={e => e.currentTarget.style.boxShadow = `0 4px 14px rgba(231,84,128,0.28)`}
        >
          <ShoppingBag size={13} /> Buy Now
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("cosmetics");
  const [tabKey, setTabKey]       = useState(0);

  const { shoes, cosmetics } = useProducts();
  const products = activeTab === "shoes" ? shoes : cosmetics;

  const switchTab = (tab) => {
    if (tab !== activeTab) { setActiveTab(tab); setTabKey(k => k + 1); }
  };

  return (
    <section className="py-16" style={{ background: C.creamDark }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;600;800&display=swap');
        @keyframes fp-fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="block text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: C.pink }}>
            ✦ Handpicked For You
          </span>
          <h2
            className="font-black mb-1"
            style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)", color: C.text, fontFamily: "'Playfair Display',Georgia,serif", lineHeight: 1.1 }}
          >
            Featured{" "}
            <span style={{
              fontStyle: "italic",
              background: `linear-gradient(135deg,${C.pink},${C.pinkDark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Products
            </span>
          </h2>
          <p style={{ color: C.textMid, fontSize: "15px" }}>
            Top picks across our collections — style &amp; beauty in one place.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-9">
          <div className="inline-flex rounded-full p-[5px] gap-1"
            style={{ background: C.cream, border: `1px solid ${C.creamDeep}` }}>
            {[
              { key: "cosmetics", label: "💄  Cosmetics" },
              { key: "shoes",     label: "👟  Shoes"     },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className="px-7 py-2 rounded-full font-bold text-[13px] transition-all"
                style={{
                  background: activeTab === key ? `linear-gradient(135deg,${C.pink},${C.pinkDark})` : "transparent",
                  color:      activeTab === key ? C.white : C.textMid,
                  boxShadow:  activeTab === key ? "0 4px 16px rgba(231,84,128,0.3)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div key={tabKey} className="grid gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p._id} product={p} idx={i} />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-11">
          <Link
            to={activeTab === "shoes" ? "/shoes" : "/cosmetics"}
            className="inline-flex items-center gap-2 px-9 py-3 rounded-full font-bold text-[13px] uppercase transition-all"
            style={{
              background: `linear-gradient(135deg,${C.pink},${C.pinkDark})`,
              color: C.white,
              boxShadow: "0 6px 24px rgba(231,84,128,0.3)",
              textDecoration: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(231,84,128,0.42)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(231,84,128,0.3)"; }}
          >
            View All {activeTab === "shoes" ? "Shoes" : "Cosmetics"} →
          </Link>
        </div>
      </div>
    </section>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { SHOES, COSMETICS } from "../components/ProductsData";

const C = {
  pink: "#e75480",
  pinkDark: "#b5355c",
  pinkLight: "#f4a7b9",
  cream: "#fff8f2",
  creamDeep: "#ecddc8",
  creamDark: "#f5e6dc",
  text: "#3b1f2b",
  textMid: "#7a4058",
  white: "#ffffff",
};

const Stars = ({ rating }) => (
  <div className="flex items-center gap-[2px]">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={11}
        fill={i <= Math.round(rating) ? C.pink : "transparent"}
        color={i <= Math.round(rating) ? C.pink : C.pinkLight}
      />
    ))}
  </div>
);

const ProductCard = ({ product, idx }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [wished, setWished] = useState(false);

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        flex flex-col cursor-pointer overflow-hidden rounded-2xl
        transition-transform transition-shadow duration-300
        ${hovered ? "translate-y-[-6px] shadow-2xl" : "shadow"}
      `}
      style={{ animation: `fp-fadeUp 0.5s ease ${idx * 0.07}s both`, background: C.white }}
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl" style={{ background: C.creamDark }}>
        <img
          src={product.img}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-400 ${hovered ? "scale-105" : "scale-100"}`}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.sale && (
            <span className="px-2 py-[2px] text-[10px] font-extrabold rounded-full" style={{ background: C.pink, color: C.white }}>
              {product.saleLabel}
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-[2px] text-[10px] font-extrabold rounded-full" style={{ background: C.text, color: C.white }}>
              NEW
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setWished((w) => !w);
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform ${
            wished ? "scale-110" : "scale-100"
          }`}
          style={{ background: "rgba(255,255,255,0.92)" }}
        >
          <Heart size={15} fill={wished ? C.pink : "none"} color={wished ? C.pink : C.textMid} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-2 p-3">
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: C.pinkLight }}>
          {product.category}
        </span>
        <h3 className="text-sm font-bold" style={{ color: C.text, lineHeight: 1.3 }}>
          {product.name}
        </h3>
        <Stars rating={product.rating} />
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-black" style={{ color: C.pink }}>
            PKR {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-[12px] line-through" style={{ color: C.pinkLight }}>
              PKR {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
          className="mt-1 flex items-center justify-center gap-2 w-full py-2 rounded-lg font-bold text-[12px] uppercase transition-transform duration-200"
          style={{
            background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
            color: C.white,
            boxShadow: "0 4px 14px rgba(231,84,128,0.28)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <ShoppingBag size={14} /> Buy Now
        </button>
      </div>
    </div>
  );
};

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("shoes");
  const [tabKey, setTabKey] = useState(0);

  const products = activeTab === "shoes" ? SHOES : COSMETICS;

  const switchTab = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setTabKey((k) => k + 1);
    }
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
          <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-black mb-1" style={{ color: C.text, fontFamily: "'Playfair Display',Georgia,serif", lineHeight: 1.1 }}>
            Featured{" "}
            <span className="italic bg-clip-text text-transparent" style={{ background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})` }}>
              Products
            </span>
          </h2>
          <p className="text-[14px]" style={{ color: C.textMid }}>
            Top picks across our collections — style &amp; beauty in one place.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-9">
          <div className="inline-flex rounded-full bg-white border border-[${C.creamDeep}] p-[2px] gap-1">
            {[
              { key: "shoes", label: "👟 Shoes" },
              { key: "cosmetics", label: "💄 Cosmetics" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className={`px-6 py-2 rounded-full font-bold text-[13px] uppercase transition-all ${
                  activeTab === key ? "text-white shadow-lg" : "text-[C.textMid]"
                }`}
                style={{
                  background: activeTab === key ? `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})` : "transparent",
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
            <ProductCard key={p.id} product={p} idx={i} />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-11">
          <a
            href={activeTab === "shoes" ? "/shoes" : "/cosmetics"}
            className="inline-flex items-center gap-2 px-9 py-3 rounded-full font-bold text-[13px] uppercase transition-transform"
            style={{
              background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
              color: C.white,
              boxShadow: "0 6px 24px rgba(231,84,128,0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            View All {activeTab === "shoes" ? "Shoes" : "Cosmetics"} →
          </a>
        </div>
      </div>
    </section>
  );
}
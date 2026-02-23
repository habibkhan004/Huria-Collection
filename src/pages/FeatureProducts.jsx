import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { SHOES, COSMETICS } from "../components/ProductsData";

const C = {
  pink:      "#e75480",
  pinkLight: "#f4a7b9",
  pinkPale:  "#fde8ef",
  pinkDark:  "#b5355c",
  cream:     "#fff8f2",
  creamDark: "#f5e6dc",
  creamDeep: "#ecddc8",
  text:      "#3b1f2b",
  textMid:   "#7a4058",
  white:     "#ffffff",
};

const Stars = ({ rating }) => (
  <div style={{ display:"flex", alignItems:"center", gap:"2px" }}>
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={11}
        fill={i <= Math.round(rating) ? C.pink : "transparent"}
        color={i <= Math.round(rating) ? C.pink : C.pinkLight}
      />
    ))}
  </div>
);

const ProductCard = ({ product, idx }) => {
  const navigate  = useNavigate();
  const [wished, setWished]   = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        borderRadius: "20px",
        overflow: "hidden",
        border: `1px solid ${hovered ? C.pinkLight : C.creamDeep}`,
        boxShadow: hovered
          ? `0 20px 48px rgba(231,84,128,0.15), 0 4px 16px rgba(0,0,0,0.06)`
          : `0 2px 12px rgba(0,0,0,0.05)`,
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        animation: `fp-fadeUp 0.5s ease ${idx * 0.07}s both`,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <div style={{ position:"relative", aspectRatio:"1/1", overflow:"hidden", background:C.creamDark }}>
        <img
          src={product.img}
          alt={product.name}
          style={{
            width:"100%", height:"100%", objectFit:"cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />

        {/* Badges */}
        <div style={{ position:"absolute", top:"10px", left:"10px", display:"flex", flexDirection:"column", gap:"5px" }}>
          {product.sale && (
            <span style={{ background:C.pink, color:C.white, fontSize:"10px", fontWeight:800, padding:"3px 9px", borderRadius:"999px" }}>
              {product.saleLabel}
            </span>
          )}
          {product.isNew && (
            <span style={{ background:C.text, color:C.white, fontSize:"10px", fontWeight:800, padding:"3px 9px", borderRadius:"999px" }}>
              NEW
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); setWished(w => !w); }}
          style={{
            position:"absolute", top:"10px", right:"10px",
            width:34, height:34, borderRadius:"50%",
            background:"rgba(255,255,255,0.92)", border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
            transition:"transform .2s",
            transform: wished ? "scale(1.15)" : "scale(1)",
          }}
        >
          <Heart size={15} fill={wished ? C.pink : "none"} color={wished ? C.pink : C.textMid} />
        </button>
      </div>

      {/* Info */}
      <div style={{ padding:"14px 16px 16px", display:"flex", flexDirection:"column", gap:"7px", flex:1 }}>
        <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:C.pinkLight }}>
          {product.category}
        </span>

        <h3 style={{ fontSize:"14px", fontWeight:800, color:C.text, margin:0, fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1.3 }}>
          {product.name}
        </h3>

        <Stars rating={product.rating} />

        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ fontSize:"17px", fontWeight:900, color:C.pink }}>
            PKR {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span style={{ fontSize:"12px", color:C.pinkLight, textDecoration:"line-through" }}>
              PKR {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Buy Now */}
        <button
          onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
          style={{
            marginTop:"4px", width:"100%", padding:"10px",
            borderRadius:"12px", border:"none", cursor:"pointer",
            fontWeight:800, fontSize:"12px", letterSpacing:"0.08em", textTransform:"uppercase",
            display:"flex", alignItems:"center", justifyContent:"center", gap:"7px",
            background:`linear-gradient(135deg,${C.pink},${C.pinkDark})`,
            color:C.white,
            boxShadow:`0 4px 14px rgba(231,84,128,0.28)`,
            transition:"transform .18s, box-shadow .18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow=`0 8px 20px rgba(231,84,128,0.38)`; }}
          onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=`0 4px 14px rgba(231,84,128,0.28)`; }}
        >
          <ShoppingBag size={14} /> Buy Now
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("shoes");
  const [tabKey, setTabKey]       = useState(0);

  const switchTab = (tab) => { if (tab === activeTab) return; setActiveTab(tab); setTabKey(k => k + 1); };
  const products  = activeTab === "shoes" ? SHOES : COSMETICS;

  return (
    <section style={{ background:C.creamDark, padding:"64px 0 72px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;600;800&display=swap');
        @keyframes fp-fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <span style={{ fontSize:"11px", fontWeight:800, letterSpacing:"0.25em", textTransform:"uppercase", color:C.pink, display:"block", marginBottom:"8px" }}>
            ✦ Handpicked For You
          </span>
          <h2 style={{ fontSize:"clamp(1.9rem,4vw,2.8rem)", fontWeight:900, color:C.text, margin:"0 0 6px", fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1.1 }}>
            Featured{" "}
            <span style={{ fontStyle:"italic", background:`linear-gradient(135deg,${C.pink},${C.pinkDark})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Products
            </span>
          </h2>
          <p style={{ color:C.textMid, fontSize:"14px", marginTop:"6px" }}>
            Top picks across our collections — style &amp; beauty in one place.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"36px" }}>
          <div style={{ display:"inline-flex", background:C.cream, borderRadius:"999px", padding:"5px", border:`1px solid ${C.creamDeep}`, gap:"4px" }}>
            {[{ key:"shoes", label:"👟  Shoes" }, { key:"cosmetics", label:"💄  Cosmetics" }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                style={{
                  padding:"10px 28px", borderRadius:"999px", border:"none", cursor:"pointer",
                  fontSize:"13px", fontWeight:800, letterSpacing:"0.04em",
                  transition:"all 0.25s ease",
                  background: activeTab === key ? `linear-gradient(135deg,${C.pink},${C.pinkDark})` : "transparent",
                  color: activeTab === key ? C.white : C.textMid,
                  boxShadow: activeTab === key ? `0 4px 16px rgba(231,84,128,0.3)` : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          key={tabKey}
          style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:"20px" }}
        >
          {products.map((p, i) => <ProductCard key={p.id} product={p} idx={i} />)}
        </div>

        {/* View All */}
        <div style={{ textAlign:"center", marginTop:"44px" }}>
          <a
            href={activeTab === "shoes" ? "/shoes" : "/cosmetics"}
            style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"13px 36px", borderRadius:"999px",
              background:`linear-gradient(135deg,${C.pink},${C.pinkDark})`,
              color:C.white, fontSize:"13px", fontWeight:800,
              letterSpacing:"0.08em", textTransform:"uppercase", textDecoration:"none",
              boxShadow:`0 6px 24px rgba(231,84,128,0.3)`,
              transition:"transform .2s, box-shadow .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 10px 30px rgba(231,84,128,0.42)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=`0 6px 24px rgba(231,84,128,0.3)`; }}
          >
            View All {activeTab === "shoes" ? "Shoes" : "Cosmetics"} →
          </a>
        </div>
      </div>
    </section>
  );
}
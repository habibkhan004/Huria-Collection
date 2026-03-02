import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Star, Truck, SlidersHorizontal, X, ChevronDown } from "lucide-react";

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

// ─── Stars ─────────────────────────────────────────────────────────────────────
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

// ─── Single card ───────────────────────────────────────────────────────────────
const ProductCard = ({ product, idx }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:"flex", flexDirection:"column",
        cursor:"pointer", overflow:"hidden", borderRadius:"18px",
        background: C.white,
        border: `1px solid ${hovered ? C.pinkLight : C.creamDeep}`,
        boxShadow: hovered
          ? "0 20px 48px rgba(231,84,128,0.14), 0 4px 14px rgba(0,0,0,0.05)"
          : "0 2px 10px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.3s ease",
        animation: `pg-fadeUp 0.5s ease ${idx * 0.06}s both`,
      }}
    >
      {/* Image */}
      <div style={{ position:"relative", aspectRatio:"1/1", overflow:"hidden", background:C.creamDark }}>
        <img
          src={product.img}
          alt={product.name}
          style={{
            width:"100%", height:"100%", objectFit:"cover",
            transform: hovered ? "scale(1.07)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
        />
        {/* Badges */}
        <div style={{ position:"absolute", top:"10px", left:"10px", display:"flex", flexDirection:"column", gap:"4px" }}>
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
      </div>

      {/* Info */}
      <div style={{ display:"flex", flexDirection:"column", flex:1, gap:"5px", padding:"12px 14px 14px" }}>
        <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"black" }}>
          {product.category}
        </span>
        <h3 style={{ fontSize:"14px", fontWeight:700, color:"black", margin:0, lineHeight:1.3, fontFamily:"'Playfair Display',Georgia,serif" }}>
          {product.name}
        </h3>
        <Stars rating={product.rating} />
        <div style={{ display:"flex", alignItems:"baseline", gap:"8px", marginTop:"2px" }}>
          <span style={{ fontSize:"18px", fontWeight:900, color:C.pink }}>
            PKR {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span style={{ fontSize:"13px", textDecoration:"line-through", color:"black" }}>
              PKR {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        {product.shippingFee === 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
            <Truck size={11} color="#16a34a" />
            <span style={{ fontSize:"10px", fontWeight:700, color:"#16a34a" }}>Free Delivery</span>
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
          style={{
            marginTop:"auto", paddingTop:"10px",
            display:"flex", alignItems:"center", justifyContent:"center", gap:"6px",
            width:"100%", padding:"10px", borderRadius:"12px", border:"none", cursor:"pointer",
            background:`linear-gradient(135deg,${C.pink},${C.pinkDark})`,
            color:C.white, fontWeight:800, fontSize:"12px",
            letterSpacing:"0.07em", textTransform:"uppercase",
            boxShadow:`0 4px 14px rgba(231,84,128,0.28)`,
            transition:"box-shadow .2s",
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 20px rgba(231,84,128,0.42)`}
          onMouseLeave={e => e.currentTarget.style.boxShadow = `0 4px 14px rgba(231,84,128,0.28)`}
        >
          <ShoppingBag size={13} /> Buy Now
        </button>
      </div>
    </div>
  );
};

// ─── Sort select ───────────────────────────────────────────────────────────────
const SortSelect = ({ value, onChange }) => (
  <div style={{ position:"relative", display:"inline-flex", alignItems:"center" }}>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        appearance:"none", padding:"9px 36px 9px 14px",
        borderRadius:"10px", border:`1.5px solid ${C.creamDeep}`,
        background:C.white, color:C.text, fontSize:"13px", fontWeight:600,
        fontFamily:"'DM Sans',sans-serif", cursor:"pointer", outline:"none",
      }}
    >
      <option value="default">Sort: Default</option>
      <option value="price_asc">Price: Low → High</option>
      <option value="price_desc">Price: High → Low</option>
      <option value="rating">Top Rated</option>
      <option value="newest">New Arrivals First</option>
    </select>
    <ChevronDown size={14} color={C.textMid} style={{ position:"absolute", right:"10px", pointerEvents:"none" }} />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// Main export — accepts products array + page-level config
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProductGrid({ products = [], title, subtitle, accentLabel, emptyMsg }) {
  const [sort, setSort]         = useState("default");
  const [freeOnly, setFreeOnly] = useState(false);
  const [search, setSearch]     = useState("");

  // local filter + sort (no context needed here, parent passes the base list)
  let list = [...products];
  if (freeOnly) list = list.filter(p => p.shippingFee === 0);
  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
  if (sort === "price_asc")  list.sort((a,b) => a.price - b.price);
  if (sort === "price_desc") list.sort((a,b) => b.price - a.price);
  if (sort === "rating")     list.sort((a,b) => b.rating - a.rating);
  if (sort === "newest")     list = list.filter(p => p.isNew).concat(list.filter(p => !p.isNew));

  const activeFilters = (freeOnly ? 1 : 0);

  return (
    <div style={{ background:C.cream, minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;600;800&display=swap');
        @keyframes pg-fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Hero banner ── */}
      <div style={{
        background:`linear-gradient(135deg,${C.pinkPale} 0%,${C.cream} 60%,${C.creamDark} 100%)`,
        padding:"44px 20px 38px",
        textAlign:"center",
        borderBottom:`1px solid ${C.creamDeep}`,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", width:280, height:280, top:"-80px", right:"-60px", borderRadius:"50%", background:"rgba(231,84,128,0.07)", filter:"blur(55px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:180, height:180, bottom:"-40px", left:"-40px", borderRadius:"50%", background:"rgba(244,167,185,0.1)", filter:"blur(45px)", pointerEvents:"none" }} />

        <span style={{
          display:"inline-flex", alignItems:"center", gap:"6px",
          background:C.pink, color:C.white,
          fontSize:"10px", fontWeight:800, letterSpacing:"0.22em",
          textTransform:"uppercase", padding:"5px 14px", borderRadius:"999px",
          marginBottom:"12px",
        }}>
          {accentLabel}
        </span>
        <h1 style={{
          fontSize:"clamp(2rem,5vw,3rem)",
          fontWeight:900, color:C.text, margin:"0 0 8px",
          fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1.1,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color:C.textMid, fontSize:"15px", margin:0 }}>{subtitle}</p>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div style={{
        maxWidth:"1280px", margin:"0 auto",
        padding:"18px 20px",
        display:"flex", flexWrap:"wrap", alignItems:"center",
        justifyContent:"space-between", gap:"12px",
        borderBottom:`1px solid ${C.creamDeep}`,
        background:C.white,
        position:"sticky", top:"0", zIndex:20,
        boxShadow:"0 2px 12px rgba(0,0,0,0.04)",
      }}>
        {/* Left — count + filters */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
          <span style={{ fontSize:"13px", fontWeight:700, color:C.textMid }}>
            {list.length} product{list.length !== 1 ? "s" : ""}
          </span>

          {/* Free delivery toggle */}
          <button
            onClick={() => setFreeOnly(f => !f)}
            style={{
              display:"flex", alignItems:"center", gap:"5px",
              padding:"6px 12px", borderRadius:"999px",
              border:`1.5px solid ${freeOnly ? "#16a34a" : C.creamDeep}`,
              background: freeOnly ? "#f0fdf4" : C.white,
              color: freeOnly ? "#16a34a" : C.textMid,
              fontSize:"12px", fontWeight:700, cursor:"pointer",
              transition:"all .18s",
            }}
          >
            <Truck size={12} /> Free Delivery
            {freeOnly && <X size={11} />}
          </button>

          {/* Clear filters */}
          {activeFilters > 0 && (
            <button
              onClick={() => setFreeOnly(false)}
              style={{ fontSize:"12px", fontWeight:600, color:C.pink, background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Right — search + sort */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
          {/* Search */}
          <div style={{
            display:"flex", alignItems:"center", gap:"8px",
            padding:"8px 14px", borderRadius:"10px",
            border:`1.5px solid ${C.creamDeep}`, background:C.white,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.pinkLight} strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                border:"none", outline:"none", background:"transparent",
                fontSize:"13px", color:C.text, width:"130px",
                fontFamily:"'DM Sans',sans-serif",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:C.pinkLight, padding:0, lineHeight:1 }}>
                <X size={13} />
              </button>
            )}
          </div>

          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"28px 20px 60px" }}>
        {list.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 20px" }}>
            <div style={{ fontSize:"48px", marginBottom:"12px" }}>🔍</div>
            <p style={{ fontWeight:800, fontSize:"18px", color:C.text, margin:"0 0 6px" }}>No products found</p>
            <p style={{ color:C.textMid, fontSize:"14px" }}>{emptyMsg || "Try adjusting your filters or search."}</p>
          </div>
        ) : (
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",
            gap:"18px",
          }}>
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} idx={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
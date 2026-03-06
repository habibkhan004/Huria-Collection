import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, ArrowLeft, Plus, Minus, Check, Truck, RefreshCw, Shield } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

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

export default function ProductDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { addToCart, totalItems } = useCart();
  const { getProductById } = useProducts();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedSize,  setSelectedSize]  = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const p = await getProductById(id);
      if (mounted) {
        setProduct(p);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, getProductById]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || null);
      setSelectedColor(0);
    }
  }, [product]);

  if (loading) return (
    <div style={{ minHeight:"60vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"16px", background:C.cream }}>
      <p style={{ color:C.textMid, fontSize:"16px" }}>Loading product…</p>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight:"60vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"16px", background:C.cream }}>
      <p style={{ color:C.textMid, fontSize:"16px" }}>Product not found.</p>
      <button onClick={() => navigate(-1)} style={{ padding:"10px 24px", borderRadius:"999px", background:C.pink, color:C.white, border:"none", cursor:"pointer", fontWeight:700 }}>
        Go Back
      </button>
    </div>
  );

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      selectedColor: product.colorNames[selectedColor] || null,
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
  const item = {
    ...product,
    selectedSize,
    selectedColor: product.colorNames[selectedColor] || null,
  };

  addToCart(item, qty);   // optionally add to cart
  navigate("/checkout");  // redirect to checkout page
};

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <div style={{ background:C.cream, minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" }}>
      {/* Breadcrumb / Back */}
      <div style={{ background:C.creamDark, borderBottom:`1px solid ${C.creamDeep}` }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-10" style={{ padding:"12px 20px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"none", border:"none", cursor:"pointer", color:C.textMid, fontSize:"13px", fontWeight:600, padding:0 }}
            onMouseEnter={e => e.currentTarget.style.color = C.pink}
            onMouseLeave={e => e.currentTarget.style.color = C.textMid}
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-5 sm:px-10" style={{ padding:"40px 20px 72px", display:"grid", gridTemplateColumns:"1fr", gap:"40px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"40px", alignItems:"start" }}>

          {/* LEFT — Main Image */}
          <div style={{ animation:"pd-scaleIn 0.55s ease both" }}>
            <div style={{
              aspectRatio:"1/1", borderRadius:"24px", overflow:"hidden",
              background:C.creamDark, position:"relative",
              boxShadow:`0 16px 48px rgba(231,84,128,0.12)`,
            }}>
              <img
                src={product.img}
                alt={product.name}
                style={{ width:"100%", height:"100%", objectFit:"cover", transition:"opacity 0.3s ease" }}
              />
              {product.sale && (
                <span style={{
                  position:"absolute", top:"14px", left:"14px",
                  background:C.pink, color:C.white,
                  fontSize:"11px", fontWeight:800, padding:"4px 11px", borderRadius:"999px",
                  animation:"pd-pop 0.4s ease both",
                }}>
                  {product.saleLabel}
                </span>
              )}
              {product.isNew && (
                <span style={{
                  position:"absolute", top:"14px", left: product.sale ? "80px" : "14px",
                  background:C.text, color:C.white,
                  fontSize:"11px", fontWeight:800, padding:"4px 11px", borderRadius:"999px",
                }}>
                  NEW
                </span>
              )}
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div style={{ display:"flex", flexDirection:"column", gap:"20px", animation:"pd-fadeUp 0.55s ease 0.1s both" }}>

            {/* Category + Wishlist */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:C.pinkLight }}>
                {product.category}
              </span>
              <button
                onClick={() => setWished(w => !w)}
                style={{
                  width:38, height:38, borderRadius:"50%", border:`1.5px solid ${wished ? C.pink : C.creamDeep}`,
                  background: wished ? C.pinkPale : C.white,
                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all .2s",
                }}
              >
                <Heart size={17} fill={wished ? C.pink : "none"} color={wished ? C.pink : C.textMid} />
              </button>
            </div>

            {/* Name */}
            <h1 style={{
              fontSize:"clamp(1.6rem,3.5vw,2.2rem)", fontWeight:900, color:C.text, margin:0,
              fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1.15,
            }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
              <span style={{ fontSize:"26px", fontWeight:900, color:C.pink }}>
                PKR {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span style={{ fontSize:"16px", color:C.pinkLight, textDecoration:"line-through" }}>
                    PKR {product.originalPrice.toLocaleString()}
                  </span>
                  <span style={{
                    background:C.pinkPale, color:C.pink,
                    fontSize:"12px", fontWeight:800, padding:"3px 10px", borderRadius:"999px",
                  }}>
                    Save PKR {savings.toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ color:C.textMid, fontSize:"14px", lineHeight:1.75, margin:0, paddingBottom:"4px", borderBottom:`1px solid ${C.creamDeep}` }}>
              {product.description}
            </p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <p style={{ fontSize:"12px", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:C.text, marginBottom:"10px" }}>
                  Color — <span style={{ color:C.pink, fontStyle:"italic", textTransform:"none", letterSpacing:0 }}>{product.colorNames[selectedColor]}</span>
                </p>
                <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      title={product.colorNames[i]}
                      style={{
                        width:30, height:30, borderRadius:"50%",
                        background:color,
                        border: i === selectedColor ? `3px solid ${C.pink}` : `2px solid ${C.creamDeep}`,
                        cursor:"pointer",
                        boxShadow: i === selectedColor ? `0 0 0 2px ${C.white}, 0 0 0 4px ${C.pink}` : "0 1px 4px rgba(0,0,0,0.12)",
                        transition:"all .2s",
                        position:"relative",
                        outline:"none",
                      }}
                    >
                      {i === selectedColor && (
                        <Check size={12} style={{
                          position:"absolute", top:"50%", left:"50%",
                          transform:"translate(-50%,-50%)",
                          color: color === "#ffffff" || color === "#f5e6dc" || color === "#f5deb3" || color === "#f7d794" || color === "#f5f5f5" || color === "#e8b4b8" ? C.text : C.white,
                        }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <p style={{ fontSize:"12px", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:C.text, marginBottom:"10px" }}>
                  {product.collection === "shoes" ? "Size (EU)" : "Size"}
                </p>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding:"8px 16px", borderRadius:"10px",
                        border: `1.5px solid ${selectedSize === size ? C.pink : C.creamDeep}`,
                        background: selectedSize === size ? C.pinkPale : C.white,
                        color: selectedSize === size ? C.pink : C.textMid,
                        fontSize:"13px", fontWeight:700, cursor:"pointer",
                        transition:"all .18s",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p style={{ fontSize:"12px", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:C.text, marginBottom:"10px" }}>
                Quantity
              </p>
              <div style={{ display:"inline-flex", alignItems:"center", gap:0, border:`1.5px solid ${C.creamDeep}`, borderRadius:"12px", overflow:"hidden", background:C.white }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width:42, height:42, border:"none", background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.textMid, transition:"background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.pinkPale}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <Minus size={15} />
                </button>
                <span style={{ minWidth:"40px", textAlign:"center", fontSize:"15px", fontWeight:800, color:C.text }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{ width:42, height:42, border:"none", background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.textMid, transition:"background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.pinkPale}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              style={{
                width:"100%", padding:"15px",
                borderRadius:"14px", border:"none", cursor:"pointer",
                fontWeight:800, fontSize:"14px", letterSpacing:"0.08em", textTransform:"uppercase",
                display:"flex", alignItems:"center", justifyContent:"center", gap:"9px",
                background: added
                  ? `linear-gradient(135deg,#22c55e,#16a34a)`
                  : `linear-gradient(135deg,${C.pink},${C.pinkDark})`,
                color:C.white,
                boxShadow: added ? "0 6px 20px rgba(34,197,94,0.35)" : `0 6px 20px rgba(231,84,128,0.3)`,
                transition:"background .3s, box-shadow .3s",
              }}
            >
              {added
                ? <><Check size={17} /> Added to Cart!</>
                : <><ShoppingBag size={17} /> Add to Cart — PKR {(product.price * qty).toLocaleString()}</>
              }
            </button>
            <button
  onClick={handleBuyNow}
  style={{
    width: "100%",
    padding: "15px",
    borderRadius: "14px",
    border: `2px solid ${C.pink}`,
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "14px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    background: C.white,
    color: C.pink,
    transition: "all .25s ease",
  }}
  onMouseEnter={e => {
    e.currentTarget.style.background = C.pink;
    e.currentTarget.style.color = C.white;
  }}
  onMouseLeave={e => {
    e.currentTarget.style.background = C.white;
    e.currentTarget.style.color = C.pink;
  }}
>
  Buy Now — PKR {(product.price * qty).toLocaleString()}
</button>

            {/* Cart count hint */}
            {totalItems > 0 && (
              <p style={{ textAlign:"center", fontSize:"12px", color:C.textMid, margin:"-8px 0 0" }}>
                🛍️ You have <strong style={{ color:C.pink }}>{totalItems} item{totalItems > 1 ? "s" : ""}</strong> in your cart
              </p>
            )}

            {/* Trust badges */}
            <div style={{
              display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px",
              paddingTop:"16px", borderTop:`1px solid ${C.creamDeep}`,
            }}>
              {[ { Icon:Truck, title:"Fast Delivery", sub:"Nationwide" },
                 { Icon:RefreshCw, title:"Easy Returns", sub:"Within 7 days" },
                 { Icon:Shield, title:"100% Authentic", sub:"Guaranteed" } ].map(({ Icon, title, sub }) => (
                <div key={title} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"5px", textAlign:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:"10px", background:C.pinkPale, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon size={16} color={C.pink} />
                  </div>
                  <span style={{ fontSize:"11px", fontWeight:800, color:C.text }}>{title}</span>
                  <span style={{ fontSize:"10px", color:C.textMid }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
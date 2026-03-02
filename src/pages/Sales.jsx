import { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import ProductGrid from "../components/ProductsGrid";

const C = {
  pink:     "#e75480",
  pinkDark: "#b5355c",
  cream:    "#fff8f2",
  white:    "#ffffff",
  text:     "#3b1f2b",
};

// ─── Countdown timer ───────────────────────────────────────────────────────────
function useCountdown(hours = 23, minutes = 59, seconds = 59) {
  const [time, setTime] = useState({ h: hours, m: minutes, s: seconds });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 23, m: 59, s: 59 }; // reset
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

const Pad = n => String(n).padStart(2, "0");

const Digit = ({ value, label }) => (
  <div style={{ textAlign:"center" }}>
    <div style={{
      background:"rgba(255,255,255,0.18)", backdropFilter:"blur(8px)",
      borderRadius:"12px", padding:"10px 16px", minWidth:"56px",
      fontSize:"28px", fontWeight:900, color:C.white, lineHeight:1,
      fontFamily:"'Playfair Display',Georgia,serif",
      border:"1px solid rgba(255,255,255,0.25)",
    }}>
      {Pad(value)}
    </div>
    <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.75)", marginTop:"5px", display:"block" }}>
      {label}
    </span>
  </div>
);

// ─── Sale banner (shown above the ProductGrid) ─────────────────────────────────
function SaleBanner({ count }) {
  const { h, m, s } = useCountdown(11, 47, 33);
  return (
    <div style={{
      background:`linear-gradient(135deg,${C.pinkDark} 0%,${C.pink} 50%,#f06292 100%)`,
      padding:"32px 20px",
      textAlign:"center",
      position:"relative", overflow:"hidden",
    }}>
      {/* Decorative circles */}
      <div style={{ position:"absolute", width:220, height:220, top:"-60px", right:"-40px", borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:140, height:140, bottom:"-50px", left:"-30px", borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }} />

      <span style={{ display:"inline-block", background:"rgba(255,255,255,0.2)", color:C.white, fontSize:"10px", fontWeight:800, letterSpacing:"0.22em", textTransform:"uppercase", padding:"5px 14px", borderRadius:"999px", marginBottom:"10px" }}>
        🔥 Flash Sale
      </span>
      <h2 style={{ fontSize:"clamp(1.6rem,4vw,2.4rem)", fontWeight:900, color:C.white, margin:"0 0 4px", fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1.1 }}>
        Up to 31% Off — Today Only
      </h2>
      <p style={{ color:"rgba(255,255,255,0.82)", fontSize:"14px", margin:"0 0 20px" }}>
        {count} deals available. Sale ends in:
      </p>

      {/* Countdown */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
        <Digit value={h} label="Hours" />
        <span style={{ fontSize:"26px", fontWeight:900, color:C.white, marginBottom:"18px" }}>:</span>
        <Digit value={m} label="Mins" />
        <span style={{ fontSize:"26px", fontWeight:900, color:C.white, marginBottom:"18px" }}>:</span>
        <Digit value={s} label="Secs" />
      </div>
    </div>
  );
}

// ─── Savings summary bar ───────────────────────────────────────────────────────
function SavingsBar({ products }) {
  const totalSavings = products.reduce((acc, p) => {
    return acc + (p.originalPrice ? p.originalPrice - p.price : 0);
  }, 0);

  return (
    <div style={{
      background:C.white,
      borderBottom:"1px solid #ecddc8",
      padding:"12px 20px",
      display:"flex", flexWrap:"wrap",
      justifyContent:"center", gap:"24px",
    }}>
      {[
        { label:"Sale Items",     value: products.length },
        { label:"Max Discount",   value: "31% OFF" },
        { label:"You Can Save Up To", value:`PKR ${totalSavings.toLocaleString()}` },
        { label:"Free Delivery Items", value: products.filter(p => p.shippingFee === 0).length },
      ].map(({ label, value }) => (
        <div key={label} style={{ textAlign:"center" }}>
          <p style={{ fontSize:"17px", fontWeight:900, color:C.pink, margin:0 }}>{value}</p>
          <p style={{ fontSize:"10px", fontWeight:700, color:"#7a4058", letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function Sale() {
  const { getSaleProducts } = useProducts();
  const saleProducts = getSaleProducts();   // only products where sale === true

  return (
    <div>
      <SaleBanner count={saleProducts.length} />
      <SavingsBar products={saleProducts} />
      <ProductGrid
        products={saleProducts}
        accentLabel="🏷️ Limited Time Deals"
        title="On Sale Now"
        subtitle="Grab these deals before they're gone — prices won't last long."
        emptyMsg="No sale items right now. Check back soon!"
      />
    </div>
  );
}
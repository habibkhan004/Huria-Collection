import { useEffect, useRef, useState } from "react";
import { Heart, Star, Package, Truck } from "lucide-react";

// ─── Color tokens ──────────────────────────────────────────────────────────────
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

// ─── Simple scroll-reveal hook ─────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { icon: Package,  val: "1,200+", label: "Products"       },
  { icon: Heart,    val: "30k+",   label: "Happy Customers" },
  { icon: Star,     val: "4.9",    label: "Avg. Rating"    },
  { icon: Truck,    val: "Fast",   label: "Nationwide Delivery" },
];

// ─── Values ────────────────────────────────────────────────────────────────────
const VALUES = [
  { emoji: "💄", title: "Authentic Beauty",  desc: "Every cosmetic product is handpicked for quality, pigment, and lasting wear." },
  { emoji: "👠", title: "Premium Footwear",  desc: "From formal to casual — our shoe range blends style with all-day comfort." },
  { emoji: "🌸", title: "For Every Woman",   desc: "We celebrate diversity. Our collection speaks to every skin tone and style." },
  { emoji: "🚚", title: "Swift Delivery",    desc: "Order today, receive fast. We deliver across Pakistan with care." },
];

// ─── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, val, label, delay }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-2 p-6 rounded-2xl text-center transition-all duration-700"
      style={{
        background: C.white,
        border: `1px solid ${C.creamDeep}`,
        boxShadow: `0 4px 20px rgba(231,84,128,0.07)`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transitionDelay: delay,
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: C.pinkPale }}
      >
        <Icon size={22} color={C.pink} />
      </div>
      <span
        className="text-3xl font-black"
        style={{ color: C.text, fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {val}
      </span>
      <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: C.textMid }}>
        {label}
      </span>
    </div>
  );
};

// ─── Value card ────────────────────────────────────────────────────────────────
const ValueCard = ({ emoji, title, desc, delay }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="flex gap-4 p-5 rounded-2xl transition-all duration-700"
      style={{
        background: C.white,
        border: `1px solid ${C.creamDeep}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-24px)",
        transitionDelay: delay,
      }}
    >
      <div
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: C.pinkPale }}
      >
        {emoji}
      </div>
      <div>
        <h4
          className="font-black text-base mb-1"
          style={{ color: C.text, fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: C.textMid }}>
          {desc}
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
export default function About() {
  const [heroRef, heroVisible] = useReveal();
  const [storyRef, storyVisible] = useReveal();

  return (
    <div style={{ background: C.cream, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes ab-fadeUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ab-fadeLeft { from{opacity:0;transform:translateX(-32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes ab-scaleIn  { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        @keyframes ab-orbFloat {
          0%,100%{ transform:translate(0,0) scale(1); }
          50%    { transform:translate(8px,-10px) scale(1.06); }
        }
      `}</style>

      {/* ── HERO BANNER ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${C.pinkPale} 0%, ${C.cream} 55%, ${C.creamDark} 100%)`,
          padding: "80px 0 72px",
        }}
      >
        {/* Decorative orbs */}
        <div style={{ position:"absolute", width:340, height:340, top:"-100px", right:"-80px", borderRadius:"50%", background:"rgba(231,84,128,0.08)", filter:"blur(60px)", animation:"ab-orbFloat 10s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:200, height:200, bottom:"-40px", left:"-60px", borderRadius:"50%", background:"rgba(244,167,185,0.12)", filter:"blur(50px)", animation:"ab-orbFloat 14s ease-in-out infinite reverse", pointerEvents:"none" }} />

        <div
          ref={heroRef}
          className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center"
        >
          {/* Eyebrow */}
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
            style={{
              background: C.pink, color: C.white,
              animation: heroVisible ? "ab-fadeUp 0.5s ease both" : "none",
            }}
          >
            ✦ Our Story
          </span>

          {/* Headline */}
          <h1
            className="font-black leading-tight mb-5"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              color: C.text,
              fontFamily: "'Playfair Display', Georgia, serif",
              animation: heroVisible ? "ab-fadeUp 0.6s ease 0.1s both" : "none",
            }}
          >
            Where Beauty Meets{" "}
            <span style={{
              fontStyle: "italic",
              background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Elegance
            </span>
          </h1>

          {/* Sub */}
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{
              color: C.textMid,
              animation: heroVisible ? "ab-fadeUp 0.6s ease 0.2s both" : "none",
            }}
          >
            HURIA Collection is your one-stop destination for premium cosmetics and
            stylish footwear — curated with love, delivered across Pakistan.
          </p>

          {/* Divider line */}
          <div
            className="flex items-center justify-center gap-3 mt-8"
            style={{ animation: heroVisible ? "ab-fadeUp 0.6s ease 0.3s both" : "none" }}
          >
            <div className="h-px w-16" style={{ background: C.pinkLight }} />
            <span style={{ color: C.pink, fontSize: "20px" }}>♡</span>
            <div className="h-px w-16" style={{ background: C.pinkLight }} />
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section style={{ background: C.creamDark, padding: "48px 0" }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <StatCard key={i} {...s} delay={`${i * 0.1}s`} />
          ))}
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section style={{ padding: "72px 0" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 grid lg:grid-cols-2 gap-12 items-center">

          {/* Image side */}
          <div
            ref={storyRef}
            className="relative"
            style={{
              animation: storyVisible ? "ab-scaleIn 0.7s ease both" : "none",
            }}
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                aspectRatio: "4/3",
                background: `linear-gradient(135deg, ${C.pinkPale}, ${C.creamDark})`,
                boxShadow: `0 24px 60px rgba(231,84,128,0.14)`,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700&q=80"
                alt="HURIA Collection — Beauty products"
                style={{ width:"100%", height:"100%", objectFit:"cover" }}
              />
            </div>
            {/* Floating card */}
            <div
              className="absolute -bottom-5 -right-4 sm:-right-6 px-5 py-3 rounded-2xl shadow-xl"
              style={{ background: C.white, border: `1px solid ${C.creamDeep}` }}
            >
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: C.pink }}>Est.</p>
              <p className="text-2xl font-black" style={{ color: C.text, fontFamily: "'Playfair Display', serif" }}>2020</p>
            </div>
          </div>

          {/* Text side */}
          <div
            style={{
              animation: storyVisible ? "ab-fadeLeft 0.7s ease 0.15s both" : "none",
            }}
          >
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: C.pink }}>
              ✦ Who We Are
            </span>
            <h2
              className="font-black leading-tight mt-2 mb-4"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                color: C.text,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Passion for Beauty,{" "}
              <span style={{ fontStyle: "italic", color: C.pink }}>Pride in Style</span>
            </h2>
            <div className="space-y-4" style={{ color: C.textMid, lineHeight: 1.75, fontSize: "15px" }}>
              <p>
                HURIA Collection was born from a simple belief — every woman deserves to
                feel beautiful, confident, and stylish without breaking the bank.
              </p>
              <p>
                We source the finest cosmetics and footwear from trusted suppliers,
                bringing you premium quality at honest prices. From bold lipsticks to
                elegant heels, every product in our collection is chosen with you in mind.
              </p>
              <p>
                Based in Pakistan, we are proud to serve thousands of happy customers
                nationwide — and we're just getting started.
              </p>
            </div>

            <a
              href="/shop"
              className="inline-flex items-center gap-2 mt-7 px-7 py-3 rounded-full text-sm font-black tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
                color: C.white,
                boxShadow: `0 6px 20px ${C.pinkLight}`,
              }}
            >
              Shop the Collection →
            </a>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ── */}
      <section style={{ background: C.creamDark, padding: "72px 0" }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: C.pink }}>✦ What We Stand For</span>
            <h2
              className="font-black mt-2"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                color: C.text,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Our Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {VALUES.map((v, i) => (
              <ValueCard key={i} {...v} delay={`${i * 0.1}s`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
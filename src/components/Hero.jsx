import { useState, useEffect, useRef } from "react";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Star } from "lucide-react";

// ─── Color tokens (same as Navbar) ────────────────────────────────────────────
const C = {
  pink:      "#e75480",
  pinkLight: "#f4a7b9",
  pinkPale:  "#fde8ef",
  pinkDark:  "#b5355c",
  cream:     "#fff8f2",
  creamDark: "#f5e6dc",
  text:      "#3b1f2b",
  textMid:   "#7a4058",
  white:     "#ffffff",
};

// ─── Slide data — replace image URLs with your actual product images ──────────
const SLIDES = [
  {
    id: 0,
    badge: "New Collection",
    headline: ["Glow Up Your", "World"],
    accent: "Cosmetics",
    sub: "Luxury beauty essentials crafted for every skin tone. Bold, vibrant, and made to last.",
    cta: "Shop Cosmetics",
    ctaLink: "/cosmetics",
    tag: "Up to 30% off",
    stats: [{ label: "Shades", val: "200+" }, { label: "Brands", val: "50+" }, { label: "Reviews", val: "10k+" }],
    // Gradient used as placeholder — swap src below for a real image
    imgGradient: `linear-gradient(135deg, #f9d6e3 0%, #f4a7b9 40%, #e75480 100%)`,
    imgSrc: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    floatEmoji: ["💄", "✨", "💋", "🌸"],
    bgGrad: `linear-gradient(135deg, ${C.pinkPale} 0%, ${C.cream} 60%, #fff0f5 100%)`,
  },
  {
    id: 1,
    badge: "Just Dropped",
    headline: ["Step Into", "Style"],
    accent: "Footwear",
    sub: "Every stride deserves elegance. Discover our curated collection of heels, sneakers & more.",
    cta: "Shop Shoes",
    ctaLink: "/shoes",
    tag: "Sale up to 40%",
    stats: [{ label: "Styles", val: "500+" }, { label: "Sizes", val: "UK 3-12" }, { label: "Sold", val: "25k+" }],
    imgGradient: `linear-gradient(135deg, #ffe0ec 0%, #f4a7b9 40%, #c9496e 100%)`,
    imgSrc: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    floatEmoji: ["👠", "✨", "👟", "🌷"],
    bgGrad: `linear-gradient(135deg, #fff5f8 0%, ${C.cream} 60%, ${C.creamDark} 100%)`,
  },
  {
    id: 2,
    badge: "Exclusive Deals",
    headline: ["Beauty Meets", "Elegance"],
    accent: "Luxury Picks",
    sub: "Handpicked premium cosmetics and footwear for the woman who knows her worth.",
    cta: "Explore All",
    ctaLink: "/collections",
    tag: "Members Save Extra 10%",
    stats: [{ label: "Products", val: "1200+" }, { label: "Happy Clients", val: "30k+" }, { label: "Awards", val: "12" }],
    imgGradient: `linear-gradient(135deg, #fce4ec 0%, #e91e8c 60%, #880e4f 100%)`,
    imgSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    floatEmoji: ["💎", "🌹", "👑", "✨"],
    bgGrad: `linear-gradient(135deg, #fff8f2 0%, #fff0f5 60%, ${C.creamDark} 100%)`,
  },
];

// ─── Floating particle orbs ────────────────────────────────────────────────────
const ORBS = [
  { size: 320, top: "-80px",  left: "-60px",  color: "rgba(231,84,128,0.08)", delay: "0s",   dur: "8s"  },
  { size: 200, top: "40%",    right: "-40px",  color: "rgba(244,167,185,0.12)", delay: "1s",  dur: "11s" },
  { size: 140, bottom: "60px",left: "30%",     color: "rgba(231,84,128,0.07)", delay: "2s",  dur: "9s"  },
  { size: 90,  top: "20%",    left: "20%",     color: "rgba(255,182,193,0.18)", delay: "0.5s",dur: "6s"  },
];

// ─── Floating emoji badge ──────────────────────────────────────────────────────
const FloatingEmoji = ({ emoji, style }) => (
  <div
    className="absolute text-2xl select-none pointer-events-none"
    style={{
      ...style,
      animation: `floatUp ${3 + Math.random() * 3}s ease-in-out infinite alternate`,
    }}
  >
    {emoji}
  </div>
);

// ─── Star rating row ───────────────────────────────────────────────────────────
const Stars = () => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={13} fill={C.pink} color={C.pink} />
    ))}
    <span className="ml-1.5 text-xs font-semibold" style={{ color: C.textMid }}>4.9 · 10,000+ reviews</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export default function HeroSection() {
  const [active, setActive]     = useState(0);
  const [prev, setPrev]         = useState(null);
  const [dir, setDir]           = useState(1);       // 1 = forward, -1 = back
  const [animKey, setAnimKey]   = useState(0);
  const [paused, setPaused]     = useState(false);
  const [imgLoaded, setImgLoaded] = useState({});
  const timerRef = useRef(null);

  const goTo = (idx, direction = 1) => {
    setPrev(active);
    setDir(direction);
    setActive(idx);
    setAnimKey((k) => k + 1);
  };

  const next = () => goTo((active + 1) % SLIDES.length, 1);
  const back = () => goTo((active - 1 + SLIDES.length) % SLIDES.length, -1);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, 5200);
    return () => clearTimeout(timerRef.current);
  }, [active, paused]);

  const slide = SLIDES[active];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "92vh",
        background: slide.bgGrad,
        transition: "background 0.9s ease",
        fontFamily: "'Playfair Display', 'Georgia', serif",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Keyframe styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes floatUp {
          from { transform: translateY(0px) rotate(-3deg) scale(1);   }
          to   { transform: translateY(-18px) rotate(4deg) scale(1.08); }
        }
        @keyframes orbPulse {
          0%,100% { transform: scale(1) translate(0,0); opacity: 0.6; }
          50%      { transform: scale(1.15) translate(8px,-8px); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.82); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes tickerSlide {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes badgePop {
          0%   { opacity: 0; transform: scale(0.5) rotate(-6deg); }
          70%  { transform: scale(1.08) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .hero-btn {
          position: relative;
          overflow: hidden;
        }
        .hero-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
          background-size: 300% 100%;
          animation: shimmer 2.5s ease-in-out infinite;
        }
        .hero-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(231,84,128,0.45); }
        .hero-btn:active { transform: translateY(0); }
      `}</style>

      {/* ── Background orbs ── */}
      {ORBS.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: o.size,
            height: o.size,
            top: o.top,
            left: o.left,
            right: o.right,
            bottom: o.bottom,
            background: o.color,
            filter: "blur(40px)",
            animation: `orbPulse ${o.dur} ${o.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {/* ── Decorative diagonal line ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            -55deg,
            transparent,
            transparent 80px,
            rgba(231,84,128,0.025) 80px,
            rgba(231,84,128,0.025) 81px
          )`,
        }}
      />

      {/* ── Main content grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-0 min-h-[92vh] py-16 lg:py-0">

        {/* LEFT — Text content */}
        <div className="flex-1 flex flex-col gap-6 lg:pr-10" key={`text-${animKey}`}>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
              color: C.white,
              boxShadow: `0 4px 16px ${C.pinkLight}`,
              animation: "badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
              animationDelay: "0.1s",
            }}
          >
            <Sparkles size={13} />
            {slide.badge}
          </div>

          {/* Headline */}
          <div style={{ animation: "slideInLeft 0.65s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
              style={{ color: C.text, fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {slide.headline[0]}
              <br />
              <span
                className="italic"
                style={{
                  background: `linear-gradient(135deg, ${C.pink} 0%, ${C.pinkDark} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {slide.headline[1]}
              </span>
            </h1>

            {/* Accent tag */}
            <div className="flex items-center gap-3 mt-3">
              <div className="h-px flex-1 max-w-[48px]" style={{ background: C.pinkLight }} />
              <span
                className="text-xs font-black tracking-[0.35em] uppercase"
                style={{ color: C.pink }}
              >
                {slide.accent}
              </span>
              <div className="h-px flex-1 max-w-[48px]" style={{ background: C.pinkLight }} />
            </div>
          </div>

          {/* Sub text */}
          <p
            className="text-base sm:text-lg leading-relaxed max-w-md"
            style={{
              color: C.textMid,
              fontFamily: "'DM Sans', sans-serif",
              animation: "fadeUp 0.65s ease 0.4s both",
            }}
          >
            {slide.sub}
          </p>

          {/* Stars */}
          <div style={{ animation: "fadeUp 0.65s ease 0.5s both" }}>
            <Stars />
          </div>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-3"
            style={{ animation: "fadeUp 0.65s ease 0.55s both" }}
          >
            <a
              href={slide.ctaLink}
              className="hero-btn inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-black tracking-wide uppercase transition-all duration-200"
              style={{
                background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
                color: C.white,
                boxShadow: `0 6px 24px ${C.pinkLight}`,
              }}
            >
              {slide.cta}
              <ArrowRight size={16} />
            </a>

            <a
              href="/collections"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold tracking-wide border-2 transition-all duration-200 hover:shadow-md"
              style={{
                borderColor: C.pinkLight,
                color: C.pink,
                background: "rgba(255,255,255,0.7)",
              }}
            >
              View All
            </a>

            {/* Sale tag pill */}
            <span
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black tracking-wide"
              style={{ background: C.pinkPale, color: C.pinkDark }}
            >
              🏷️ {slide.tag}
            </span>
          </div>

          {/* Stats row */}
          <div
            className="flex items-center gap-6 pt-2"
            style={{ animation: "fadeUp 0.65s ease 0.7s both" }}
          >
            {slide.stats.map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-2xl font-black"
                  style={{ color: C.text, fontFamily: "'Playfair Display', serif" }}
                >
                  {s.val}
                </div>
                <div className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: C.textMid }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Image card */}
        <div
          className="flex-1 flex items-center justify-center relative lg:justify-end"
          key={`img-${animKey}`}
          style={{ animation: "scaleIn 0.75s cubic-bezier(0.34,1.4,0.64,1) 0.15s both" }}
        >
          {/* Floating emojis */}
          {slide.floatEmoji.map((em, i) => (
            <FloatingEmoji
              key={i}
              emoji={em}
              style={{
                top:   i === 0 ? "8%"  : i === 1 ? "15%" : i === 2 ? "75%" : "60%",
                left:  i === 0 ? "5%"  : i === 3 ? "4%"  : undefined,
                right: i === 1 ? "4%"  : i === 2 ? "5%"  : undefined,
                animationDelay: `${i * 0.4}s`,
                zIndex: 20,
                fontSize: "1.8rem",
              }}
            />
          ))}

          {/* Spinning decorative ring */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 420,
              height: 420,
              border: `2px dashed ${C.pinkLight}`,
              opacity: 0.5,
              animation: "spinSlow 20s linear infinite",
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 360,
              height: 360,
              border: `1px solid ${C.pinkPale}`,
              opacity: 0.7,
              animation: "spinSlow 14s linear infinite reverse",
            }}
          />

          {/* Main image card */}
          <div
            className="relative rounded-[32px] overflow-hidden shadow-2xl"
            style={{
              width: "min(420px, 88vw)",
              aspectRatio: "3/4",
              background: slide.imgGradient,
              boxShadow: `0 32px 80px rgba(231,84,128,0.25), 0 8px 24px rgba(0,0,0,0.08)`,
            }}
          >
            <img
              src={slide.imgSrc}
              alt={slide.cta}
              className="w-full h-full object-cover"
              style={{
                opacity: imgLoaded[slide.id] ? 1 : 0,
                transition: "opacity 0.5s ease",
              }}
              onLoad={() => setImgLoaded((p) => ({ ...p, [slide.id]: true }))}
            />

            {/* Image overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${C.pinkDark}55 0%, transparent 50%)`,
              }}
            />

            {/* Bottom label on image */}
            <div
              className="absolute bottom-5 left-5 right-5 flex items-center justify-between"
            >
              <div
                className="px-4 py-2 rounded-2xl backdrop-blur-sm text-white text-sm font-bold"
                style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                ✨ {slide.badge}
              </div>
              <a
                href={slide.ctaLink}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ background: C.white, color: C.pink, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
              >
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Top-right discount badge */}
            <div
              className="absolute top-5 right-5 w-16 h-16 rounded-full flex flex-col items-center justify-center text-center"
              style={{
                background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
                color: C.white,
                boxShadow: `0 4px 16px ${C.pinkLight}`,
                animation: "badgePop 0.6s ease 0.8s both",
              }}
            >
              <span className="text-[10px] font-black leading-none">UP TO</span>
              <span className="text-xl font-black leading-none">40%</span>
              <span className="text-[9px] font-bold">OFF</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide controls ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
        {/* Dot indicators with progress */}
        <div className="flex items-center gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > active ? 1 : -1)}
              className="relative overflow-hidden rounded-full transition-all duration-300"
              style={{
                width: i === active ? 36 : 10,
                height: 10,
                background: i === active ? C.pinkLight : "rgba(231,84,128,0.25)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === active && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: C.pink,
                    animation: `progressBar 5.2s linear`,
                    animationFillMode: "forwards",
                  }}
                  key={animKey}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Prev / Next arrows ── */}
      {[
        { fn: back, icon: <ChevronLeft size={20} />,  pos: "left-4 sm:left-8"  },
        { fn: next, icon: <ChevronRight size={20} />, pos: "right-4 sm:right-8" },
      ].map(({ fn, icon, pos }, i) => (
        <button
          key={i}
          onClick={fn}
          className={`absolute top-1/2 -translate-y-1/2 ${pos} z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110`}
          style={{
            background: "rgba(255,255,255,0.85)",
            color: C.pink,
            boxShadow: "0 4px 16px rgba(231,84,128,0.18)",
            backdropFilter: "blur(8px)",
          }}
        >
          {icon}
        </button>
      ))}

      {/* ── Scrolling ticker tape at bottom ── */}
      <div
        className="absolute bottom-0 left-0 right-0 py-2.5 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})` }}
      >
        <div
          className="flex items-center gap-12 whitespace-nowrap text-xs font-bold tracking-widest uppercase"
          style={{
            color: "rgba(255,255,255,0.9)",
            animation: "tickerSlide 18s linear infinite",
            width: "max-content",
          }}
        >
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              <span>✨ Free Shipping Over PKR 3,000</span>
              <span>💄 New Cosmetics Dropped</span>
              <span>👠 Luxury Footwear Collection</span>
              <span>🎁 Buy 2 Get 1 Free</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
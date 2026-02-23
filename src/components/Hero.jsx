import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 0,
    theme: {
      // ── Light warm sand/beige theme for shoes ──
      bg:         "#f5efe6",          // warm light sand
      accent:     "#8b6f47",          // warm brown
      accentDark: "#5c4430",          // deep brown
      text:       "#2d1f0e",          // dark warm brown text
      sub:        "#7a6248",          // mid brown subtext
      badge:      { bg: "#e8d8c4", color: "#5c4430" },
      btnPrimary: { bg: "linear-gradient(135deg,#8b6f47,#5c4430)", color: "#fff5ee" },
      imgRing:    "rgba(139,111,71,0.18)",
      orb1:       "rgba(200,170,130,0.18)",
      orb2:       "rgba(230,210,185,0.25)",
      ticker:     "linear-gradient(135deg,#8b6f47,#5c4430)",
      dotActive:  "#8b6f47",
    },
    badge:   "New Arrivals",
    headline: "Step Into\nBold Style",
    sub:     "Premium men's footwear — crafted for comfort, built for confidence.",
    cta:     "Shop Men's Shoes",
    ctaLink: "/shoes/men",
    imgSrc:  "/shoes2.jpg",
    imgAlt:  "Men's shoes collection",
    tag:     "Sale up to 40% off",
  },
  {
    id: 1,
    theme: {
      // ── Warm cream + rose theme for cosmetics ──
      bg:         "#fff8f2",          // warm cream
      accent:     "#d4796a",          // muted rose
      accentDark: "#a85547",          // deep rose
      text:       "#3b1f2b",          // dark plum text
      sub:        "#7a5040",          // mid rose-brown subtext
      badge:      { bg: "#f4a7b9", color: "#3b1f2b" },
      btnPrimary: { bg: "linear-gradient(135deg,#e75480,#b5355c)", color: "#fff" },
      imgRing:    "rgba(212,121,106,0.15)",
      orb1:       "rgba(244,167,185,0.14)",
      orb2:       "rgba(255,220,200,0.22)",
      ticker:     "linear-gradient(135deg,#e75480,#b5355c)",
      dotActive:  "#e75480",
    },
    badge:   "Beauty Edit",
    headline: "Glow Up\nYour World",
    sub:     "Luxury cosmetics for every skin tone — vibrant, long-lasting, and you.",
    cta:     "Shop Cosmetics",
    ctaLink: "/cosmetics",
    imgSrc:  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&q=85",
    imgAlt:  "Cosmetics collection",
    tag:     "Buy 2 Get 1 Free",
  },
];

export default function HeroSection() {
  const [active, setActive]   = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused]   = useState(false);
  const [loaded, setLoaded]   = useState({});
  const timer = useRef(null);

  const goTo = (idx) => { setActive(idx); setAnimKey(k => k + 1); };
  const next = () => goTo((active + 1) % SLIDES.length);
  const back = () => goTo((active - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused) return;
    timer.current = setTimeout(next, 3000);
    return () => clearTimeout(timer.current);
  }, [active, paused]);

  const s = SLIDES[active];
  const T = s.theme;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: "70vh",
        minHeight: "480px",
        maxHeight: "780px",
        background: T.bg,
        transition: "background 0.8s ease",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes hs-fadeLeft {
          from { opacity:0; transform:translateX(-40px); }
          to   { opacity:1; transform:translateX(0);     }
        }
        @keyframes hs-fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes hs-scaleIn {
          from { opacity:0; transform:scale(0.88) translateX(28px); }
          to   { opacity:1; transform:scale(1)    translateX(0);    }
        }
        @keyframes hs-badgePop {
          0%  { opacity:0; transform:scale(0.6); }
          75% { transform:scale(1.06);           }
          100%{ opacity:1; transform:scale(1);   }
        }
        @keyframes hs-orbFloat {
          0%,100%{ transform:scale(1) translate(0,0);         }
          50%    { transform:scale(1.1) translate(5px,-5px);  }
        }
        @keyframes hs-imgFloat {
          0%,100%{ transform:translateY(0px);  }
          50%    { transform:translateY(-9px); }
        }
        @keyframes hs-spin {
          from{ transform:rotate(0deg);   }
          to  { transform:rotate(360deg); }
        }
        @keyframes hs-progress {
          from{ width:0%;   }
          to  { width:100%; }
        }
        @keyframes hs-ticker {
          0%  { transform:translateX(0);    }
          100%{ transform:translateX(-50%); }
        }
        .hs-btn {
          position:relative; overflow:hidden;
          transition:transform .2s, box-shadow .2s;
        }
        .hs-btn:hover { transform:translateY(-2px); }
        .hs-btn::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(120deg,transparent 35%,rgba(255,255,255,0.2) 50%,transparent 65%);
          animation:hs-shimmer 2.6s ease-in-out infinite;
          background-size:260% 100%;
        }
        @keyframes hs-shimmer {
          0%  { background-position:-300px 0; }
          100%{ background-position:300px  0; }
        }
      `}</style>

      {/* ── Background orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position:"absolute", width:360, height:360,
          top:"-90px", left:"-70px", borderRadius:"50%",
          background:T.orb1, filter:"blur(65px)",
          animation:"hs-orbFloat 9s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute", width:240, height:240,
          bottom:"10px", right:"-50px", borderRadius:"50%",
          background:T.orb2, filter:"blur(55px)",
          animation:"hs-orbFloat 12s ease-in-out infinite reverse",
        }}/>
      </div>

      {/* ── Main layout ── */}
      <div
        className="relative z-10 h-full max-w-6xl mx-auto px-4 sm:px-10 lg:px-14 flex flex-col sm:flex-row items-center gap-3 sm:gap-8 lg:gap-14"
        key={`layout-${animKey}`}
        style={{ paddingBottom:"44px", paddingTop:"8px" }}
      >

        {/* LEFT — Text */}
        <div className="flex-1 flex flex-col gap-2 sm:gap-5 min-w-0 w-full text-center sm:text-left">

          {/* Badge */}
          <span
            className="inline-flex items-center self-start px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background:T.badge.bg, color:T.badge.color,
              animation:"hs-badgePop 0.5s cubic-bezier(.34,1.56,.64,1) 0.05s both",
            }}
          >
            ✦ {s.badge}
          </span>

          {/* Headline */}
          <h1
            style={{
              fontSize:"clamp(1.6rem,5vw,3.7rem)",
              fontFamily:"'Playfair Display',Georgia,serif",
              fontWeight:900,
              lineHeight:1.08,
              letterSpacing:"-0.01em",
              color:T.text,
              whiteSpace:"pre-line",
              animation:"hs-fadeLeft 0.6s cubic-bezier(.22,1,.36,1) 0.15s both",
            }}
          >
            {s.headline.split("\n")[0]}
            {"\n"}
            <span style={{
              fontStyle:"italic",
              background:T.btnPrimary.bg,
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
              backgroundClip:"text",
            }}>
              {s.headline.split("\n")[1]}
            </span>
          </h1>

          {/* Sub */}
          <p
            style={{
              color:T.sub,
              fontFamily:"'DM Sans',sans-serif",
              fontSize:"clamp(0.85rem,1.5vw,1rem)",
              lineHeight:1.65,
              maxWidth:"360px",
              animation:"hs-fadeUp 0.6s ease 0.3s both",
            }}
          >
            {s.sub}
          </p>

          {/* CTA row */}
          <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap", animation:"hs-fadeUp 0.6s ease 0.42s both" }}>
            <a
              href={s.ctaLink}
              className="hs-btn"
              style={{
                display:"inline-flex", alignItems:"center", gap:"8px",
                padding:"12px 26px", borderRadius:"999px",
                background:T.btnPrimary.bg, color:T.btnPrimary.color,
                fontSize:"13px", fontWeight:700, letterSpacing:"0.04em",
                textDecoration:"none",
                boxShadow:`0 6px 22px ${T.imgRing}`,
              }}
            >
              {s.cta} <ArrowRight size={15} />
            </a>

            <span style={{
              fontSize:"12px", fontWeight:600,
              padding:"7px 14px", borderRadius:"999px",
              background:"rgba(255,255,255,0.72)",
              color:T.accent,
              border:`1px solid ${T.imgRing}`,
              backdropFilter:"blur(4px)",
            }}>
              🏷️ {s.tag}
            </span>
          </div>
        </div>

        {/* RIGHT — Image — visible on all screens */}
        <div
          className="flex-shrink-0 flex items-center justify-center relative"
          style={{ animation:"hs-scaleIn 0.7s cubic-bezier(.34,1.4,.64,1) 0.1s both" }}
        >
          {/* Spinning ring — hidden on mobile to keep it clean */}
          <div className="hidden sm:block" style={{
            position:"absolute",
            width:370, height:370, borderRadius:"50%",
            border:`2px dashed ${T.imgRing}`,
            animation:"hs-spin 24s linear infinite",
            pointerEvents:"none",
          }}/>
          <div className="hidden sm:block" style={{
            position:"absolute",
            width:310, height:310, borderRadius:"50%",
            border:`1px solid ${T.imgRing}`,
            opacity:0.5,
            animation:"hs-spin 16s linear infinite reverse",
            pointerEvents:"none",
          }}/>

          {/* Image card — NO badges inside */}
          <div style={{
            width:"clamp(200px,55vw,320px)",
            aspectRatio:"3/4",
            borderRadius:"22px",
            overflow:"hidden",
            background:`linear-gradient(135deg,${T.orb1},${T.orb2})`,
            boxShadow:`0 28px 64px ${T.imgRing}, 0 6px 18px rgba(0,0,0,0.07)`,
            animation:"hs-imgFloat 4.5s ease-in-out infinite",
            position:"relative",
          }}>
            <img
              src={s.imgSrc}
              alt={s.imgAlt}
              style={{
                width:"100%", height:"100%", objectFit:"cover",
                opacity:loaded[s.id] ? 1 : 0,
                transition:"opacity 0.45s ease",
              }}
              onLoad={() => setLoaded(p => ({ ...p, [s.id]:true }))}
            />
            {/* Subtle bottom gradient only — no text/badges */}
            <div style={{
              position:"absolute", inset:0,
              background:`linear-gradient(to top, ${T.accentDark}55 0%, transparent 45%)`,
              pointerEvents:"none",
            }}/>
          </div>
        </div>
      </div>

      {/* ── Prev / Next arrows ── */}
      {[
        { fn:back, Icon:ChevronLeft,  css:"left:14px"  },
        { fn:next, Icon:ChevronRight, css:"right:14px" },
      ].map(({ fn, Icon, css }, i) => (
        <button
          key={i}
          onClick={fn}
          style={{
            position:"absolute", top:"50%",
            [css.split(":")[0]]: css.split(":")[1],
            transform:"translateY(-50%)",
            zIndex:20, width:40, height:40, borderRadius:"50%",
            background:"rgba(255,255,255,0.88)",
            color:T.accent, border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 4px 14px rgba(0,0,0,0.10)",
            transition:"transform .18s, box-shadow .18s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform="translateY(-50%) scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform="translateY(-50%) scale(1)"}
        >
          <Icon size={18} />
        </button>
      ))}

      {/* ── Dot indicators ── */}
      <div style={{
        position:"absolute", bottom:"48px", left:"50%", transform:"translateX(-50%)",
        display:"flex", alignItems:"center", gap:"8px", zIndex:20,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === active ? 32 : 10,
              height:10, borderRadius:99,
              border:"none", cursor:"pointer", padding:0,
              background: i === active ? T.dotActive : `${T.dotActive}44`,
              transition:"width .3s ease, background .3s ease",
              position:"relative", overflow:"hidden",
            }}
          >
            {i === active && (
              <span
                key={animKey}
                style={{
                  position:"absolute", top:0, left:0, height:"100%",
                  background:"rgba(255,255,255,0.55)",
                  animation:"hs-progress 3s linear forwards",
                  borderRadius:99,
                }}
              />
            )}
          </button>
        ))}
      </div>

    </section>
  );
}
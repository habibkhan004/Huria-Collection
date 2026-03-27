import { useEffect, useRef, useState } from "react";

const C = {
  pink:      "#e75480",
  pinkDark:  "#b5355c",
  pinkLight: "#f4a7b9",
  pinkPale:  "#fde8ef",
  cream:     "#fff8f2",
  creamDark: "#f5e6dc",
  creamDeep: "#ecddc8",
  text:      "#3b1f2b",
  textMid:   "#7a4058",
  white:     "#ffffff",
};

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── Decorative serif divider ──────────────────────────────────────────────────
const Divider = ({ light = false }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"14px", margin:"0 auto" }}>
    <div style={{ height:"1px", width:60, background: light ? "rgba(255,255,255,0.3)" : C.pinkLight }} />
    <span style={{ color: light ? "rgba(255,255,255,0.6)" : C.pink, fontSize:"16px", lineHeight:1 }}>✦</span>
    <div style={{ height:"1px", width:60, background: light ? "rgba(255,255,255,0.3)" : C.pinkLight }} />
  </div>
);

// ══════════════════════════════════════════════════════════════════════
// 1. WHY CHOOSE US
// ══════════════════════════════════════════════════════════════════════
const VALUES = [
  {
    icon: "✦",
    title: "100% Authentic",
    body: "Every product is carefully sourced and verified. No knock-offs, no compromises — only genuine quality delivered to your door.",
  },
  {
    icon: "🚚",
    title: "Swift Nationwide Delivery",
    body: "We dispatch within 24 hours. Whether you're in Karachi, Lahore or Peshawar — your order arrives fast.",
  },
  {
    icon: "💎",
    title: "Premium Selection",
    body: "Our buyers handpick every shoe and cosmetic. Only pieces that meet our standard of luxury make it to the collection.",
  },

  {
    icon: "💬",
    title: "Real Human Support",
    body: "Our team is available via WhatsApp, email and phone. You'll always speak to a real person, not a bot.",
  },

];

function WhyChooseUs() {
  const [headRef, headVisible] = useReveal();

  return (
    <section style={{
      background: `linear-gradient(160deg, ${C.pinkPale} 0%, ${C.cream} 45%, ${C.creamDark} 100%)`,
      padding: "80px 20px 88px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes wcu-orbFloat {
          0%,100%{ transform:translate(0,0) scale(1); }
          50%    { transform:translate(10px,-14px) scale(1.05); }
        }
        @keyframes wcu-cardIn {
          from{ opacity:0; transform:translateY(28px) scale(0.97); }
          to  { opacity:1; transform:translateY(0) scale(1); }
        }
        .wcu-card:hover {
          transform: translateY(-6px) !important;
          border-color: ${C.pinkLight} !important;
          box-shadow: 0 20px 48px rgba(231,84,128,0.12), 0 4px 16px rgba(0,0,0,0.04) !important;
        }
      `}</style>

      {/* Soft background orbs */}
      <div style={{ position:"absolute", width:480, height:480, top:"-100px", right:"-80px", borderRadius:"50%", background:"rgba(231,84,128,0.07)", filter:"blur(90px)", animation:"wcu-orbFloat 12s ease-in-out infinite", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:320, height:320, bottom:"-60px", left:"-60px", borderRadius:"50%", background:"rgba(244,167,185,0.1)", filter:"blur(70px)", animation:"wcu-orbFloat 16s ease-in-out infinite reverse", pointerEvents:"none" }} />

      <div style={{ maxWidth:"1200px", margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Heading */}
        <div
          ref={headRef}
          style={{
            textAlign:"center", marginBottom:"56px",
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span style={{
            display:"inline-flex", alignItems:"center", gap:"8px",
            fontSize:"10px", fontWeight:800, letterSpacing:"0.28em",
            textTransform:"uppercase", color: C.pink,
            marginBottom:"14px",
          }}>
            ✦ The Huria Promise
          </span>

          <Divider />

          <h2 style={{
            fontSize:"clamp(2rem,4.5vw,3rem)",
            fontWeight:900, color:C.text, margin:"16px 0 12px",
            fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1.1,
          }}>
            Why Choose{" "}
            <span style={{
              fontStyle:"italic",
              background:`linear-gradient(135deg,${C.pink},${C.pinkDark})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>
              Huria Collection?
            </span>
          </h2>
          <p style={{ color:C.textMid, fontSize:"15px", maxWidth:"500px", margin:"0 auto", lineHeight:1.75 }}>
            We've built our brand on one belief — every woman deserves luxury, delivered with love.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",
          gap:"18px",
        }}>
          {VALUES.map((v, i) => (
            <ValueCard key={v.title} value={v} idx={i} />
          ))}
        </div>

        {/* Bottom stat strip */}
        <StatStrip />
      </div>
    </section>
  );
}

function ValueCard({ value, idx }) {
  const [ref, visible] = useReveal(0.08);
  return (
    <div
      ref={ref}
      className="wcu-card"
      style={{
        padding:"28px 24px",
        borderRadius:"20px",
        border:`1px solid ${C.creamDeep}`,
        background: C.white,
        boxShadow:"0 2px 12px rgba(231,84,128,0.06)",
        transition:"transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease",
        opacity: visible ? 1 : 0,
        animation: visible ? `wcu-cardIn 0.55s ease ${idx * 0.08}s both` : "none",
      }}
    >
      <div style={{
        width:48, height:48, borderRadius:"14px",
        background: C.pinkPale,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:"22px", marginBottom:"16px",
        border:`1px solid ${C.pinkLight}`,
      }}>
        {value.icon}
      </div>
      <h3 style={{
        fontSize:"16px", fontWeight:800, color:C.text,
        margin:"0 0 8px",
        fontFamily:"'Playfair Display',Georgia,serif",
      }}>
        {value.title}
      </h3>
      <p style={{ fontSize:"13px", color:C.textMid, lineHeight:1.75, margin:0 }}>
        {value.body}
      </p>
    </div>
  );
}

function StatStrip() {
  const [ref, visible] = useReveal(0.1);
  const stats = [
    { value:"100+", label:"Products" },
    { value:"3k+",   label:"Happy Customers" },
    { value:"4.9★",   label:"Average Rating" },
    { value:"24hr",   label:"Dispatch Time" },
  ];
  return (
    <div
      ref={ref}
      style={{
        marginTop:"52px",
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",
        gap:"1px",
        borderRadius:"18px",
        overflow:"hidden",
        border:`1px solid ${C.creamDeep}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition:"opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
      }}
    >
      {stats.map((s, i) => (
        <div key={s.label} style={{
          padding:"22px 16px",
          background: C.white,
          textAlign:"center",
          borderRight: i < stats.length - 1 ? `1px solid ${C.creamDeep}` : "none",
        }}>
          <p style={{ fontSize:"28px", fontWeight:900, color:C.pink, margin:"0 0 4px", fontFamily:"'Playfair Display',Georgia,serif" }}>
            {s.value}
          </p>
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:C.textMid, margin:0 }}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 2. INSTAGRAM FEED
// ══════════════════════════════════════════════════════════════════════

// Replace src values with real Instagram image URLs or local assets
const IG_POSTS = [
  { id:1,  src:"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80", likes:214, caption:"New arrivals just dropped ✨" },
  { id:2,  src:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80", likes:189, caption:"Matte lips are everything 💄" },
  { id:3,  src:"https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600&q=80", likes:302, caption:"Walking into the weekend 👟" },
  { id:4,  src:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80", likes:256, caption:"Glow up essentials 🌸" },
  { id:5,  src:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80", likes:178, caption:"Her day, her style 💕" },
  { id:6,  src:"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", likes:321, caption:"Skincare ritual ✨" },
];

function IgCard({ post, idx }) {
  const [ref, visible]   = useReveal(0.08);
  const [hovered, setHovered] = useState(false);

  return (
    <a
      ref={ref}
      href="https://www.instagram.com/huriacollection26"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:"block",
        aspectRatio:"1/1",
        borderRadius:"16px",
        overflow:"hidden",
        position:"relative",
        cursor:"pointer",
        textDecoration:"none",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.95)",
        transition:`opacity 0.5s ease ${idx * 0.07}s, transform 0.5s ease ${idx * 0.07}s`,
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.18)" : "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <img
        src={post.src}
        alt={post.caption}
        style={{
          width:"100%", height:"100%", objectFit:"cover",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          transition:"transform 0.5s ease",
        }}
      />

      {/* Hover overlay */}
      <div style={{
        position:"absolute", inset:0,
        background:`linear-gradient(160deg, rgba(231,84,128,0.72), rgba(181,53,92,0.82))`,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", gap:"8px",
        opacity: hovered ? 1 : 0,
        transition:"opacity 0.28s ease",
      }}>
        {/* Instagram icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.8" fill="white" stroke="none"/>
        </svg>
        <span style={{ color:C.white, fontSize:"12px", fontWeight:800, letterSpacing:"0.08em" }}>
          ♥ {post.likes}
        </span>
        <span style={{ color:"rgba(255,255,255,0.85)", fontSize:"11px", textAlign:"center", maxWidth:"80%", lineHeight:1.4 }}>
          {post.caption}
        </span>
      </div>
    </a>
  );
}

function InstagramFeed() {
  const [headRef, headVisible] = useReveal();

  return (
    <section style={{
      background: C.cream,
      padding:"80px 20px 88px",
      position:"relative", overflow:"hidden",
    }}>
      {/* Subtle background shape */}
      <div style={{ position:"absolute", width:400, height:400, top:"-100px", left:"50%", transform:"translateX(-50%)", borderRadius:"50%", background:"rgba(231,84,128,0.04)", filter:"blur(80px)", pointerEvents:"none" }} />

      <div style={{ maxWidth:"1200px", margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Heading */}
        <div
          ref={headRef}
          style={{
            textAlign:"center", marginBottom:"48px",
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(20px)",
            transition:"opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span style={{ display:"inline-block", fontSize:"10px", fontWeight:800, letterSpacing:"0.28em", textTransform:"uppercase", color:C.pink, marginBottom:"14px" }}>
            ✦ @huriacollection
          </span>

          <Divider />

          <h2 style={{
            fontSize:"clamp(1.9rem,4vw,2.8rem)",
            fontWeight:900, color:C.text, margin:"16px 0 10px",
            fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1.1,
          }}>
            Follow Us on{" "}
            <span style={{
              fontStyle:"italic",
              background:`linear-gradient(135deg,${C.pink},${C.pinkDark})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>
              Instagram
            </span>
          </h2>
          <p style={{ color:C.textMid, fontSize:"15px", margin:"0 auto", maxWidth:"460px", lineHeight:1.75 }}>
            Real looks, real products. Join our community of{" "}
            <strong style={{ color:C.pink }}>30,000+</strong> women who shop with Huria.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(170px, 1fr))",
          gap:"12px",
        }}>
          {IG_POSTS.map((post, i) => (
            <IgCard key={post.id} post={post} idx={i} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign:"center", marginTop:"40px" }}>
          <a
            href="https://www.instagram.com/huriacollection26"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:"inline-flex", alignItems:"center", gap:"10px",
              padding:"13px 32px", borderRadius:"999px",
              border:`2px solid ${C.pink}`, color:C.pink,
              fontWeight:800, fontSize:"13px",
              letterSpacing:"0.1em", textTransform:"uppercase",
              textDecoration:"none",
              transition:"all .2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = C.pink;
              e.currentTarget.style.color = C.white;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 24px rgba(231,84,128,0.3)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = C.pink;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Instagram icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
            </svg>
            Follow Huria Collection Pakistan
          </a>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════
// Combined export
// ══════════════════════════════════════════════════════════════════════
export default function WhySections() {
  return (
    <>
      <WhyChooseUs />
      <InstagramFeed />
    </>
  );
}

// Named exports if you prefer to use them separately
export { WhyChooseUs, InstagramFeed };
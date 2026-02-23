import { Phone, Mail, MapPin, Heart, Facebook, Instagram } from "lucide-react";

const TikTokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5
             2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01
             a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34
             6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.54V6.78a4.85 4.85 0
             01-1.07-.09z"/>
  </svg>
);

// ─── Same tokens as Navbar ─────────────────────────────────────────────────────
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


const QUICK_LINKS   = [
  { label: "Home",        href: "/"         },
  { label: "Shoes",       href: "/shoes"    },
  { label: "Cosmetics",   href: "/cosmetics"},
  { label: "Sale",        href: "/sale"     },
  { label: "About Us",    href: "/about"    },
  { label: "Contact Us",  href: "/contact"  },
];

const SOCIAL = [
  { Icon: Facebook,  href: "https://facebook.com/huriacollection",  label: "Facebook"  },
  { Icon: Instagram, href: "https://instagram.com/huriacollection", label: "Instagram" },
  { Icon: TikTokIcon,href: "https://tiktok.com/@huriacollection",   label: "TikTok"    },
];

// ─── Small reusable link ───────────────────────────────────────────────────────
const FootLink = ({ href = "#", children }) => (
  <a
    href={href}
    style={{ color: C.textMid, fontSize: "14px", textDecoration: "none", display: "inline-block", transition: "color .15s, padding-left .15s" }}
    onMouseEnter={e => { e.currentTarget.style.color = C.pink; e.currentTarget.style.paddingLeft = "5px"; }}
    onMouseLeave={e => { e.currentTarget.style.color = C.textMid; e.currentTarget.style.paddingLeft = "0"; }}
  >
    {children}
  </a>
);

// ─── Column heading ────────────────────────────────────────────────────────────
const ColHead = ({ children }) => (
  <h4 style={{
    fontSize: "11px", fontWeight: 800, letterSpacing: "0.2em",
    textTransform: "uppercase", color: C.pink,
    marginBottom: "16px", paddingBottom: "10px",
    borderBottom: `1px solid ${C.creamDeep}`,
  }}>
    {children}
  </h4>
);

// ═══════════════════════════════════════════════════════════════════════════════
export default function Footer() {
  return (
    <footer style={{ background: C.cream, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      {/* ── Main footer grid ── */}
      <div
        className="max-w-6xl mx-auto px-5 sm:px-10"
        style={{ padding: "56px 20px 40px", maxWidth: "1152px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "36px 28px",
          }}
        >

          {/* ── Brand col ── */}
          <div style={{ gridColumn: "span 1" }}>
            {/* Logo */}
            <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "16px" }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.pink}, ${C.pinkLight})`,
                color: C.white, fontWeight: 900, fontSize: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 14px ${C.pinkLight}`,
                flexShrink: 0,
              }}>H</div>
              <div style={{ lineHeight: 1 }}>
                <span style={{ display: "block", fontSize: "18px", fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color: C.text, fontFamily: "'Georgia', serif" }}>HURIA</span>
                <span style={{ display: "block", fontSize: "9px", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 600, color: C.pink }}>Collection</span>
              </div>
            </a>

            <p style={{ color: C.textMid, fontSize: "13px", lineHeight: 1.75, marginBottom: "20px" }}>
              Premium cosmetics &amp; footwear — crafted for every woman. Delivered across Pakistan with love.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "10px" }}>
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 38, height: 38, borderRadius: "10px",
                    background: C.pinkPale, color: C.pink,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "transform .18s, background .18s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.pink; e.currentTarget.style.color = C.white; e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.pinkPale; e.currentTarget.style.color = C.pink; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <ColHead>Quick Links</ColHead>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}><FootLink href={href}>{label}</FootLink></li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <ColHead>Contact Us</ColHead>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { Icon: Phone,  text: "+92 321 3242328",          href: "tel:+923213242328",              sub: "Mon–Sat, 10am–8pm" },
                { Icon: Mail,   text: "info@huriacollection.pk", href: "mailto:infoo@huriacollection.pk", sub: "Reply within 24 hrs" },
                { Icon: MapPin, text: "Peshawar, Pakistan",         href: "#",                              sub: "Nationwide delivery" },
              ].map(({ Icon, text, href, sub }) => (
                <a
                  key={text}
                  href={href}
                  style={{ display: "flex", gap: "10px", alignItems: "flex-start", textDecoration: "none" }}
                >
                  <div style={{
                    flexShrink: 0, width: 32, height: 32, borderRadius: "8px",
                    background: C.pinkPale, color: C.pink,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginTop: "1px",
                  }}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: C.text, margin: 0 }}>{text}</p>
                    <p style={{ fontSize: "11px", color: C.textMid, margin: "2px 0 0" }}>{sub}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop: `1px solid ${C.creamDeep}`, margin: "0 20px" }} />

      {/* ── Bottom bar ── */}
      <div
        className="max-w-6xl mx-auto px-5 sm:px-10"
        style={{ padding: "18px 20px", maxWidth: "1152px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px" }}
      >
        <p style={{ fontSize: "12px", color: C.textMid, margin: 0 }}>
          © {new Date().getFullYear()} HURIA Collection. All rights reserved.
        </p>

        <p style={{ fontSize: "12px", color: C.textMid, margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
          Made by  Synergy Innovations 
        </p>

        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy Policy", "Terms of Service", "Returns"].map(link => (
            <a
              key={link}
              href="#"
              style={{ fontSize: "12px", color: C.textMid, textDecoration: "none", transition: "color .15s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.pink}
              onMouseLeave={e => e.currentTarget.style.color = C.textMid}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
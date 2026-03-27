import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Phone,
  Facebook,
  Instagram,
} from "lucide-react";

const TikTokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5
             2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01
             a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34
             6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.54V6.78a4.85 4.85 0
             01-1.07-.09z"
    />
  </svg>
);

const C = {
  pink: "#e75480",
  pinkLight: "#f4a7b9",
  pinkPale: "#fde8ef",
  pinkDark: "#b5355c",
  cream: "#fff8f2",
  creamDark: "#f5e6dc",
  creamDeep: "#ecddc8",
  text: "#3b1f2b",
  textMid: "#7a4058",
  white: "#ffffff",
};

const SOCIAL = {
  facebook: "https://www.facebook.com/profile.php?id=61577407982988",
  instagram: "https://www.instagram.com/huriacollection26",
  tiktok: "https://tiktok.com/@huria_collection",
};
const PHONE = "+92 311 7858688";

const NAV_DATA = {
  home: { label: "Home", link: "/" },
  cosmetics: { label: "Cosmetics", link: "/cosmetics" },
  shoes: { label: "Shoes", link: "/shoes" },
};

const STATIC_LINKS = [
  { label: "Sale", to: "/sale", badge: "HOT" },
  { label: "About", to: "/about", badge: null },
  { label: "Contact", to: "/contact", badge: null },
];

// shared hover handlers
const hl = (e) => {
  e.currentTarget.style.color = C.pink;
  e.currentTarget.style.background = C.pinkPale;
};
const unhl = (e) => {
  e.currentTarget.style.color = C.text;
  e.currentTarget.style.background = "transparent";
};

// ─── Social Bar ────────────────────────────────────────────────────────────────
const SocialBar = () => (
  <div
    className="w-full py-2.5 px-5 flex items-center justify-between"
    style={{ background: C.pink, color: C.white }}
  >
    {/* tel: → always <a> */}
    <a
      href={`tel:${PHONE.replace(/\s/g, "")}`}
      className="flex items-center gap-2 text-sm font-bold tracking-wide hover:opacity-75 transition-opacity"
      style={{ color: C.white, textDecoration: "none" }}
    >
      <Phone size={18} />
      <span>{PHONE}</span>
    </a>

    <span className="hidden md:block text-xs tracking-[0.22em] uppercase font-semibold opacity-85">
      Beauty &amp; Style — Delivered to Your Door
    </span>

    {/* external social → always <a> */}
    <div className="flex items-center gap-5">
      {[
        { href: SOCIAL.facebook, Icon: Facebook, label: "Facebook" },
        { href: SOCIAL.instagram, Icon: Instagram, label: "Instagram" },
      ].map(({ href, Icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="hover:opacity-70 hover:scale-110 transition-all duration-150"
          style={{ color: C.white }}
        >
          <Icon size={22} />
        </a>
      ))}
      <a
        href={SOCIAL.tiktok}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok"
        className="hover:opacity-70 hover:scale-110 transition-all duration-150"
        style={{ color: C.white }}
      >
        <TikTokIcon size={22} />
      </a>
    </div>
  </div>
);

// ─── Announcement Bar ──────────────────────────────────────────────────────────
const AnnouncementBar = () => {
  const messages = [
    "✨ Free shipping on orders over PKR 3,000",
    "🎁 Buy 2 Get 1 Free on all Cosmetics",
    "👟 New Shoe Collection — Just Dropped!",
    "💄 Luxury Picks Now Available",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      className="text-center text-xs py-2 px-4 tracking-widest font-semibold overflow-hidden"
      style={{ background: C.pinkPale, color: C.pinkDark }}
    >
      <div key={idx} style={{ animation: "nb-fadeSlide 0.4s ease" }}>
        {messages[idx]}
      </div>
      <style>{`@keyframes nb-fadeSlide { from{opacity:0;transform:translateY(-7px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);



  return (
    <>
      <SocialBar />
      <AnnouncementBar />

      <header
        className="sticky top-0 z-40 w-full transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,248,242,0.96)" : C.cream,
          backdropFilter: scrolled ? "blur(14px)" : "none",
          boxShadow: scrolled
            ? `0 2px 24px rgba(231,84,128,0.14)`
            : `0 1px 0 ${C.creamDark}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Hamburger (mobile only) */}
            <button
              className="lg:hidden p-2 rounded-xl transition"
              style={{ color: C.pink }}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex-shrink-0 flex items-center gap-2.5 group"
              style={{ textDecoration: "none" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-base transition-all duration-200 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: `linear-gradient(135deg,${C.pink},${C.pinkLight})`,
                  color: C.white,
                  boxShadow: `0 4px 14px ${C.pinkLight}`,
                }}
              >
                H
              </div>
              <div className="sm:block leading-none">
                <span
                  className="block text-xl font-black tracking-[0.18em] uppercase"
                  style={{ color: C.text, fontFamily: "'Georgia',serif" }}
                >
                  HURIA
                </span>
                <span
                  className="block text-[9px] tracking-[0.4em] uppercase font-semibold"
                  style={{ color: C.pink }}
                >
                  Collection
                </span>
              </div>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {Object.entries(NAV_DATA).map(([key, { label, link }]) => (
                <Link
                  key={key}
                  to={link}
                  className="flex items-center px-4 py-2 text-sm font-semibold tracking-wide rounded-xl transition-all duration-150"
                  style={{
                    color: C.text,
                    fontFamily: "'Georgia',serif",
                    textDecoration: "none",
                  }}
                  onMouseEnter={hl}
                  onMouseLeave={unhl}
                >
                  {label}
                </Link>
              ))}

              {STATIC_LINKS.map(({ label, to, badge }) => (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold tracking-wide rounded-xl transition-all duration-150"
                  style={{
                    color: C.text,
                    fontFamily: "'Georgia',serif",
                    textDecoration: "none",
                  }}
                  onMouseEnter={hl}
                  onMouseLeave={unhl}
                >
                  {label}
                  {badge && (
                    <span
                      className="text-[9px] font-black px-1.5 py-0.5 rounded-full tracking-widest"
                      style={{ background: C.pink, color: C.white }}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Right icons ── */}
            <div className="flex items-center gap-0.5">


              {/* ── Cart → /cart via Link ── */}
              <Link
                to="/cart"
                className="relative p-2 rounded-full transition-all hover:scale-110"
                style={{ color: C.textMid, textDecoration: "none" }}
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span
                    key={totalItems}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-black rounded-full flex items-center justify-center"
                    style={{
                      background: C.pink,
                      color: C.white,
                      animation: "nb-bounce 0.4s cubic-bezier(.34,1.56,.64,1)",
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* ── Shop Now ── */}
              <Link
                to="/shop"
                className="hidden md:inline-flex items-center gap-1.5 ml-1.5 px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg,${C.pink},${C.pinkDark})`,
                  color: C.white,
                  boxShadow: `0 4px 14px ${C.pinkLight}`,
                  textDecoration: "none",
                }}
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mobile Drawer (only below lg) ── */}
        <div
          className="lg:hidden overflow-hidden border-t transition-all duration-300"
          style={{
            maxHeight: mobileOpen ? "100vh" : "0",
            borderColor: C.creamDark,
            background: C.cream,
          }}
        >
          <div className="px-4 py-4 space-y-1">

            {/* Nav links */}
            {Object.entries(NAV_DATA).map(([key, { label, link }]) => (
              <Link
                key={key}
                to={link}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-3 py-3 rounded-xl text-sm font-bold tracking-wide transition"
                style={{
                  color: C.text,
                  fontFamily: "'Georgia',serif",
                  textDecoration: "none",
                  display: "flex",
                }}
                onMouseEnter={hl}
                onMouseLeave={unhl}
              >
                {label}
              </Link>
            ))}

            {STATIC_LINKS.map(({ label, to, badge }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold tracking-wide transition"
                style={{
                  color: C.text,
                  fontFamily: "'Georgia',serif",
                  textDecoration: "none",
                  display: "flex",
                }}
                onMouseEnter={hl}
                onMouseLeave={unhl}
              >
                {label}
                {badge && (
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                    style={{ background: C.pink, color: C.white }}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            ))}

            {/* Shop Now CTA */}
            <div
              className="pt-3 border-t mt-2"
              style={{ borderColor: C.creamDark }}
            >
              <Link
                to="/shop"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3 rounded-full text-sm font-black tracking-widest uppercase transition hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg,${C.pink},${C.pinkDark})`,
                  color: C.white,
                  textDecoration: "none",
                }}
              >
                Shop Now
              </Link>
            </div>

            {/* Social row — external, stays <a> */}
            <div
              className="flex items-center justify-center gap-5 pt-3 pb-1 border-t"
              style={{ borderColor: C.creamDark }}
            >
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.pink }}
              >
                <Facebook size={20} />
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.pink }}
              >
                <Instagram size={20} />
              </a>
              <a
                href={SOCIAL.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.pink }}
              >
                <TikTokIcon size={20} />
              </a>
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: C.pink }}
              >
                <Phone size={13} />
                {PHONE}
              </a>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes nb-bounce {
            0%  { transform: scale(0.5);  }
            70% { transform: scale(1.2);  }
            100%{ transform: scale(1);    }
          }
        `}</style>
      </header>
    </>
  );
}

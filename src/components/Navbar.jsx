import { useState, useEffect, useRef } from "react";
import {
  Search, ShoppingBag, Heart, User, ChevronDown,
  Menu, X, Phone, Sparkles, Facebook, Instagram,
} from "lucide-react";

// TikTok not in lucide-react — tiny inline SVG
const TikTokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5
             2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01
             a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34
             6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.54V6.78a4.85 4.85 0
             01-1.07-.09z"/>
  </svg>
);

// ─── Color Tokens ──────────────────────────────────────────────────────────────
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

// ─── Social / contact links — EDIT THESE ──────────────────────────────────────
const SOCIAL = {
  facebook:  "https://facebook.com/huriacollection",
  instagram: "https://instagram.com/huriacollection",
  tiktok:    "https://tiktok.com/@huriacollection",
};
const PHONE = "+92 321 3242328";

// ─── Nav data ─────────────────────────────────────────────────────────────────
const NAV_DATA = {
  shoes: {
    label: "Shoes",
    categories: [
      { title: "Women's Shoes", items: ["Heels & Pumps","Sandals & Slides","Sneakers","Boots & Ankle Boots","Flats & Loafers","Wedges"] },
      { title: "Men's Shoes",   items: ["Formal Shoes","Sneakers & Trainers","Boots","Loafers & Moccasins","Sandals","Sports Shoes"] },
      { title: "Shop By",       items: ["New Arrivals","Best Sellers","Sale","Luxury Picks","Under PKR 2000","Trending Now"] },
    ],
    promo: { label: "SALE UP TO 40% OFF", sub: "On selected footwear" },
  },
  cosmetics: {
    label: "Cosmetics",
    categories: [
      { title: "Face",        items: ["Foundation & BB Cream","Blush & Bronzer","Highlighter","Primer","Setting Spray","Concealer"] },
      { title: "Eyes & Lips", items: ["Mascara","Eyeliner","Eyeshadow Palette","Lipstick & Gloss","Lip Liner","Brow Products"] },
      { title: "Skin & Sets", items: ["Moisturizer","Serums","Face Masks","Gift Sets","Mini Kits","Natural & Organic"] },
    ],
    promo: { label: "BUY 2 GET 1 FREE", sub: "On all lipstick shades" },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1.  SOCIAL BAR  (top-most strip)
// ═══════════════════════════════════════════════════════════════════════════════
const SocialBar = () => (
  <div
    className="w-full py-2.5 px-5 flex items-center justify-between"
    style={{ background: C.pink, color: C.white }}
  >
    {/* Phone */}
    <a
      href={`tel:${PHONE.replace(/\s/g, "")}`}
      className="flex items-center gap-2 text-sm font-bold tracking-wide hover:opacity-75 transition-opacity"
    >
      <Phone size={18} />
      <span>{PHONE}</span>
    </a>

    {/* Tagline — hidden on small screens */}
    <span className="hidden md:block text-xs tracking-[0.22em] uppercase font-semibold opacity-85">
      Beauty &amp; Style — Delivered to Your Door
    </span>

    {/* Social Icons */}
    <div className="flex items-center gap-5">
      {[
        { href: SOCIAL.facebook,  Icon: Facebook,  label: "Facebook"  },
        { href: SOCIAL.instagram, Icon: Instagram, label: "Instagram" },
      ].map(({ href, Icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="hover:opacity-70 hover:scale-110 transition-all duration-150"
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
      >
        <TikTokIcon size={22} />
      </a>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 2.  ANNOUNCEMENT TICKER
// ═══════════════════════════════════════════════════════════════════════════════
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
      <div key={idx} style={{ animation: "hs-fadeSlide 0.4s ease" }}>
        {messages[idx]}
      </div>
      <style>{`
        @keyframes hs-fadeSlide {
          from { opacity: 0; transform: translateY(-7px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3.  MEGA DROPDOWN
// ═══════════════════════════════════════════════════════════════════════════════
const MegaDropdown = ({ data, visible }) => (
  <div
    className="absolute left-0 right-0 z-50 shadow-2xl border-t-2 transition-all duration-300"
    style={{
      top: "100%",
      background: C.cream,
      borderColor: C.pinkLight,
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? "all" : "none",
      transform: visible ? "translateY(0)" : "translateY(-12px)",
    }}
  >
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-4 gap-8">
      {data.categories.map((col) => (
        <div key={col.title}>
          <h4
            className="text-[10px] font-bold tracking-widest uppercase mb-3 pb-2 border-b"
            style={{ color: C.pink, borderColor: C.pinkPale }}
          >
            {col.title}
          </h4>
          <ul className="space-y-2">
            {col.items.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-sm transition-all duration-150 inline-block"
                  style={{ color: C.textMid }}
                  onMouseEnter={(e) => { e.target.style.color = C.pink; e.target.style.paddingLeft = "5px"; }}
                  onMouseLeave={(e) => { e.target.style.color = C.textMid; e.target.style.paddingLeft = "0"; }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Promo card */}
      <div
        className="rounded-2xl p-5 flex flex-col justify-between"
        style={{ background: `linear-gradient(135deg, ${C.pink} 0%, ${C.pinkLight} 100%)` }}
      >
        <div>
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase mb-3 px-2 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.25)", color: C.white }}
          >
            <Sparkles size={11} /> Featured
          </span>
          <h3 className="text-lg font-black leading-tight mb-1" style={{ color: C.white }}>
            {data.promo.label}
          </h3>
          <p className="text-sm opacity-85" style={{ color: C.white }}>{data.promo.sub}</p>
        </div>
        <button
          className="mt-5 text-xs font-bold tracking-widest uppercase py-2 px-4 rounded-full transition-all hover:shadow-lg hover:scale-105"
          style={{ background: C.white, color: C.pink }}
        >
          Shop Now →
        </button>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 4.  MAIN NAVBAR
// ═══════════════════════════════════════════════════════════════════════════════
export default function Navbar() {
  const [scrolled, setScrolled]             = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen, setSearchOpen]         = useState(false);
  const [searchVal, setSearchVal]           = useState("");
  const searchRef = useRef(null);
  const dropTimer = useRef(null);

  // ── wire this to Redux: useSelector(s => s.cart.totalItems)
  const cartCount = 3;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const enterDrop = (key) => { clearTimeout(dropTimer.current); setActiveDropdown(key); };
  const leaveDrop = ()    => { dropTimer.current = setTimeout(() => setActiveDropdown(null), 200); };

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
        {/* ── Main row ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-xl transition"
              style={{ color: C.pink }}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <a href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-base transition-all duration-200 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: `linear-gradient(135deg, ${C.pink}, ${C.pinkLight})`,
                  color: C.white,
                  boxShadow: `0 4px 14px ${C.pinkLight}`,
                }}
              >
                H
              </div>
              <div className="hidden sm:block leading-none">
                <span
                  className="block text-xl font-black tracking-[0.18em] uppercase"
                  style={{ color: C.text, fontFamily: "'Georgia', serif" }}
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
            </a>

            {/* Desktop Nav links */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {Object.entries(NAV_DATA).map(([key, data]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => enterDrop(key)}
                  onMouseLeave={leaveDrop}
                >
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold tracking-wide rounded-xl transition-all duration-150"
                    style={{
                      color: activeDropdown === key ? C.pink : C.text,
                      background: activeDropdown === key ? C.pinkPale : "transparent",
                      fontFamily: "'Georgia', serif",
                    }}
                  >
                    {data.label}
                    <ChevronDown
                      size={13}
                      style={{
                        color: C.pinkLight,
                        transform: activeDropdown === key ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>
                </div>
              ))}

              {[
                { label: "New Arrivals", badge: null    },
                { label: "Sale",         badge: "HOT"  },
                { label: "About",        badge: null    },
                { label: "Contact",      badge: null    },
              ].map(({ label, badge }) => (
                <a
                  key={label}
                  href="#"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold tracking-wide rounded-xl transition-all duration-150"
                  style={{ color: C.text, fontFamily: "'Georgia', serif" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.pink;
                    e.currentTarget.style.background = C.pinkPale;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.text;
                    e.currentTarget.style.background = "transparent";
                  }}
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
                </a>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-0.5">
              {/* Search */}
              <div className="relative flex items-center">
                {searchOpen ? (
                  <div
                    className="flex items-center gap-2 border-2 rounded-full px-3 py-1.5"
                    style={{ borderColor: C.pink, background: C.white, width: "210px" }}
                  >
                    <Search size={15} style={{ color: C.pinkLight, flexShrink: 0 }} />
                    <input
                      ref={searchRef}
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      placeholder="Search products…"
                      className="flex-1 text-sm bg-transparent outline-none"
                      style={{ color: C.text }}
                      onBlur={() => { if (!searchVal) setSearchOpen(false); }}
                    />
                    {searchVal && (
                      <button onClick={() => setSearchVal("")}>
                        <X size={13} style={{ color: C.pinkLight }} />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-full transition-all hover:scale-110"
                    style={{ color: C.textMid }}
                    aria-label="Search"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>

              <button className="hidden sm:flex p-2 rounded-full transition-all hover:scale-110" style={{ color: C.textMid }} aria-label="Wishlist">
                <Heart size={20} />
              </button>

              <button className="hidden sm:flex p-2 rounded-full transition-all hover:scale-110" style={{ color: C.textMid }} aria-label="Account">
                <User size={20} />
              </button>

              <button className="relative p-2 rounded-full transition-all hover:scale-110" style={{ color: C.textMid }} aria-label="Cart">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-black rounded-full flex items-center justify-center"
                    style={{ background: C.pink, color: C.white }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              <a
                href="/login"
                className="hidden md:inline-flex items-center ml-1.5 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
                  color: C.white,
                  boxShadow: `0 4px 14px ${C.pinkLight}`,
                }}
              >
                Sign In
              </a>
            </div>
          </div>
        </div>

        {/* Mega dropdowns */}
        <div className="hidden lg:block relative">
          {Object.entries(NAV_DATA).map(([key, data]) => (
            <div key={key} onMouseEnter={() => enterDrop(key)} onMouseLeave={leaveDrop}>
              <MegaDropdown data={data} visible={activeDropdown === key} />
            </div>
          ))}
        </div>

        {/* ── Mobile Drawer ── */}
        <div
          className="lg:hidden overflow-hidden border-t transition-all duration-300"
          style={{
            maxHeight: mobileOpen ? "100vh" : "0",
            borderColor: C.creamDark,
            background: C.cream,
          }}
        >
          <div className="px-4 py-4 space-y-1">
            {/* Search */}
            <div
              className="flex items-center gap-2 border-2 rounded-2xl px-3 py-2.5 mb-4"
              style={{ borderColor: C.pinkLight, background: C.white }}
            >
              <Search size={15} style={{ color: C.pinkLight }} />
              <input
                placeholder="Search shoes, cosmetics…"
                className="flex-1 text-sm bg-transparent outline-none"
                style={{ color: C.text }}
              />
            </div>

            {/* Accordion nav */}
            {Object.entries(NAV_DATA).map(([key, data]) => (
              <div key={key}>
                <button
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold tracking-wide transition"
                  style={{
                    color: mobileExpanded === key ? C.pink : C.text,
                    background: mobileExpanded === key ? C.pinkPale : "transparent",
                    fontFamily: "'Georgia', serif",
                  }}
                  onClick={() => setMobileExpanded(mobileExpanded === key ? null : key)}
                >
                  {data.label}
                  <ChevronDown
                    size={15}
                    style={{
                      color: C.pinkLight,
                      transform: mobileExpanded === key ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s",
                    }}
                  />
                </button>

                {mobileExpanded === key && (
                  <div className="px-3 pb-4 mt-1 space-y-5">
                    {data.categories.map((col) => (
                      <div key={col.title}>
                        <p className="text-xs font-black tracking-widest uppercase mb-2.5 pb-1.5 border-b" style={{ color: C.pink, borderColor: C.pinkPale }}>
                          {col.title}
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          {col.items.map((item) => (
                            <a
                              key={item}
                              href="#"
                              className="text-sm font-medium py-0.5"
                              style={{ color: C.textMid }}
                              onMouseEnter={(e) => e.target.style.color = C.pink}
                              onMouseLeave={(e) => e.target.style.color = C.textMid}
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Static links */}
            {["New Arrivals", "Sale", "About", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold tracking-wide transition"
                style={{ color: C.text, fontFamily: "'Georgia', serif" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.pink; e.currentTarget.style.background = C.pinkPale; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.text; e.currentTarget.style.background = "transparent"; }}
              >
                {link}
                {link === "Sale" && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: C.pink, color: C.white }}>HOT</span>
                )}
              </a>
            ))}

            {/* CTA buttons */}
            <div className="pt-3 flex gap-3 border-t mt-2" style={{ borderColor: C.creamDark }}>
              <a
                href="/login"
                className="flex-1 text-center py-2.5 rounded-full text-sm font-black border-2 transition"
                style={{ borderColor: C.pink, color: C.pink }}
              >
                Sign In
              </a>
              <a
                href="/register"
                className="flex-1 text-center py-2.5 rounded-full text-sm font-black transition"
                style={{ background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`, color: C.white }}
              >
                Register
              </a>
            </div>

            {/* Mobile social row */}
            <div
              className="flex items-center justify-center gap-5 pt-3 pb-1 border-t"
              style={{ borderColor: C.creamDark }}
            >
              <a href={SOCIAL.facebook}  target="_blank" rel="noopener noreferrer" style={{ color: C.pink }}><Facebook size={20} /></a>
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" style={{ color: C.pink }}><Instagram size={20} /></a>
              <a href={SOCIAL.tiktok}    target="_blank" rel="noopener noreferrer" style={{ color: C.pink }}><TikTokIcon size={20} /></a>
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: C.pink }}
              >
                <Phone size={13} />{PHONE}
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
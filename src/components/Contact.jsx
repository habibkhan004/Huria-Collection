import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Phone, Mail, MapPin, Send, Facebook, Instagram, CheckCircle, MessageCircle } from "lucide-react";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5
             2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01
             a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34
             6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.54V6.78a4.85 4.85 0
             01-1.07-.09z"/>
  </svg>
);

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

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── Floating label field — taller, more spacious ─────────────────────────────
const Field = ({ label, type = "text", name, value, onChange, textarea = false, required = false }) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  const Tag = textarea ? "textarea" : "input";
  return (
    <div style={{ position: "relative" }}>
      <label style={{
        position: "absolute",
        left: "18px",
        top: lifted ? "9px" : textarea ? "18px" : "50%",
        transform: lifted ? "none" : textarea ? "none" : "translateY(-50%)",
        fontSize: lifted ? "10px" : "14px",
        fontWeight: 700,
        letterSpacing: lifted ? "0.12em" : "0",
        textTransform: lifted ? "uppercase" : "none",
        color: focused ? C.pink : C.textMid,
        transition: "all 0.2s ease",
        pointerEvents: "none",
        zIndex: 1,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}{required && " *"}
      </label>
      <Tag
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={textarea ? 6 : undefined}
        style={{
          width: "100%",
          padding: lifted ? "26px 18px 10px" : textarea ? "18px" : "0 18px",
          height: textarea ? "auto" : "58px",   /* taller than before (was 52px) */
          borderRadius: "14px",
          border: `2px solid ${focused ? C.pink : C.creamDeep}`,
          background: focused ? C.white : C.cream,
          color: C.text,
          fontSize: "15px",                      /* slightly larger text */
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          resize: "none",
          transition: "border-color 0.2s, background 0.2s",
          boxSizing: "border-box",
          display: "block",
        }}
      />
    </div>
  );
};

// ─── Info card ─────────────────────────────────────────────────────────────────
const InfoCard = ({ icon: Icon, label, value, sub, href, delay, visible }) => (
  <a
    href={href}
    style={{
      display: "flex", alignItems: "flex-start", gap: "14px",
      padding: "16px 18px",
      background: C.white,
      borderRadius: "18px",
      border: `1px solid ${C.creamDeep}`,
      textDecoration: "none",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(-20px)",
      transition: "opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s, border-color 0.2s",
      transitionDelay: delay,
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = `0 8px 28px rgba(231,84,128,0.12)`;
      e.currentTarget.style.borderColor = C.pinkLight;
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
      e.currentTarget.style.borderColor = C.creamDeep;
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <div style={{
      flexShrink: 0, width: 42, height: 42, borderRadius: "12px",
      background: C.pinkPale,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon size={19} color={C.pink} />
    </div>
    <div>
      <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: C.pinkLight, margin: "0 0 3px" }}>
        {label}
      </p>
      <p style={{ fontSize: "14px", fontWeight: 700, color: C.text, margin: "0 0 2px", fontFamily: "'Playfair Display', Georgia, serif" }}>
        {value}
      </p>
      <p style={{ fontSize: "12px", color: C.textMid, margin: 0 }}>{sub}</p>
    </div>
  </a>
);

// ═══════════════════════════════════════════════════════════════════════════════
export default function ContactUs() {
  const [form, setForm]       = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors]   = useState({});

  const [heroRef, heroVisible] = useReveal();
  const [infoRef, infoVisible] = useReveal();
  const [formRef, formVisible] = useReveal();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    try {
      await API.post("/contacts", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
      });
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Failed to send. Please try again." });
    } finally {
      setSending(false);
    }
  };

  const SOCIALS = [
    { Icon: Facebook,  href: "https://facebook.com/huriacollection",  label: "Facebook"  },
    { Icon: Instagram, href: "https://instagram.com/huriacollection", label: "Instagram" },
    { Icon: TikTokIcon,href: "https://tiktok.com/@huriacollection",   label: "TikTok"    },
  ];

  return (
    <div style={{ background: C.cream, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
      <style>{`
   

        @keyframes ct-fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ct-scaleIn { from{opacity:0;transform:scale(0.95)}      to{opacity:1;transform:scale(1)}      }
        @keyframes ct-orbFloat {
          0%,100%{ transform:translate(0,0) scale(1); }
          50%    { transform:translate(8px,-12px) scale(1.06); }
        }
        @keyframes ct-checkPop {
          0%  { opacity:0; transform:scale(0.6) rotate(-8deg); }
          70% { transform:scale(1.1) rotate(2deg); }
          100%{ opacity:1; transform:scale(1) rotate(0); }
        }
        @keyframes ct-spin    { to{ transform:rotate(360deg); } }
        @keyframes ct-shimmer {
          0%  { background-position:-300px 0; }
          100%{ background-position:300px 0; }
        }

        .ct-submit {
          position:relative; overflow:hidden;
          transition:transform .2s, box-shadow .2s;
        }
        .ct-submit:hover:not(:disabled) { transform:translateY(-2px); }
        .ct-submit::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(120deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%);
          animation:ct-shimmer 2.4s ease-in-out infinite;
          background-size:260% 100%;
        }

        /* ── Responsive grid ── */
        .ct-main-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 36px;
          align-items: start;
        }
        /* Two-col form rows collapse to single col on small screens */
        .ct-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 860px) {
          .ct-main-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 520px) {
          .ct-two-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ── HERO — reduced padding ── */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: `linear-gradient(135deg, ${C.pinkPale} 0%, ${C.cream} 55%, ${C.creamDark} 100%)`,
        padding: "48px 20px 44px",   /* was 72/64 */
        textAlign: "center",
      }}>
        {/* Orbs */}
        <div style={{ position:"absolute", width:300, height:300, top:"-70px", right:"-50px", borderRadius:"50%", background:"rgba(231,84,128,0.08)", filter:"blur(60px)", animation:"ct-orbFloat 10s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:180, height:180, bottom:"-30px", left:"-40px", borderRadius:"50%", background:"rgba(244,167,185,0.12)", filter:"blur(50px)", animation:"ct-orbFloat 14s ease-in-out infinite reverse", pointerEvents:"none" }} />

        <div
          ref={heroRef}
          style={{
            position: "relative", zIndex: 1,
            maxWidth: "600px", margin: "0 auto",
            animation: heroVisible ? "ct-fadeUp 0.55s ease both" : "none",
          }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: C.pink, color: C.white,
            fontSize: "11px", fontWeight: 800, letterSpacing: "0.22em",
            textTransform: "uppercase", padding: "5px 16px",
            borderRadius: "999px", marginBottom: "14px",
          }}>
            ✦ Get In Touch
          </span>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 900,
            fontFamily: "'Playfair Display', Georgia, serif",
            color: C.text,
            lineHeight: 1.12,
            margin: "0 0 0",         /* no bottom margin — divider handles spacing */
          }}>
            We'd Love to{" "}
            <span style={{
              fontStyle: "italic",
              background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Hear From You
            </span>
          </h1>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"12px", marginTop:"20px" }}>
            <div style={{ height:"1px", width:48, background:C.pinkLight }} />
            <span style={{ color:C.pink, fontSize:"16px" }}>♡</span>
            <div style={{ height:"1px", width:48, background:C.pinkLight }} />
          </div>
        </div>
      </section>

      {/* ── MAIN — reduced top padding ── */}
      <section style={{ padding: "36px 20px 64px", maxWidth: "1100px", margin: "0 auto" }}>
        <div className="ct-main-grid">

          {/* ── LEFT — Info ── */}
          <div ref={infoRef} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

            <div>
              <span style={{ fontSize:"11px", fontWeight:800, letterSpacing:"0.22em", textTransform:"uppercase", color:C.pink }}>
                ✦ Contact Info
              </span>
              <h2 style={{
                fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                fontWeight: 900,
                fontFamily: "'Playfair Display', Georgia, serif",
                color: C.text,
                margin: "6px 0 8px",
                lineHeight: 1.2,
              }}>
                Let's Connect
              </h2>
              <p style={{ color:C.textMid, fontSize:"14px", lineHeight:1.75, margin:0 }}>
                Reach out through any channel. Our team is friendly, fast, and always happy to help.
              </p>
            </div>

            <InfoCard icon={Phone}  label="Phone / WhatsApp" value="+92 321 3242328"         sub="Mon–Sat, 10am–8pm"            href="tel:+923213242328"               delay="0s"    visible={infoVisible} />
            <InfoCard icon={Mail}   label="Email"            value="info@huriacollection.pk" sub="We reply within 24 hours"      href="mailto:info@huriacollection.pk"  delay="0.08s" visible={infoVisible} />
            <InfoCard icon={MapPin} label="Location"         value="Peshawar, Pakistan"       sub="Nationwide delivery available" href="#"                               delay="0.16s" visible={infoVisible} />

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/923213242328"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:"9px",
                padding:"13px 20px", borderRadius:"14px",
                background:"#25d366", color:C.white,
                textDecoration:"none", fontWeight:800, fontSize:"13px",
                letterSpacing:"0.06em",
                boxShadow:"0 4px 18px rgba(37,211,102,0.3)",
                opacity: infoVisible ? 1 : 0,
                transform: infoVisible ? "translateY(0)" : "translateY(10px)",
                transition:"opacity 0.4s ease 0.24s, transform 0.4s ease 0.24s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(37,211,102,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="0 4px 18px rgba(37,211,102,0.3)"; }}
            >
              <MessageCircle size={17} /> Chat on WhatsApp
            </a>

            {/* Social icons */}
            <div style={{
              padding:"16px 18px",
              background:C.white,
              borderRadius:"18px",
              border:`1px solid ${C.creamDeep}`,
              opacity: infoVisible ? 1 : 0,
              transform: infoVisible ? "translateY(0)" : "translateY(10px)",
              transition:"opacity 0.4s ease 0.32s, transform 0.4s ease 0.32s",
            }}>
              <p style={{ fontSize:"10px", fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:C.pink, margin:"0 0 12px" }}>
                Follow Us
              </p>
              <div style={{ display:"flex", gap:"10px" }}>
                {SOCIALS.map(({ Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    style={{
                      width:42, height:42, borderRadius:"12px",
                      background:C.pinkPale, color:C.pink,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      textDecoration:"none", transition:"all .18s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background=C.pink; e.currentTarget.style.color=C.white; e.currentTarget.style.transform="scale(1.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background=C.pinkPale; e.currentTarget.style.color=C.pink; e.currentTarget.style.transform="scale(1)"; }}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT — Form ── */}
          <div
            ref={formRef}
            style={{
              background: C.white,
              borderRadius: "24px",
              border: `1px solid ${C.creamDeep}`,
              boxShadow: "0 8px 40px rgba(231,84,128,0.08)",
              padding: "20px 20px",
              animation: formVisible ? "ct-scaleIn 0.55s ease 0.1s both" : "none",
            }}
          >
            {sent ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"32px 0", gap:"14px" }}>
                <div style={{ animation:"ct-checkPop 0.6s ease both" }}>
                  <CheckCircle size={60} color={C.pink} />
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"22px", fontWeight:900, color:C.text, margin:0 }}>
                  Message Sent! 💕
                </h3>
                <p style={{ color:C.textMid, fontSize:"14px", lineHeight:1.7, maxWidth:"280px", margin:0 }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name:"", email:"", phone:"", subject:"", message:"" }); }}
                  style={{
                    marginTop:"6px", padding:"10px 28px", borderRadius:"999px",
                    border:`2px solid ${C.pink}`, background:"transparent",
                    color:C.pink, fontWeight:800, fontSize:"13px", cursor:"pointer",
                    transition:"background .18s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.pinkPale}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"20px", fontWeight:900, color:C.text, margin:"0 0 4px" }}>
                  Send a Message
                </h3>
                <p style={{ color:C.textMid, fontSize:"13px", margin:"0 0 22px" }}>
                  Fill in the form and we'll be in touch shortly.
                </p>

                <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

                  {/* Name + Email */}
                  <div className="ct-two-col">
                    <div>
                      <Field label="Full Name" name="name" value={form.name} onChange={handleChange} required />
                      {errors.name && <p style={{ color:C.pink, fontSize:"11px", margin:"4px 0 0 4px" }}>{errors.name}</p>}
                    </div>
                    <div>
                      <Field label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
                      {errors.email && <p style={{ color:C.pink, fontSize:"11px", margin:"4px 0 0 4px" }}>{errors.email}</p>}
                    </div>
                  </div>

                  {/* Phone + Subject */}
                  <div className="ct-two-col">
                    <Field label="Phone (optional)" type="tel" name="phone" value={form.phone} onChange={handleChange} />
                    <Field label="Subject" name="subject" value={form.subject} onChange={handleChange} />
                  </div>

                  {/* Message */}
                  <div>
                    <Field label="Your Message" name="message" value={form.message} onChange={handleChange} textarea required />
                    {errors.message && <p style={{ color:C.pink, fontSize:"11px", margin:"4px 0 0 4px" }}>{errors.message}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="ct-submit"
                    style={{
                      display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                      padding:"15px", borderRadius:"14px", border:"none",
                      cursor: sending ? "not-allowed" : "pointer",
                      background:`linear-gradient(135deg,${C.pink},${C.pinkDark})`,
                      color:C.white, fontWeight:800, fontSize:"14px",
                      letterSpacing:"0.08em", textTransform:"uppercase",
                      boxShadow:`0 6px 20px rgba(231,84,128,0.3)`,
                      opacity: sending ? 0.8 : 1,
                    }}
                  >
                    {sending ? (
                      <>
                        <span style={{
                          width:16, height:16, flexShrink:0,
                          border:"2px solid rgba(255,255,255,0.35)",
                          borderTopColor:C.white, borderRadius:"50%",
                          animation:"ct-spin 0.7s linear infinite",
                          display:"inline-block",
                        }} />
                        Sending…
                      </>
                    ) : (
                      <><Send size={15} /> Send Message</>
                    )}
                  </button>

                  {errors.submit && (
                    <p style={{ color: C.pink, fontSize: "13px", textAlign: "center", margin: 0 }}>
                      {errors.submit}
                    </p>
                  )}
                  <p style={{ fontSize:"11px", color:C.textMid, textAlign:"center", margin:0 }}>
                    * Required fields. Your info is safe with us.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
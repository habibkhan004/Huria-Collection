const WhatsAppFloat = ({ phone = "923213242328", message = "Hi! I'm interested in your products 😊" }) => {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <style>{`
        @keyframes wa-pulse {
          0%   { box-shadow: 0 0 0 0   rgba(37,211,102,0.55); }
          70%  { box-shadow: 0 0 0 14px rgba(37,211,102,0);   }
          100% { box-shadow: 0 0 0 0   rgba(37,211,102,0);    }
        }
        @keyframes wa-pop {
          0%   { opacity:0; transform:scale(0.5) translateY(20px); }
          70%  { transform:scale(1.08) translateY(-2px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        .wa-btn {
          animation: wa-pop 0.5s cubic-bezier(.34,1.56,.64,1) 0.8s both,
                     wa-pulse 2.2s ease-in-out 1.5s infinite;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .wa-btn:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 8px 28px rgba(37,211,102,0.5) !important;
          animation: none;
        }
        .wa-tooltip {
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
        }
        .wa-wrapper:hover .wa-tooltip {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      <div
        className="wa-wrapper"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* Tooltip label */}
        <div
          className="wa-tooltip"
          style={{
            background: "#1a1a1a",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            padding: "7px 13px",
            borderRadius: "999px",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
          }}
        >
          Chat with us 💬
        </div>

        {/* WhatsApp button */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="wa-btn"
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #25d366, #128c4e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 18px rgba(37,211,102,0.45)",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          {/* Official WhatsApp SVG */}
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 3C8.82 3 3 8.82 3 16c0 2.31.62 4.47 1.7 6.33L3 29l6.84-1.66A12.93 12.93 0 0016 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.6a10.58 10.58 0 01-5.38-1.47l-.38-.23-4.06.98.99-3.95-.25-.4A10.56 10.56 0 015.4 16C5.4 9.63 10.63 4.4 16 4.4S26.6 9.63 26.6 16 21.37 26.6 16 26.6zm5.8-7.94c-.32-.16-1.87-.92-2.16-1.02-.29-.1-.5-.16-.71.16-.21.32-.8 1.02-.98 1.23-.18.21-.36.23-.68.07-.32-.16-1.34-.49-2.56-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.5.14-.65.14-.14.32-.36.48-.54.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.61-.52-.53-.71-.54h-.6c-.21 0-.54.08-.82.4-.29.32-1.09 1.06-1.09 2.59s1.11 3 1.27 3.21c.16.21 2.18 3.33 5.28 4.67.74.32 1.32.51 1.77.65.74.23 1.42.2 1.95.12.6-.09 1.87-.76 2.13-1.5.26-.74.26-1.37.18-1.5-.07-.13-.28-.21-.6-.37z"
              fill="white"
            />
          </svg>
        </a>
      </div>
    </>
  );
};

export default WhatsAppFloat;
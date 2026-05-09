"use client";
// ============================================================
// components/Footer.tsx
// ============================================================

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      style={{
        background: "#2a2422",
        color: "rgba(255,255,255,0.45)",
        padding: "48px 5%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "24px",
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "20px",
          fontWeight: 300,
          letterSpacing: "2px",
          color: "white",
        }}
      >
        Eternal{" "}
        <em style={{ color: "#e8c5bf", fontStyle: "italic" }}>Beauty</em>
      </div>

      {/* Links */}
      <nav style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {[
          { label: "Nosotros", id: "about" },
          { label: "Servicios", id: "servicios" },
          { label: "Galería", id: "galeria" },
          { label: "Contacto", id: "contacto" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              fontSize: "11px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              transition: "color 0.3s ease",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8c5bf")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
            }
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Copyright */}
      <p
        style={{
          fontSize: "11px",
          letterSpacing: "1px",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        © 2025 Eternal Beauty Studio · Panamá
      </p>
    </footer>
  );
}

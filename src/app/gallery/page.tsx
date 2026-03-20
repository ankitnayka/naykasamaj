"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Gallery() {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container">
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "40px", textAlign: "center" }}>
          {t.nav.gallery}
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} style={{ 
              position: "relative",
              overflow: "hidden", 
              borderRadius: "var(--radius)", 
              boxShadow: "var(--shadow-sm)", 
              aspectRatio: "4/3",
              background: "linear-gradient(45deg, #eee, #f5f5f5)",
              cursor: "pointer"
            }}>
              {/* Image Placeholder */}
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "1.2rem", fontWeight: "600" }}>
                Photo {item}
              </div>
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                padding: "20px",
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                color: "white",
                opacity: 0.8,
                transition: "var(--transition)"
              }}>
                <p style={{ margin: 0, fontWeight: "500" }}>Community Event {item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

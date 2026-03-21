"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "30px", textAlign: "center" }}>
          {t.nav.about}
        </h1>

        <div style={{ background: "var(--surface)", padding: "40px", borderRadius: "var(--radius)", boxShadow: "var(--shadow-md)" }}>
          <h2 style={{ color: "var(--secondary)", marginBottom: "20px" }}>શ્રી સમસ્ત નાયકા સમાજ ટ્રસ્ટ રજી.નં A-517 નવસારી</h2>
          <h2 style={{ color: "var(--secondary)", marginBottom: "20px" }}>History & Vision</h2>
          <p style={{ marginBottom: "20px", fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-muted)" }}>
            The Nayka Samaj has a rich history of community service and cultural preservation. Our vision is to create a unified ecosystem where every member thrives through mutual support, education, and shared heritage.
          </p>
          <p style={{ marginBottom: "30px", fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-muted)" }}>
            We aim to empower individuals by providing resources, fostering leadership, and celebrating our traditions.
          </p>

          <h2 style={{ color: "var(--secondary)", marginBottom: "20px" }}>Our Leadership</h2>
          <ul style={{ listStyle: "none", padding: "0" }}>
            <li style={{ padding: "15px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ width: "60px", height: "60px", background: "var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.2rem", fontWeight: "bold" }}>
                PR
              </div>
              <div>
                <h4 style={{ fontSize: "1.2rem", margin: "0" }}>પ્રમુખશ્રી</h4>
                <p style={{ color: "var(--text-muted)", margin: "0", fontSize: "0.9rem" }}>શ્રી રમણભાઈ ઉર્ફે રમેશભાઈ ભીખુભાઈ  નાયકા</p>
              </div>
            </li>
            <li style={{ padding: "15px 0", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ width: "60px", height: "60px", background: "var(--secondary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.2rem", fontWeight: "bold" }}>
                SE
              </div>
              <div>
                <h4 style={{ fontSize: "1.2rem", margin: "0" }}>ઉપપ્રમુખશ્રી </h4>
                <p style={{ color: "var(--text-muted)", margin: "0", fontSize: "0.9rem" }}> શ્રી ઈશ્વરભાઈ મણીલાલ  નાયકા</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

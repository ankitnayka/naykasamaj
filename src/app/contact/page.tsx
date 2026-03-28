"use client";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./contact.module.css";

export default function Contact() {
  const { t, language } = useLanguage();

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "40px", textAlign: "center" }}>
          {t.nav.contact}
        </h1>

        <div className={styles.contactGrid}>
          <div>
            <h2 style={{ color: "var(--secondary)", marginBottom: "20px", fontSize: "1.5rem" }}>Get In Touch</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "30px", lineHeight: "1.6" }}>
              Have questions or want to collaborate? Fill out the form and our team will get back to you shortly.
            </p>

            <div style={{ marginBottom: "20px", display: "flex", gap: "15px", alignItems: "center" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(242, 101, 34, 0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📍</div>
              <div>
                <h4 style={{ margin: 0, color: "var(--secondary)", fontSize: "1.1rem" }}>Office Address</h4>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>અટલ બિહારી બાજપાઈ શોપીંગ સેન્ટર,પહેલો માળ-દુકાન નં-૩૮,લુન્સીકુઈ,પારસી હોસ્પિટલ સામે,નવસારી</p>
              </div>
            </div>

            <div style={{ marginBottom: "20px", display: "flex", gap: "15px", alignItems: "center" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(242, 101, 34, 0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📞</div>
              <div>
                <h4 style={{ margin: 0, color: "var(--secondary)", fontSize: "1.1rem" }}>Phone</h4>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>+91 96620 03868</p>
              </div>
            </div>

            <div style={{ marginBottom: "20px", display: "flex", gap: "15px", alignItems: "center" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(242, 101, 34, 0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>✉️</div>
              <div>
                <h4 style={{ margin: 0, color: "var(--secondary)", fontSize: "1.1rem" }}>Email</h4>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>naykasamaj@gmail.com</p>
              </div>
            </div>
          </div>

          <form style={{ background: "var(--surface)", padding: "30px", borderRadius: "var(--radius)", boxShadow: "var(--shadow-md)" }}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "var(--secondary)", fontSize: "0.95rem" }}>Your Name</label>
              <input type="text" style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem" }} required />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "var(--secondary)", fontSize: "0.95rem" }}>Email Address</label>
              <input type="email" style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem" }} required />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "var(--secondary)", fontSize: "0.95rem" }}>Message</label>
              <textarea style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem", minHeight: "120px", resize: "vertical" }} required></textarea>
            </div>

            <button type="submit" className="btn" style={{ width: "100%" }}>
              Send Message
            </button>
          </form>
        </div>

        <div style={{ marginTop: "60px" }}>
          <h2 style={{ color: "var(--secondary)", marginBottom: "30px", fontSize: "1.8rem", textAlign: "center" }}>
            {language === "en" ? "Visit Us" : "અમારી મુલાકાત લો"}
          </h2>

          <div className={styles.mapGrid}>
            <div style={{ background: "var(--surface)", padding: "15px", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "15px", color: "var(--primary)" }}>નાયકા સમાજ ભવન</h3>
              <iframe
                src="https://maps.google.com/maps?q=20.902365,72.966520&z=15&output=embed"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div style={{ background: "var(--surface)", padding: "15px", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "15px", color: "var(--primary)" }}>નાયકા સમાજ ઓફીસ</h3>
              <iframe
                src="https://maps.google.com/maps?q=20.9433051,72.936203&z=15&output=embed"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

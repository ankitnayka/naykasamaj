"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Donate() {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "600px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "20px", textAlign: "center" }}>
          {t.common.donate}
        </h1>
        <p style={{ textAlign: "center", marginBottom: "40px", color: "var(--text-muted)", fontSize: "1.1rem" }}>
          Your contributions support community welfare, education, and development initiatives.
        </p>

        <form style={{ background: "var(--surface)", padding: "40px", borderRadius: "var(--radius)", boxShadow: "var(--shadow-md)" }}>
          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--secondary)" }}>Donation Amount (INR)</label>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "15px" }}>
              {["500", "1000", "5000", "Other"].map(amount => (
                <button type="button" key={amount} style={{ flex: 1, padding: "10px", border: "1px solid var(--border)", background: "transparent", borderRadius: "var(--radius)", cursor: "pointer", transition: "var(--transition)" }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'inherit'; }}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
            <input type="number" placeholder="Enter custom amount" style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem" }} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--secondary)" }}>Full Name</label>
            <input type="text" style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem" }} required />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--secondary)" }}>Email Address</label>
            <input type="email" style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem" }} required />
          </div>

          <button type="submit" className="btn" style={{ width: "100%", fontSize: "1.1rem", padding: "15px" }}>
            Donate Now
          </button>
        </form>
      </div>
    </div>
  );
}

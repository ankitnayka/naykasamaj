"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Register() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("LOADING");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus("SUCCESS");
      } else {
        setErrorMessage(data.error || "Failed to register");
        setStatus("ERROR");
      }
    } catch (err) {
      setErrorMessage("Network error occurred.");
      setStatus("ERROR");
    }
  };

  if (status === "SUCCESS") {
    return (
      <div className="animate-fade-in" style={{ padding: "80px 0", minHeight: "70vh", display: "flex", alignItems: "center" }}>
        <div className="container" style={{ maxWidth: "600px" }}>
          <div style={{ background: "var(--surface)", padding: "40px", borderRadius: "12px", boxShadow: "var(--shadow-lg)", textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>✅</div>
            <h1 style={{ color: "var(--primary)", marginBottom: "15px" }}>Registration Successful!</h1>
            <p style={{ color: "var(--text-muted)", marginBottom: "30px", fontSize: "1.1rem" }}>
              Your account has been created. However, for security, an Admin must verify your membership before you can access the Private Hub. Check back later or contact an administrator.
            </p>
            <Link href="/" className="btn">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0", background: "var(--background)" }}>
      <div className="container" style={{ maxWidth: "600px" }}>
        <div style={{ background: "var(--surface)", padding: "40px", borderRadius: "12px", boxShadow: "var(--shadow-lg)" }}>
          <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "10px", textAlign: "center" }}>
            Join the Nayka Samaj
          </h1>
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "30px" }}>
            Register as an official member to access the Private Hub, Matrimony, and Forums.
          </p>

          {status === "ERROR" && (
            <div style={{ background: "#fdecea", color: "#e74c3c", padding: "12px", borderRadius: "6px", marginBottom: "20px", border: "1px solid #f5c6cb" }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--secondary)" }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem", background: "var(--background)", color: "var(--foreground)" }} />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--secondary)" }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem", background: "var(--background)", color: "var(--foreground)" }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--secondary)" }}>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem", background: "var(--background)", color: "var(--foreground)" }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--secondary)" }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem", background: "var(--background)", color: "var(--foreground)" }} />
            </div>

            <button type="submit" className="btn" style={{ marginTop: "10px", padding: "14px", fontSize: "1.1rem" }} disabled={status === "LOADING"}>
              {status === "LOADING" ? "Registering..." : "Submit Registration"}
            </button>
          </form>

          <p style={{ marginTop: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Already have an account? <Link href="/api/auth/signin" style={{ color: "var(--primary)", fontWeight: "bold" }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

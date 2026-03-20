"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid Email or Password");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
      <form onSubmit={handleSubmit} style={{ background: "var(--surface)", padding: "40px", borderRadius: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2rem", color: "var(--primary)", margin: "0 0 10px 0" }}>Super Admin Portal</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Project Setu Secure Access</p>
        </div>

        {error && <div style={{ background: "#fdeced", color: "#e74c3c", padding: "10px", borderRadius: "6px", marginBottom: "20px", fontSize: "0.9rem", textAlign: "center" }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "var(--foreground)", fontWeight: "500" }}>Admin Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "1rem" }} 
              placeholder="superadmin@naykasamaj.org"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "var(--foreground)", fontWeight: "500" }}>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "1rem" }} 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: "100%", padding: "14px", background: "var(--primary)", color: "white", border: "none", borderRadius: "6px", fontSize: "1.1rem", fontWeight: "bold", cursor: loading ? "wait" : "pointer", marginTop: "10px" }}
          >
            {loading ? "Authenticating..." : "Secure Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

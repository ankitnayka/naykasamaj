"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      setError("Invalid Administrative Credentials");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      padding: "20px"
    }}>
      <div style={{ 
        background: "rgba(255, 255, 255, 0.05)", 
        backdropFilter: "blur(10px)",
        padding: "50px 40px", 
        borderRadius: "24px", 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", 
        width: "100%", 
        maxWidth: "450px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative Top Bar */}
        <div style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          right: 0, 
          height: "4px", 
          background: "linear-gradient(to right, #ff4d4d, #f9cb28)" 
        }} />

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ 
            fontSize: "3rem", 
            marginBottom: "10px",
            filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))"
          }}>🛡️</div>
          <h1 style={{ 
            fontSize: "1.8rem", 
            color: "white", 
            margin: "0 0 8px 0",
            fontWeight: "700",
            letterSpacing: "-0.5px"
          }}>Admin Registry</h1>
          <p style={{ 
            color: "rgba(255, 255, 255, 0.6)", 
            margin: 0,
            fontSize: "0.95rem"
          }}>Secure gateway for community administration</p>
        </div>

        {error && (
          <div style={{ 
            background: "rgba(231, 76, 60, 0.15)", 
            color: "#ff6b6b", 
            padding: "12px", 
            borderRadius: "12px", 
            marginBottom: "30px", 
            fontSize: "0.9rem", 
            textAlign: "center",
            border: "1px solid rgba(231, 76, 60, 0.3)"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "rgba(255, 255, 255, 0.8)", 
              fontWeight: "500",
              fontSize: "0.9rem"
            }}>Authorized Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={{ 
                width: "100%", 
                padding: "14px 18px", 
                borderRadius: "12px", 
                background: "rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)", 
                fontSize: "1rem",
                color: "white",
                outline: "none",
                transition: "border-color 0.2s"
              }} 
              placeholder="admin@naykasamaj.org"
              onFocus={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.3)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
            />
          </div>

          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "rgba(255, 255, 255, 0.8)", 
              fontWeight: "500",
              fontSize: "0.9rem"
            }}>Identity Secret</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ 
                width: "100%", 
                padding: "14px 18px", 
                borderRadius: "12px", 
                background: "rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)", 
                fontSize: "1rem",
                color: "white",
                outline: "none",
                transition: "border-color 0.2s"
              }} 
              placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.3)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: "100%", 
              padding: "16px", 
              background: "white", 
              color: "#1a1a2e", 
              border: "none", 
              borderRadius: "14px", 
              fontSize: "1.1rem", 
              fontWeight: "700", 
              cursor: loading ? "wait" : "pointer", 
              marginTop: "10px",
              transition: "transform 0.1s, opacity 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {loading ? "Verifying..." : "Access Dashboard"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <Link href="/" style={{ 
            color: "rgba(255, 255, 255, 0.4)", 
            textDecoration: "none", 
            fontSize: "0.85rem",
            transition: "color 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)"}
          onMouseOut={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)"}
          >
            ← Return to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

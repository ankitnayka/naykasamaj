import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      textAlign: "center",
      background: "linear-gradient(135deg, var(--background) 0%, var(--surface-alt) 100%)",
      color: "var(--foreground)"
    }}>
      <div style={{
        padding: "40px",
        borderRadius: "24px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "var(--shadow-lg)",
        maxWidth: "600px"
      }}>
        <div style={{
          fontSize: "5rem",
          marginBottom: "10px",
          display: "inline-block",
          animation: "float 6s ease-in-out infinite"
        }}>
          🏗️
        </div>
        
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "800",
          marginBottom: "15px",
          background: "linear-gradient(to right, var(--primary), var(--secondary))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-1px"
        }}>
          Coming Soon
        </h1>
        
        <p style={{
          fontSize: "1.2rem",
          color: "var(--text-muted)",
          marginBottom: "30px",
          lineHeight: "1.6"
        }}>
          This page is currently <strong>Under Construction</strong> by our developer team. 
          We're working hard to bring you something amazing!
        </p>

        <div style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center"
        }}>
          <Link href="/" style={{
            background: "var(--primary)",
            color: "white",
            padding: "12px 30px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "700",
            transition: "var(--transition)",
            boxShadow: "0 4px 15px rgba(242, 101, 34, 0.3)"
          }} className="btn-hover">
            Return Home
          </Link>
          
          <Link href="/contact" style={{
            background: "transparent",
            color: "var(--foreground)",
            padding: "12px 30px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "600",
            border: "1px solid var(--border)",
            transition: "var(--transition)"
          }}>
            Contact Support
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .btn-hover:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
      `}} />
    </div>
  );
}

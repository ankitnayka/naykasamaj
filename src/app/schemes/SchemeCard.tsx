"use client";

import React from "react";

export default function SchemeCard({ scheme }: { scheme: any }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "var(--shadow-sm)",
      borderLeft: `5px solid ${scheme.status === "Active" ? "var(--primary)" : "var(--text-muted)"}`,
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      transition: "var(--transition)"
    }}
    className="card-hover">
      
      {/* Header & Badges */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ background: "rgba(242, 101, 34, 0.1)", color: "var(--primary)", padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>
            {scheme.category}
          </span>
          <span style={{ background: "var(--surface-alt)", color: "var(--text)", padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold", border: "1px solid var(--border)" }}>
            👥 {scheme.targetGroup}
          </span>
        </div>
        <span style={{
           background: scheme.status === "Active" ? "rgba(34, 197, 94, 0.1)" : "rgba(107, 114, 128, 0.1)",
           color: scheme.status === "Active" ? "#16a34a" : "#4b5563",
           padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold"
        }}>
          {scheme.status}
        </span>
      </div>

      <h2>{scheme.title}</h2>
      <p style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: "600", marginTop: "-10px", marginBottom: "5px" }}>
        🏢 {scheme.provider}
      </p>

      {scheme.image && (
        <img 
          src={scheme.image} 
          alt={scheme.title} 
          style={{ width: "100%", maxHeight: "250px", objectFit: "cover", borderRadius: "8px" }} 
        />
      )}

      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
        {scheme.shortDescription}
      </p>

      {/* Grid of details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "rgba(0,0,0,0.02)", padding: "15px", borderRadius: "8px", fontSize: "0.9rem" }}>
        {scheme.financialBenefit && (
          <div><strong style={{ color: "var(--secondary)" }}>💰 Financial Benefit:</strong><br/>{scheme.financialBenefit}</div>
        )}
        {scheme.ageLimit && (
          <div><strong style={{ color: "var(--secondary)" }}>⏳ Age Limit:</strong><br/>{scheme.ageLimit}</div>
        )}
        {scheme.incomeCriteria && (
          <div><strong style={{ color: "var(--secondary)" }}>📄 Income Criteria:</strong><br/>{scheme.incomeCriteria}</div>
        )}
        {(scheme.startDate || scheme.lastDate) && (
          <div>
            <strong style={{ color: "var(--secondary)" }}>📅 Dates:</strong><br/>
            {scheme.startDate ? new Date(scheme.startDate).toLocaleDateString() : 'N/A'} - {scheme.lastDate ? new Date(scheme.lastDate).toLocaleDateString() : 'Ongoing'}
          </div>
        )}
      </div>

      {/* Expandable full description */}
      <details style={{ cursor: "pointer", color: "var(--text)", fontSize: "0.95rem" }}>
        <summary style={{ outline: "none", fontWeight: "600", color: "var(--primary)" }}>Read Full Details / Other Benefits</summary>
        <div style={{ marginTop: "10px", padding: "10px", borderLeft: "3px solid var(--primary)", background: "rgba(0,0,0,0.01)", whiteSpace: "pre-wrap" }}>
          {scheme.fullDescription}
          {scheme.otherBenefits && (
            <div style={{ marginTop: "10px" }}>
              <strong>Other Benefits:</strong><br/>{scheme.otherBenefits}
            </div>
          )}
        </div>
      </details>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        {scheme.applyLink && (
          <a href={scheme.applyLink} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", background: "var(--primary)", color: "white", padding: "10px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}>
            Apply Now
          </a>
        )}
        {scheme.officialWebsite && (
          <a href={scheme.officialWebsite} target="_blank" rel="noopener noreferrer" style={{ flex: scheme.applyLink ? "0 1 auto" : 1, textAlign: "center", background: "transparent", color: "var(--primary)", border: "1px solid var(--primary)", padding: "10px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}>
            Official Website
          </a>
        )}
      </div>

    </div>
  );
}

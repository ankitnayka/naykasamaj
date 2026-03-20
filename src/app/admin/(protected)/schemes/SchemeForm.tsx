"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SchemeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    provider: "STATE",
    category: "EDUCATION",
    eligibility: "",
    applicationLink: "",
    deadline: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Scheme successfully added!");
        setFormData({ title: "", description: "", provider: "STATE", category: "EDUCATION", eligibility: "", applicationLink: "", deadline: "" });
        router.refresh();
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (err) {
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", background: "var(--surface)", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      <input required type="text" placeholder="Scheme Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: "12px", borderRadius: "4px", border: "1px solid var(--border)", fontSize: "1.05rem" }} />
      
      <div style={{ display: "flex", gap: "15px" }}>
        <select value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }}>
          <option value="STATE">State Government</option>
          <option value="CENTRAL">Central Government</option>
          <option value="NGO">NGO / Private</option>
        </select>
        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }}>
          <option value="EDUCATION">Education & Scholarships</option>
          <option value="HEALTH">Health & Medical</option>
          <option value="BUSINESS">Business & Loans</option>
          <option value="AGRICULTURE">Agriculture & Farming</option>
          <option value="HOUSING">Housing & Land Rights</option>
        </select>
      </div>

      <textarea required placeholder="Brief description of the scheme and its benefits..." rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
      
      <textarea placeholder="Eligibility Criteria (One per line)" rows={4} value={formData.eligibility} onChange={e => setFormData({...formData, eligibility: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)", fontFamily: "monospace" }} />

      <div style={{ display: "flex", gap: "15px" }}>
        <input type="url" placeholder="Official Application URL" value={formData.applicationLink} onChange={e => setFormData({...formData, applicationLink: e.target.value})} style={{ flex: 2, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "4px" }}>Deadline (Optional)</label>
          <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
        </div>
      </div>

      <button disabled={loading} type="submit" style={{ background: "var(--primary)", color: "white", padding: "12px", border: "none", borderRadius: "4px", cursor: loading ? "wait" : "pointer", fontWeight: "bold", marginTop: "10px" }}>
        {loading ? "Saving Scheme..." : "Add Scheme to Finder"}
      </button>
    </form>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function JobForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "Remote",
    type: "FULL_TIME",
    description: "",
    requirements: "",
    applyLink: "",
    isSkillDevelopment: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Opportunity successfully posted!");
        setFormData({ title: "", company: "", location: "Remote", type: "FULL_TIME", description: "", requirements: "", applyLink: "", isSkillDevelopment: false });
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
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", background: "var(--surface)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      
      <div style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "5px" }}>
        <input type="checkbox" id="skillToggle" checked={formData.isSkillDevelopment} onChange={e => setFormData({...formData, isSkillDevelopment: e.target.checked})} />
        <label htmlFor="skillToggle" style={{ fontWeight: "bold", color: "var(--accent)" }}>Mark as a Skill Development Program</label>
      </div>

      <input required type="text" placeholder={formData.isSkillDevelopment ? "Program Title" : "Job Role / Title"} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)", fontSize: "1.05rem" }} />
      
      <div style={{ display: "flex", gap: "10px" }}>
        <input required type="text" placeholder={formData.isSkillDevelopment ? "Institution/NGO Name" : "Company Name"} value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
        <input required type="text" placeholder="Location or Remote" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
      </div>

      <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }}>
        <option value="FULL_TIME">Full Time</option>
        <option value="PART_TIME">Part Time</option>
        <option value="INTERNSHIP">Internship</option>
        <option value="FREELANCE">Freelance / Contract</option>
      </select>

      <textarea required placeholder={formData.isSkillDevelopment ? "Program details and what participants will learn..." : "Full Job Description..."} rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
      
      <textarea placeholder="Requirements / Qualifications (One per line)" rows={3} value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)", fontFamily: "monospace" }} />

      <input type="url" placeholder="Direct Application URL (Optional)" value={formData.applyLink} onChange={e => setFormData({...formData, applyLink: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />

      <button disabled={loading} type="submit" style={{ background: "var(--primary)", color: "white", padding: "12px", border: "none", borderRadius: "4px", cursor: loading ? "wait" : "pointer", fontWeight: "bold", marginTop: "5px" }}>
        {loading ? "Posting..." : formData.isSkillDevelopment ? "Publish Program" : "Post Job Listing"}
      </button>
    </form>
  );
}

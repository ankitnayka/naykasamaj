"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function JobForm({ existingJob, onSuccess, onCancel }: { existingJob?: any, onSuccess?: (job: any) => void, onCancel?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: existingJob?.title || "",
    company: existingJob?.company || "",
    location: existingJob?.location || "Remote",
    type: existingJob?.type || "FULL_TIME",
    description: existingJob?.description || "",
    requirements: Array.isArray(existingJob?.requirements) ? existingJob.requirements.join("\n") : (existingJob?.requirements || ""),
    applyLink: existingJob?.applyLink || "",
    isSkillDevelopment: existingJob?.isSkillDevelopment || false,
    status: existingJob?.status || "DRAFT",
    visibility: existingJob?.visibility || "PUBLIC",
    contactEmail: existingJob?.contactEmail || "",
    contactPhone: existingJob?.contactPhone || ""
  });

  // Sync state with existingJob when it changes (fixes Edit bug)
  React.useEffect(() => {
    if (existingJob) {
      setFormData({
        title: existingJob.title || "",
        company: existingJob.company || "",
        location: existingJob.location || "Remote",
        type: existingJob.type || "FULL_TIME",
        description: existingJob.description || "",
        requirements: Array.isArray(existingJob.requirements) ? existingJob.requirements.join("\n") : (existingJob.requirements || ""),
        applyLink: existingJob.applyLink || "",
        isSkillDevelopment: existingJob.isSkillDevelopment || false,
        status: existingJob.status || "DRAFT",
        visibility: existingJob.visibility || "PUBLIC",
        contactEmail: existingJob.contactEmail || "",
        contactPhone: existingJob.contactPhone || ""
      });
    } else {
      setFormData({
        title: "", company: "", location: "Remote", type: "FULL_TIME", description: "", requirements: "", applyLink: "", isSkillDevelopment: false, status: "DRAFT", visibility: "PUBLIC", contactEmail: "", contactPhone: ""
      });
    }
  }, [existingJob]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = existingJob ? `/api/admin/jobs/${existingJob._id}` : "/api/admin/jobs";
      const method = existingJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        alert(existingJob ? "Opportunity updated!" : "Opportunity successfully posted!");
        if (!existingJob) {
          setFormData({ title: "", company: "", location: "Remote", type: "FULL_TIME", description: "", requirements: "", applyLink: "", isSkillDevelopment: false, status: "DRAFT", visibility: "PUBLIC", contactEmail: "", contactPhone: "" });
        }
        if (onSuccess) onSuccess(data.job);
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

      <div style={{ display: "flex", gap: "10px" }}>
        <input type="email" placeholder="Contact Email (Optional)" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
        <input type="tel" placeholder="Contact Phone (Optional)" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "0.8rem", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Status</label>
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }}>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="APPROVED">Approved / Live</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "0.8rem", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Visibility</label>
          <select value={formData.visibility} onChange={e => setFormData({...formData, visibility: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }}>
            <option value="PUBLIC">Public</option>
            <option value="MEMBER_ONLY">Members Only</option>
            <option value="ADMIN_ONLY">Admin Only</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
        <button disabled={loading} type="submit" style={{ flex: 2, background: "var(--primary)", color: "white", padding: "12px", border: "none", borderRadius: "4px", cursor: loading ? "wait" : "pointer", fontWeight: "bold" }}>
          {loading ? "Saving..." : existingJob ? "Update Listing" : formData.isSkillDevelopment ? "Publish Program" : "Post Job Listing"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", borderRadius: "4px", cursor: "pointer" }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function EventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "CULTURAL",
    isVirtual: false,
    meetingLink: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Event successfully created!");
        setFormData({ title: "", description: "", date: "", location: "", category: "CULTURAL", isVirtual: false, meetingLink: "" });
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
      <input required type="text" placeholder="Event Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: "12px", borderRadius: "4px", border: "1px solid var(--border)", fontSize: "1.05rem" }} />
      
      <div style={{ display: "flex", gap: "15px" }}>
        <input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }}>
          <option value="CULTURAL">Cultural Festival</option>
          <option value="MEETING">Community Meeting</option>
          <option value="WORKSHOP">Educational Workshop</option>
          <option value="HEALTH_DRIVE">Health Drive</option>
        </select>
      </div>

      <textarea required placeholder="Event Description..." rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
      
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <input required type="text" placeholder="Location or Venue" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ flex: 2, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
        <label style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", color: "var(--foreground)" }}>
          <input type="checkbox" checked={formData.isVirtual} onChange={e => setFormData({...formData, isVirtual: e.target.checked})} />
          Virtual Event
        </label>
      </div>

      {formData.isVirtual && (
        <input type="url" placeholder="Meeting Link (e.g. Zoom/Google Meet)" value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
      )}

      <button disabled={loading} type="submit" style={{ background: "var(--primary)", color: "white", padding: "12px", border: "none", borderRadius: "4px", cursor: loading ? "wait" : "pointer", fontWeight: "bold", marginTop: "10px" }}>
        {loading ? "Adding Event..." : "Add to Calendar"}
      </button>
    </form>
  );
}

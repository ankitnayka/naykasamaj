"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function MediaUploadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "PHOTO",
    category: "FESTIVAL",
    isSensitiveTK: false,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file to upload.");

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("category", formData.category);
    data.append("isSensitiveTK", formData.isSensitiveTK.toString());
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        alert("Upload successful!");
        setFormData({ title: "", description: "", type: "PHOTO", category: "FESTIVAL", isSensitiveTK: false });
        setFile(null);
        router.refresh(); // Refresh the list
      } else {
        const err = await res.json();
        alert("Upload failed: " + err.error);
      }
    } catch (error) {
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", background: "var(--surface)", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      <h2 style={{ fontSize: "1.2rem", color: "var(--secondary)", marginBottom: "10px" }}>Upload New Media</h2>
      
      <input type="text" placeholder="Title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
      <textarea placeholder="Description" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
      
      <div style={{ display: "flex", gap: "10px" }}>
        <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }}>
          <option value="PHOTO">Photo</option>
          <option value="VIDEO">Video</option>
          <option value="AUDIO">Audio</option>
        </select>
        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }}>
          <option value="CEREMONY">Ceremony</option>
          <option value="FESTIVAL">Festival</option>
          <option value="ORAL_HISTORY">Oral History</option>
          <option value="TRADITIONAL_SONG">Traditional Song</option>
          <option value="DOCUMENTARY">Documentary</option>
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
        <input type="checkbox" id="tkLabel" checked={formData.isSensitiveTK} onChange={(e) => setFormData({...formData, isSensitiveTK: e.target.checked})} />
        <label htmlFor="tkLabel" style={{ color: "var(--foreground)", fontSize: "0.95rem" }}>
          <span style={{ background: "#e74c3c", color: "white", padding: "2px 6px", borderRadius: "4px", fontSize: "0.8rem", marginRight: "6px" }}>TK</span>
          Mark as Sensitive Traditional Knowledge
        </label>
      </div>

      <input type="file" required onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ border: "1px solid var(--border)", padding: "10px", borderRadius: "4px" }} />

      <button disabled={loading} type="submit" style={{ background: "var(--primary)", color: "white", padding: "12px", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold" }}>
        {loading ? "Uploading to Cloudinary..." : "Upload Media to Archive"}
      </button>
    </form>
  );
}

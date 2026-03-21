"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EventForm({ editEvent, onSuccess }: { editEvent?: any, onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    isVirtual: false,
    meetingLink: "",
  });

  const [imagesFiles, setImagesFiles] = useState<File[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
    if (editEvent) {
      setFormData({
        title: editEvent.title || "",
        description: editEvent.description || "",
        date: editEvent.date ? new Date(editEvent.date).toISOString().slice(0, 16) : "",
        location: editEvent.location || "",
        category: editEvent.category || "",
        isVirtual: editEvent.isVirtual || false,
        meetingLink: editEvent.meetingLink || "",
      });
      setExistingImages(editEvent.images || []);
      setExistingGallery(editEvent.gallery || []);
    } else {
      setFormData({ title: "", description: "", date: "", location: "", category: "", isVirtual: false, meetingLink: "" });
      setExistingImages([]);
      setExistingGallery([]);
      setImagesFiles([]);
      setGalleryFiles([]);
    }
  }, [editEvent]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/events/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (!editEvent && data.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: data[0].name }));
        }
      }
    } catch(e) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("date", formData.date);
      data.append("location", formData.location);
      data.append("category", formData.category);
      data.append("isVirtual", formData.isVirtual.toString());
      data.append("meetingLink", formData.meetingLink);

      if (editEvent) {
        data.append("existingImages", JSON.stringify(existingImages));
        data.append("existingGallery", JSON.stringify(existingGallery));
      }

      imagesFiles.forEach(f => data.append("images", f));
      galleryFiles.forEach(f => data.append("gallery", f));

      const url = editEvent ? `/api/admin/events/${editEvent._id}` : "/api/admin/events";
      const method = editEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data
      });

      if (res.ok) {
        alert(`Event ${editEvent ? "updated" : "created"} successfully!`);
        if (!editEvent) {
          setFormData({ title: "", description: "", date: "", location: "", category: categories.length > 0 ? categories[0].name : "", isVirtual: false, meetingLink: "" });
          setImagesFiles([]);
          setGalleryFiles([]);
          setExistingImages([]);
          setExistingGallery([]);
        }
        if (onSuccess) onSuccess();
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

  const removeExistingImage = (idx: number, type: "image" | "gallery") => {
    if (type === "image") {
      setExistingImages(prev => prev.filter((_, i) => i !== idx));
    } else {
      setExistingGallery(prev => prev.filter((_, i) => i !== idx));
    }
  };

  return (
    <div style={{ background: "var(--surface)", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        <input required type="text" placeholder="Event Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: "12px", borderRadius: "4px", border: "1px solid var(--border)", fontSize: "1.1rem" }} />
        
        <div style={{ display: "flex", gap: "15px" }}>
          <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
          <input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
        </div>

        <input required type="text" placeholder="Location (e.g., Community Hall)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input type="checkbox" id="isVirtualToggle" checked={formData.isVirtual} onChange={e => setFormData({...formData, isVirtual: e.target.checked})} />
          <label htmlFor="isVirtualToggle" style={{ fontWeight: "500", color: "var(--foreground)" }}>Online Event?</label>
        </div>

        {formData.isVirtual && (
          <input type="url" placeholder="Meeting Link (Zoom, Meet, etc.)" value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
        )}

        <div>
          <label style={{ display: "block", marginBottom: "5px", color: "var(--secondary)", fontWeight: "bold" }}>Featured Images</label>
          <input type="file" multiple accept="image/*" onChange={e => setImagesFiles(Array.from(e.target.files || []))} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)", width: "100%" }} />
          {existingImages.length > 0 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              {existingImages.map((src, idx) => (
                <div key={idx} style={{ position: "relative", width: "80px", height: "80px" }}>
                  <img src={src} alt="existing" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                  <button type="button" onClick={() => removeExistingImage(idx, "image")} style={{ position: "absolute", top: 0, right: 0, background: "rgba(255,0,0,0.7)", color: "white", border: "none", cursor: "pointer", borderRadius: "0 4px 0 4px", fontSize: "0.7rem", padding: "2px 5px" }}>X</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
           <label style={{ display: "block", marginBottom: "5px", color: "var(--secondary)", fontWeight: "bold" }}>Gallery Images</label>
           <input type="file" multiple accept="image/*" onChange={e => setGalleryFiles(Array.from(e.target.files || []))} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)", width: "100%" }} />
           {existingGallery.length > 0 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              {existingGallery.map((src, idx) => (
                <div key={idx} style={{ position: "relative", width: "80px", height: "80px" }}>
                  <img src={src} alt="existing" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                  <button type="button" onClick={() => removeExistingImage(idx, "gallery")} style={{ position: "absolute", top: 0, right: 0, background: "rgba(255,0,0,0.7)", color: "white", border: "none", cursor: "pointer", borderRadius: "0 4px 0 4px", fontSize: "0.7rem", padding: "2px 5px" }}>X</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <textarea required placeholder="Event Description/Agenda" rows={8} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: "12px", borderRadius: "4px", border: "1px solid var(--border)", fontFamily: "monospace", fontSize: "1rem" }} />

        <button disabled={loading} type="submit" style={{ background: "var(--primary)", color: "white", padding: "15px", border: "none", borderRadius: "6px", cursor: loading ? "wait" : "pointer", fontSize: "1.05rem", fontWeight: "bold", marginTop: "10px" }}>
          {loading ? "Uploading & Saving..." : (editEvent ? "Update Event" : "Save Event")}
        </button>
        {editEvent && (
          <button type="button" onClick={onSuccess} style={{ background: "transparent", color: "var(--text-muted)", padding: "10px", border: "1px solid var(--border)", borderRadius: "6px", cursor: "pointer", marginTop: "5px" }}>
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
}

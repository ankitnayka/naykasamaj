"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Artisan {
  _id: string;
  name: string;
  bio: string;
  craftType: string;
  location: string;
  contactEmail: string;
  contactPhone?: string;
  imageUrl?: string;
  isVerified: boolean;
}

export default function ArtisanManager({ initialArtisans }: { initialArtisans: Artisan[] }) {
  const [artisans, setArtisans] = useState<Artisan[]>(initialArtisans);
  const [editingArtisan, setEditingArtisan] = useState<Artisan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    craftType: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
    isVerified: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (editingArtisan) {
      setFormData({
        name: editingArtisan.name,
        bio: editingArtisan.bio,
        craftType: editingArtisan.craftType,
        location: editingArtisan.location,
        contactEmail: editingArtisan.contactEmail,
        contactPhone: editingArtisan.contactPhone || "",
        isVerified: editingArtisan.isVerified
      });
      setImageFile(null);
      setIsFormOpen(true);
    } else {
      setFormData({
        name: "", bio: "", craftType: "", location: "", contactEmail: "", contactPhone: "", isVerified: false
      });
      setImageFile(null);
    }
  }, [editingArtisan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const url = editingArtisan ? `/api/admin/adi-haat/artisans/${editingArtisan._id}` : "/api/admin/adi-haat/artisans";
    const method = editingArtisan ? "PUT" : "POST";

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value.toString());
    });
    if (imageFile) {
      payload.append("image", imageFile);
    }
    if (editingArtisan?.imageUrl) {
      payload.append("imageUrl", editingArtisan.imageUrl);
    }

    try {
      const res = await fetch(url, {
        method,
        body: payload
      });

      if (res.ok) {
        const data = await res.json();
        if (editingArtisan) {
          setArtisans(artisans.map(a => a._id === editingArtisan._id ? data.artisan : a));
        } else {
          setArtisans([data.artisan, ...artisans]);
        }
        setIsFormOpen(false);
        setEditingArtisan(null);
        alert(editingArtisan ? "Artisan updated!" : "Artisan created!");
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save artisan");
      }
    } catch (error) {
      alert("Error saving artisan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this artisan? All their products will also be deleted.")) return;
    
    try {
      const res = await fetch(`/api/admin/adi-haat/artisans/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArtisans(artisans.filter(a => a._id !== id));
        alert("Artisan deleted!");
      } else {
        alert("Failed to delete artisan");
      }
    } catch (error) {
      alert("Error deleting artisan");
    }
  };

  const handleModeration = async (id: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/admin/adi-haat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artisanId: id, action })
      });

      if (res.ok) {
        if (action === "APPROVE") {
          setArtisans(artisans.map(a => a._id === id ? { ...a, isVerified: true } : a));
        } else {
          setArtisans(artisans.filter(a => a._id !== id));
        }
        alert(action === "APPROVE" ? "Artisan verified!" : "Artisan rejected and removed.");
        router.refresh();
      }
    } catch (error) {
      alert("Moderation failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ margin: 0 }}>Manage Artisans</h2>
        <button 
          onClick={() => { setEditingArtisan(null); setIsFormOpen(true); }}
          className="btn"
        >
          Add New Artisan
        </button>
      </div>

      {isFormOpen && (
        <div style={{ background: "var(--surface)", padding: "30px", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "40px", boxShadow: "var(--shadow-md)" }}>
          <h3 style={{ marginTop: 0 }}>{editingArtisan ? "Edit Artisan" : "Register New Artisan"}</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }} />
              <input type="text" placeholder="Craft Type (e.g., Pottery, Weaving)" value={formData.craftType} onChange={e => setFormData({...formData, craftType: e.target.value})} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }} />
            </div>
            <textarea placeholder="Artisan Biography/Story" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} required rows={4} style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", fontFamily: "inherit" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input type="text" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Artisan Photo</label>
                <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} accept="image/*" style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.85rem" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input type="email" placeholder="Contact Email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }} />
              <input type="tel" placeholder="Contact Phone (Optional)" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input type="checkbox" checked={formData.isVerified} onChange={e => setFormData({...formData, isVerified: e.target.checked})} id="isVerified" />
              <label htmlFor="isVerified">Verified Artisan (Publish Live)</label>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" className="btn" disabled={loading}>{loading ? "Saving..." : (editingArtisan ? "Update Artisan" : "Add Artisan")}</button>
              <button type="button" onClick={() => { setIsFormOpen(false); setEditingArtisan(null); }} className="btn" style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
        {artisans.map(artisan => (
          <div key={artisan._id} style={{ background: "var(--surface)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                {artisan.imageUrl && (
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--primary)" }}>
                    <img src={artisan.imageUrl} alt={artisan.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "1.2rem" }}>{artisan.name}</h4>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{artisan.craftType} • {artisan.location}</div>
                </div>
              </div>
              <span style={{ fontSize: "0.7rem", padding: "4px 8px", borderRadius: "12px", background: artisan.isVerified ? "#e8f5e9" : "#fff3e0", color: artisan.isVerified ? "#2e7d32" : "#ef6c00", fontWeight: "bold" }}>
                {artisan.isVerified ? "VERIFIED" : "PENDING"}
              </span>
            </div>
            
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "20px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {artisan.bio}
            </p>

            <div style={{ display: "flex", gap: "10px", borderTop: "1px solid var(--border)", paddingTop: "15px" }}>
              <button onClick={() => setEditingArtisan(artisan)} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid var(--primary)", background: "transparent", color: "var(--primary)", cursor: "pointer" }}>Edit</button>
              <button onClick={() => handleDelete(artisan._id)} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #e74c3c", background: "transparent", color: "#e74c3c", cursor: "pointer" }}>Delete</button>
              {!artisan.isVerified && (
                <button onClick={() => handleModeration(artisan._id, "APPROVE")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "none", background: "#2ecc71", color: "white", cursor: "pointer" }}>Approve</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

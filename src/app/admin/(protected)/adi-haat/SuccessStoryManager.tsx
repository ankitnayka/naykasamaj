"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SuccessStory {
  _id: string;
  title: string;
  artisanName: string;
  story: string;
  images: string[];
  craftType: string;
  location: string;
}

export default function SuccessStoryManager({ initialStories }: { initialStories: SuccessStory[] }) {
  const [stories, setStories] = useState<SuccessStory[]>(initialStories);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    artisanName: "",
    story: "",
    craftType: "",
    location: ""
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (editingStory) {
      setFormData({
        title: editingStory.title,
        artisanName: editingStory.artisanName,
        story: editingStory.story,
        craftType: editingStory.craftType,
        location: editingStory.location
      });
      setImageFiles([]);
      setIsFormOpen(true);
    } else {
      setFormData({
        title: "", artisanName: "", story: "", craftType: "", location: ""
      });
      setImageFiles([]);
    }
  }, [editingStory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = editingStory ? `/api/admin/adi-haat/success-stories/${editingStory._id}` : "/api/admin/adi-haat/success-stories";
    const method = editingStory ? "PUT" : "POST";

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value.toString());
    });

    imageFiles.forEach(file => {
      payload.append("images", file);
    });

    if (editingStory?.images) {
      payload.append("existingImages", JSON.stringify(editingStory.images));
    }

    try {
      const res = await fetch(url, {
        method,
        body: payload
      });

      if (res.ok) {
        const data = await res.json();
        if (editingStory) {
          setStories(stories.map(s => s._id === editingStory._id ? data.story : s));
        } else {
          setStories([data.story, ...stories]);
        }
        setIsFormOpen(false);
        setEditingStory(null);
        alert(editingStory ? "Story updated!" : "Story created!");
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save story");
      }
    } catch (error) {
      alert("Error saving story");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this success story?")) return;

    try {
      const res = await fetch(`/api/admin/adi-haat/success-stories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStories(stories.filter(s => s._id !== id));
        alert("Story deleted!");
      } else {
        alert("Failed to delete story");
      }
    } catch (error) {
      alert("Error deleting story");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ margin: 0 }}>Manage Success Stories</h2>
        <button
          onClick={() => { setEditingStory(null); setIsFormOpen(true); }}
          className="btn"
        >
          Add New Story
        </button>
      </div>

      {isFormOpen && (
        <div style={{ background: "var(--surface)", padding: "30px", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "40px", boxShadow: "var(--shadow-md)" }}>
          <h3 style={{ marginTop: 0 }}>{editingStory ? "Edit Story" : "Write Success Story"}</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input type="text" placeholder="Story Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }} />
              <input type="text" placeholder="Artisan Name" value={formData.artisanName} onChange={e => setFormData({ ...formData, artisanName: e.target.value })} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }} />
            </div>
            <textarea placeholder="Write the success story here..." value={formData.story} onChange={e => setFormData({ ...formData, story: e.target.value })} required rows={6} style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", fontFamily: "inherit" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
              <input type="text" placeholder="Craft Type" value={formData.craftType} onChange={e => setFormData({ ...formData, craftType: e.target.value })} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }} />
              <input type="text" placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Story Images (Multiple)</label>
                <input type="file" multiple onChange={e => setImageFiles(Array.from(e.target.files || []))} accept="image/*" style={{ padding: "5px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.85rem" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" className="btn" disabled={loading}>{loading ? "Saving..." : (editingStory ? "Update Story" : "Publish Story")}</button>
              <button type="button" onClick={() => { setIsFormOpen(false); setEditingStory(null); }} className="btn" style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "25px" }}>
        {stories.map(story => (
          <div key={story._id} style={{ background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {story.images?.[0] && (
              <div style={{ height: "180px", overflow: "hidden" }}>
                <img src={story.images[0]} alt={story.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div style={{ padding: "20px", flex: 1 }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "1.25rem", color: "var(--secondary)" }}>{story.title}</h4>
              <div style={{ display: "flex", gap: "10px", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "15px" }}>
                <span>👤 {story.artisanName}</span>
                <span>🎨 {story.craftType}</span>
                <span>📍 {story.location}</span>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "var(--foreground)", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {story.story}
              </p>
              {story.images?.length > 1 && (
                <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                  {story.images.slice(1, 4).map((img, i) => (
                    <div key={i} style={{ width: "40px", height: "40px", borderRadius: "4px", overflow: "hidden" }}>
                      <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Extra" />
                    </div>
                  ))}
                  {story.images.length > 4 && <div style={{ fontSize: "0.75rem", alignSelf: "center" }}>+{story.images.length - 4} more</div>}
                </div>
              )}
            </div>
            <div style={{ padding: "15px", borderTop: "1px solid var(--border)", display: "flex", gap: "10px", background: "#fcfcfc" }}>
              <button onClick={() => setEditingStory(story)} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid var(--primary)", background: "transparent", color: "var(--primary)", cursor: "pointer" }}>Edit</button>
              <button onClick={() => handleDelete(story._id)} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #e74c3c", background: "transparent", color: "#e74c3c", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

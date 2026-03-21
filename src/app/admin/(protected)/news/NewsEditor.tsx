"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewsEditor({ editArticle, onSuccess }: { editArticle?: any, onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    isPublished: true
  });
  
  const [imagesFiles, setImagesFiles] = useState<File[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  const [aiPrompt, setAiPrompt] = useState("");

  useEffect(() => {
    fetchCategories();
    if (editArticle) {
      setFormData({
        title: editArticle.title || "",
        content: editArticle.content || "",
        excerpt: editArticle.excerpt || "",
        category: editArticle.category || "",
        tags: editArticle.tags ? editArticle.tags.join(", ") : "",
        isPublished: editArticle.isPublished
      });
      setExistingImages(editArticle.images || []);
      setExistingGallery(editArticle.gallery || []);
    } else {
      setFormData({ title: "", content: "", excerpt: "", category: "", tags: "", isPublished: true });
      setExistingImages([]);
      setExistingGallery([]);
      setImagesFiles([]);
      setGalleryFiles([]);
    }
  }, [editArticle]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/news/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (!editArticle && data.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: data[0].name }));
        }
      }
    } catch(e) {}
  };

  const handleAiDraft = async (action: "DRAFT_NEWS" | "FACT_CHECK") => {
    if (!aiPrompt) return alert("Please enter a topic or claim first.");
    setAiLoading(true);
    try {
      const res = await fetch("/api/admin/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, action })
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, content: prev.content + "\n\n" + data.text }));
      } else {
        alert("AI Error: " + data.error);
      }
    } catch (err) {
      alert("Network Error during AI generation");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("excerpt", formData.excerpt);
      data.append("category", formData.category);
      data.append("tags", formData.tags);
      data.append("isPublished", formData.isPublished.toString());
      
      if (editArticle) {
        data.append("existingImages", JSON.stringify(existingImages));
        data.append("existingGallery", JSON.stringify(existingGallery));
      }

      imagesFiles.forEach(f => data.append("images", f));
      galleryFiles.forEach(f => data.append("gallery", f));

      const url = editArticle ? `/api/admin/news/${editArticle._id}` : "/api/admin/news";
      const method = editArticle ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data
      });
      
      if (res.ok) {
        alert(`Article ${editArticle ? "updated" : "created"} successfully!`);
        if (!editArticle) {
          setFormData({ title: "", content: "", excerpt: "", category: categories.length > 0 ? categories[0].name : "", tags: "", isPublished: true });
          setImagesFiles([]);
          setGalleryFiles([]);
          setExistingImages([]);
          setExistingGallery([]);
        }
        setAiPrompt("");
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
      {/* Gemini AI Assistant Block */}
      <div style={{ background: "linear-gradient(to right, #eef2ff, #f0fdf4)", padding: "20px", borderRadius: "8px", marginBottom: "30px", border: "1px solid #c7d2fe" }}>
        <h3 style={{ fontSize: "1.1rem", margin: "0 0 10px 0", color: "#4338ca", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>✨</span> Gemini AI Assistant
        </h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input 
            type="text" 
            placeholder="Enter a topic or claim for Gemini..." 
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #a5b4fc" }}
          />
          <button 
            type="button"
            disabled={aiLoading}
            onClick={() => handleAiDraft("DRAFT_NEWS")}
            style={{ background: "#4f46e5", color: "white", border: "none", padding: "10px 15px", borderRadius: "4px", cursor: aiLoading ? "wait" : "pointer" }}
          >Draft News</button>
          <button 
            type="button"
            disabled={aiLoading}
            onClick={() => handleAiDraft("FACT_CHECK")}
            style={{ background: "#059669", color: "white", border: "none", padding: "10px 15px", borderRadius: "4px", cursor: aiLoading ? "wait" : "pointer" }}
          >Fact Check</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input required type="text" placeholder="Article Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: "12px", borderRadius: "4px", border: "1px solid var(--border)", fontSize: "1.1rem" }} />
        
        <div style={{ display: "flex", gap: "15px" }}>
          <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
          <input type="text" placeholder="Tags (comma separated)" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
        </div>

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

        <textarea placeholder="Short excerpt (optional)" rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
        
        <textarea required placeholder="Full Article Content (Markdown/Text)" rows={15} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} style={{ padding: "12px", borderRadius: "4px", border: "1px solid var(--border)", fontFamily: "monospace", fontSize: "1rem" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input type="checkbox" id="publishToggle" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} />
          <label htmlFor="publishToggle" style={{ fontWeight: "500", color: "var(--foreground)" }}>Publish immediately</label>
        </div>

        <button disabled={loading} type="submit" style={{ background: "var(--primary)", color: "white", padding: "15px", border: "none", borderRadius: "6px", cursor: loading ? "wait" : "pointer", fontSize: "1.05rem", fontWeight: "bold", marginTop: "10px" }}>
          {loading ? "Uploading & Saving..." : (editArticle ? "Update Article" : "Save Article")}
        </button>
        {editArticle && (
          <button type="button" onClick={onSuccess} style={{ background: "transparent", color: "var(--text-muted)", padding: "10px", border: "1px solid var(--border)", borderRadius: "6px", cursor: "pointer", marginTop: "5px" }}>
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
}

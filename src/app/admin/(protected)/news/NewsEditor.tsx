"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsEditor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "NEWS",
    tags: "",
    isPublished: true
  });
  
  const [aiPrompt, setAiPrompt] = useState("");

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
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert("Article created successfully!");
        setFormData({ title: "", content: "", excerpt: "", category: "NEWS", tags: "", isPublished: true });
        setAiPrompt("");
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
          >
            Draft News
          </button>
          <button 
            type="button"
            disabled={aiLoading}
            onClick={() => handleAiDraft("FACT_CHECK")}
            style={{ background: "#059669", color: "white", border: "none", padding: "10px 15px", borderRadius: "4px", cursor: aiLoading ? "wait" : "pointer" }}
          >
            Fact Check
          </button>
        </div>
        <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: 0 }}>Generated content will be appended to your article editor below.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input required type="text" placeholder="Article Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: "12px", borderRadius: "4px", border: "1px solid var(--border)", fontSize: "1.1rem" }} />
        
        <div style={{ display: "flex", gap: "15px" }}>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }}>
            <option value="NEWS">News</option>
            <option value="ALERT">Alert</option>
            <option value="FACT_CHECK">Fact Check</option>
            <option value="STATEMENT">Statement</option>
            <option value="BLOG">Blog</option>
          </select>
          <input type="text" placeholder="Tags (comma separated)" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
        </div>

        <textarea placeholder="Short excerpt (optional)" rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
        
        <textarea required placeholder="Full Article Content (Markdown/Text)" rows={15} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} style={{ padding: "12px", borderRadius: "4px", border: "1px solid var(--border)", fontFamily: "monospace", fontSize: "1rem" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input type="checkbox" id="publishToggle" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} />
          <label htmlFor="publishToggle" style={{ fontWeight: "500", color: "var(--foreground)" }}>Publish immediately</label>
        </div>

        <button disabled={loading} type="submit" style={{ background: "var(--primary)", color: "white", padding: "15px", border: "none", borderRadius: "6px", cursor: loading ? "wait" : "pointer", fontSize: "1.05rem", fontWeight: "bold", marginTop: "10px" }}>
          {loading ? "Saving..." : "Save Article"}
        </button>
      </form>
    </div>
  );
}

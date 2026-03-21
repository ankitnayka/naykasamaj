"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NewsEditor from "./NewsEditor";

export default function ArticleManagerList({ initialArticles }: { initialArticles: any[] }) {
  const router = useRouter();
  const [editingArticle, setEditingArticle] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Article deleted");
        router.refresh();
      } else {
        alert("Failed to delete article");
      }
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>
            {editingArticle ? "Edit Article" : "Create New Article"}
          </h2>
          <NewsEditor 
            key={editingArticle ? editingArticle._id : "new"} 
            editArticle={editingArticle} 
            onSuccess={() => setEditingArticle(null)} 
          />
        </div>

        <div>
           <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>Manage Articles</h2>
           <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
             {initialArticles.length === 0 ? (
               <p style={{ color: "var(--text-muted)" }}>No articles published yet.</p>
             ) : (
               initialArticles.map((article: any) => (
                 <div key={article._id.toString()} style={{ background: "var(--surface)", padding: "15px", borderRadius: "8px", borderLeft: `4px solid ${article.isPublished ? "var(--primary)" : "var(--text-muted)"}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                   <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "var(--accent)", marginBottom: "5px" }}>{article.category}</div>
                   <h4 style={{ margin: "0 0 5px 0", fontSize: "1rem" }}>{article.title}</h4>
                   <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                     <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                     <span style={{ fontWeight: "bold", color: article.isPublished ? "var(--primary)" : "var(--text-muted)" }}>{article.isPublished ? "Published" : "Draft"}</span>
                   </div>
                   <div style={{ display: "flex", gap: "10px" }}>
                     <button onClick={() => setEditingArticle(article)} style={{ flex: 1, padding: "5px", background: "var(--border)", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}>Edit</button>
                     <button onClick={() => handleDelete(article._id.toString())} style={{ flex: 1, padding: "5px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}>Delete</button>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </>
  );
}

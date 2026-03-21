"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CategoryManager() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/news/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/news/categories", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editId ? { id: editId, name, description } : { name, description })
      });
      if (res.ok) {
        alert(`Category ${editId ? "updated" : "created"} successfully`);
        resetForm();
        fetchCategories();
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || `Failed to ${editId ? "update" : "create"} category`);
      }
    } catch (e) {
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setDescription("");
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/news/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Category deleted");
        fetchCategories();
        router.refresh();
      } else {
        alert("Failed to delete category");
      }
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "30px" }}>
      <h3 style={{ fontSize: "1.2rem", marginBottom: "15px", color: "var(--secondary)" }}>Manage Categories</h3>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
        <input required type="text" placeholder="Category Name" value={name} onChange={e => setName(e.target.value)} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)", flex: 1 }} />
        <input type="text" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border)", flex: 2 }} />
        <button type="submit" disabled={loading} style={{ background: "var(--primary)", color: "white", padding: "10px 15px", borderRadius: "4px", border: "none", cursor: loading ? "wait" : "pointer", whiteSpace: "nowrap" }}>
          {loading ? "Saving..." : (editId ? "Update Category" : "Add Category")}
        </button>
        {editId && (
          <button type="button" onClick={resetForm} style={{ background: "transparent", color: "var(--text-muted)", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Cancel
          </button>
        )}
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {categories.length === 0 ? <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No categories found.</p> : categories.map(cat => (
          <div key={cat._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", border: "1px solid var(--border)", borderRadius: "4px" }}>
            <div>
              <strong>{cat.name}</strong> <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{cat.description}</span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={() => { setEditId(cat._id); setName(cat.name); setDescription(cat.description || ""); }} style={{ color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>Edit</button>
              <button type="button" onClick={() => handleDelete(cat._id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

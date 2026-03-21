"use client";

import React, { useState } from "react";
import SchemeForm from "./SchemeForm";

export default function SchemeManagerList({ initialSchemes, categories, targetGroups }: { initialSchemes: any[], categories: any[], targetGroups: any[] }) {
  const [schemes, setSchemes] = useState<any[]>(initialSchemes);
  const [editingScheme, setEditingScheme] = useState<any | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/schemes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSchemes(prev => prev.filter(s => s._id !== id));
      } else {
        alert("Failed to delete scheme");
      }
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "var(--secondary)" }}>
        {editingScheme ? "Edit Scheme" : "Create New Scheme"}
      </h2>
      
      <SchemeForm 
        existingScheme={editingScheme} 
        categories={categories}
        targetGroups={targetGroups}
        onSuccess={(newScheme: any) => {
          if (editingScheme) {
            setSchemes(schemes.map(s => s._id === newScheme._id ? newScheme : s));
            setEditingScheme(null);
          } else {
            setSchemes([newScheme, ...schemes]);
          }
        }} 
        onCancel={editingScheme ? () => setEditingScheme(null) : undefined}
      />

      <h2 style={{ fontSize: "1.5rem", marginTop: "40px", marginBottom: "20px", color: "var(--secondary)" }}>
        Existing Schemes
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {schemes.length === 0 ? <p>No schemes found.</p> : schemes.map(scheme => (
          <div key={scheme._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--surface)" }}>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "5px" }}>{scheme.title}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <span><strong>Provider:</strong> {scheme.provider}</span>
                <span><strong>Cat:</strong> {scheme.category}</span>
                <span><strong>Group:</strong> {scheme.targetGroup}</span>
                <span style={{ color: scheme.status === "Active" ? "green" : "red" }}>{scheme.status}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
               <button 
                 onClick={() => setEditingScheme(scheme)}
                 style={{ padding: "8px 12px", background: "var(--primary)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
               >
                 Edit
               </button>
               <button 
                 onClick={() => handleDelete(scheme._id, scheme.title)}
                 style={{ padding: "8px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
               >
                 Delete
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import SchemeCard from "./SchemeCard";

export default function SchemesPage() {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["ALL"]);
  const [targetGroups, setTargetGroups] = useState<string[]>(["ALL"]);
  
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeTargetGroup, setActiveTargetGroup] = useState("ALL");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schRes, catRes, targRes] = await Promise.all([
          fetch("/api/admin/schemes"),
          fetch("/api/admin/schemes/categories"),
          fetch("/api/admin/schemes/targetgroups")
        ]);

        if (catRes.ok) {
          const cats = await catRes.json();
          setCategories(["ALL", ...cats.map((c: any) => c.name)]);
        }
        if (targRes.ok) {
          const targs = await targRes.json();
          setTargetGroups(["ALL", ...targs.map((t: any) => t.name)]);
        }
        if (schRes.ok) {
          const data = await schRes.json();
          setSchemes(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSchemes = schemes.filter(s => {
    let matchCat = activeCategory === "ALL" || s.category === activeCategory;
    let matchTarg = activeTargetGroup === "ALL" || s.targetGroup === activeTargetGroup;
    return matchCat && matchTarg;
  });

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "1100px" }}>
        
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "10px", textAlign: "center" }}>
          Government & Private Schemes
        </h1>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "40px", fontSize: "1.1rem" }}>
          Find subsidies, scholarships, business grants, and community programs tailored for you.
        </p>

        {loading ? (
          <p style={{ textAlign: "center", padding: "50px" }}>Loading schemes...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* Filters */}
            <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "12px", boxShadow: "var(--shadow-sm)", display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem", color: "var(--secondary)" }}>Filter by Category</label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        background: activeCategory === cat ? "var(--primary)" : "transparent",
                        color: activeCategory === cat ? "white" : "var(--foreground)",
                        border: "1px solid var(--primary)",
                        padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: "500", fontSize: "0.85rem",
                        transition: "var(--transition)"
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem", color: "var(--secondary)" }}>Filter by Target Group</label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {targetGroups.map(targ => (
                    <button 
                      key={targ}
                      onClick={() => setActiveTargetGroup(targ)}
                      style={{
                        background: activeTargetGroup === targ ? "var(--primary)" : "transparent",
                        color: activeTargetGroup === targ ? "white" : "var(--foreground)",
                        border: "1px solid var(--border)",
                        padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: "500", fontSize: "0.85rem",
                        transition: "var(--transition)"
                      }}
                    >
                      {targ}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Schemes List */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "25px" }}>
              {filteredSchemes.map(scheme => (
                <SchemeCard key={scheme._id} scheme={scheme} />
              ))}
            </div>

            {filteredSchemes.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px", background: "var(--surface)", borderRadius: "12px", border: "1px dashed var(--border)" }}>
                <h3 style={{ color: "var(--secondary)", marginBottom: "10px" }}>No Schemes Found</h3>
                <p style={{ color: "var(--text-muted)" }}>We couldn't find any schemes matching your selected filters.</p>
                <button onClick={() => { setActiveCategory("ALL"); setActiveTargetGroup("ALL"); }} style={{ marginTop: "15px", background: "var(--primary)", color: "white", border: "none", padding: "10px 20px", borderRadius: "20px", cursor: "pointer" }}>
                  Clear Filters
                </button>
              </div>
            )}
            
          </div>
        )}

      </div>
    </div>
  );
}

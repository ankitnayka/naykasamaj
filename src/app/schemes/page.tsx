"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Scheme {
  _id: string;
  title: string;
  description: string;
  provider: string;
  category: string;
  eligibility: string[];
  applicationLink?: string;
  deadline?: string;
  forms?: { title: string, url: string }[];
}

export default function Schemes() {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  
  // GEET-style filter state
  const [providerFilter, setProviderFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (providerFilter !== "ALL") queryParams.set("provider", providerFilter);
        if (categoryFilter !== "ALL") queryParams.set("category", categoryFilter);
        
        const res = await fetch(`/api/schemes?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSchemes(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, [providerFilter, categoryFilter]);

  const mockSchemes: Scheme[] = [
    {
      _id: "m1",
      title: "PM Vidyalakshmi Karyakram",
      description: "Financial assistance for higher education.",
      provider: "CENTRAL",
      category: "EDUCATION",
      eligibility: ["Income < 8L", "Merit Student"],
      deadline: "2026-08-30",
      forms: [{ title: "PM_Vidyalakshmi_Form.pdf", url: "#" }]
    },
    {
      _id: "m2",
      title: "Nayka Samaj Scholarship",
      description: "Internal community scholarship for meritorious students.",
      provider: "NGO",
      category: "EDUCATION",
      eligibility: ["Nayka Samaj Member", "80%+ in 10th/12th"],
      deadline: "2026-07-15",
      forms: [{ title: "Samaj_Scholarship_2026.pdf", url: "#" }]
    }
  ];

  const displaySchemes = schemes.length > 0 ? schemes : mockSchemes.filter(s => 
    (providerFilter === "ALL" || s.provider === providerFilter) && 
    (categoryFilter === "ALL" || s.category === categoryFilter)
  );

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "15px", textAlign: "center" }}>
          Interactive Scheme Finder
        </h1>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "30px", fontSize: "1.1rem" }}>
          Discover and apply for Central, State, and Community welfare schemes.
        </p>

        {/* Scholarship & Deadline Alerts Banner */}
        <div style={{ background: "#fff8e1", borderLeft: "4px solid #f59e0b", padding: "15px 20px", borderRadius: "8px", marginBottom: "40px", display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "1.5rem" }}>🔔</div>
          <div>
            <h3 style={{ margin: "0 0 5px 0", color: "#b45309", fontSize: "1.1rem" }}>Scholarship Alerts</h3>
            <p style={{ margin: 0, color: "#92400e", fontSize: "0.95rem" }}>
              The deadline for the <strong>Nayka Samaj Scholarship 2026</strong> is approaching on <span style={{ fontWeight: "bold", textDecoration: "underline" }}>July 15, 2026</span>. Please download the form below and submit it to your nearest regional office.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", marginBottom: "30px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem", color: "var(--text-muted)" }}>Provider</label>
            <select 
              value={providerFilter} 
              onChange={(e) => setProviderFilter(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
            >
              <option value="ALL">All Providers</option>
              <option value="CENTRAL">Central Government</option>
              <option value="STATE">State Government</option>
              <option value="NGO">Nayka Samaj (NGO)</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem", color: "var(--text-muted)" }}>Category</label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
            >
              <option value="ALL">All Categories</option>
              <option value="EDUCATION">Education & Scholarships</option>
              <option value="HEALTH">Health & Medical</option>
              <option value="BUSINESS">Business & Loans</option>
              <option value="AGRICULTURE">Agriculture</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: "grid", gap: "20px" }}>
          {displaySchemes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", background: "var(--surface)", borderRadius: "var(--radius)", color: "var(--text-muted)" }}>
              No schemes found matching your criteria.
            </div>
          ) : (
            displaySchemes.map((scheme) => (
              <div key={scheme._id} style={{ background: "var(--surface)", padding: "25px", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", borderLeft: "4px solid var(--primary)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <h2 style={{ color: "var(--secondary)", fontSize: "1.4rem", margin: 0 }}>{scheme.title}</h2>
                  <span style={{ background: "var(--primary)", color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600" }}>
                    {scheme.provider}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", marginBottom: "15px" }}>{scheme.description}</p>
                
                {scheme.eligibility && scheme.eligibility.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "5px" }}>Eligibility Criteria:</h4>
                    <ul style={{ paddingLeft: "20px", fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>
                      {scheme.eligibility.map((req, i) => <li key={i}>{req}</li>)}
                    </ul>
                  </div>
                )}

                {scheme.forms && scheme.forms.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "8px" }}>Downloadable Forms:</h4>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {scheme.forms.map((form, i) => (
                        <a key={i} href={form.url} onClick={(e) => { e.preventDefault(); alert("Downloading " + form.title); }} style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#334155", padding: "6px 12px", borderRadius: "6px", textDecoration: "none", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }} className="hover-shadow">
                          <span>📄</span> {form.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                  <button className="btn" style={{ fontSize: "0.9rem", padding: "8px 20px" }}>Check Eligibility / Apply Online</button>
                  {scheme.deadline && (
                    <div style={{ fontSize: "0.85rem", color: "#e74c3c", fontWeight: "bold" }}>
                      ⏳ Deadline: {new Date(scheme.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

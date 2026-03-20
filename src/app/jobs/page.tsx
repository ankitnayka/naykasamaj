"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  isSkillDevelopment: boolean;
  createdAt: string;
}

export default function Jobs() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filterType, setFilterType] = useState("ALL");
  const [showSkillDevOnly, setShowSkillDevOnly] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filterType !== "ALL") queryParams.set("type", filterType);
        if (showSkillDevOnly) queryParams.set("isSkillDevelopment", "true");
        
        const res = await fetch(`/api/jobs?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchJobs();
  }, [filterType, showSkillDevOnly]);

  const mockJobs: Job[] = [
    {
      _id: "j1",
      title: "Software Engineer Trainee",
      company: "Tech Mahindra",
      location: "Pune, MH",
      type: "FULL_TIME",
      description: "Looking for fresh graduates with strong programming fundamentals.",
      isSkillDevelopment: false,
      createdAt: new Date().toISOString()
    },
    {
      _id: "j2",
      title: "PMKVY Data Entry Operator Training",
      company: "Govt. Skill India",
      location: "Surat, GJ",
      type: "PART_TIME",
      description: "Free 3-month skill certification course with placement assistance.",
      isSkillDevelopment: true,
      createdAt: new Date().toISOString()
    }
  ];

  const displayJobs = jobs.length > 0 ? jobs : mockJobs.filter(j => 
    (filterType === "ALL" || j.type === filterType) && 
    (!showSkillDevOnly || j.isSkillDevelopment)
  );

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "15px", textAlign: "center" }}>
          Community Job Board & Skill Development
        </h1>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "40px", fontSize: "1.1rem" }}>
          Find jobs shared by our members or enroll in government skill-building programs.
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn" style={{ padding: "8px 16px" }}>Post a Job</button>
          </div>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "var(--foreground)" }}>
              <input 
                type="checkbox" 
                checked={showSkillDevOnly} 
                onChange={(e) => setShowSkillDevOnly(e.target.checked)} 
                style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
              />
              Show Skill Programs Only
            </label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              style={{ padding: "8px 15px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
            >
              <option value="ALL">All Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internships</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gap: "20px" }}>
          {displayJobs.map((job) => (
            <div key={job._id} style={{ background: "var(--surface)", padding: "20px", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
              {job.isSkillDevelopment && (
                <div style={{ position: "absolute", top: 0, right: 0, background: "var(--accent)", color: "white", padding: "4px 12px", fontSize: "0.75rem", fontWeight: "bold", borderBottomLeftRadius: "var(--radius)" }}>
                  SKILL PROGRAM
                </div>
              )}
              <h3 style={{ margin: "0 0 5px 0", color: "var(--secondary)", fontSize: "1.2rem", paddingRight: "100px" }}>{job.title}</h3>
              <div style={{ display: "flex", gap: "15px", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "15px" }}>
                <span>🏢 {job.company}</span>
                <span>📍 {job.location}</span>
                <span>⏱️ {job.type.replace("_", " ")}</span>
              </div>
              <p style={{ color: "var(--foreground)", fontSize: "0.95rem", marginBottom: "15px" }}>{job.description}</p>
              <button className="btn" style={{ background: "transparent", color: "var(--primary)", border: "1px solid var(--primary)", padding: "6px 16px" }}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

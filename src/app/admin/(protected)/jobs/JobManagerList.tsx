"use client";

import React, { useState } from "react";
import JobForm from "./JobForm";

export default function JobManagerList({ initialJobs }: { initialJobs: any[] }) {
  const [jobs, setJobs] = useState<any[]>(initialJobs);
  const [editingJob, setEditingJob] = useState<any | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the listing for "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs(prev => prev.filter(j => j._id !== id));
        alert("Listing deleted successfully");
      } else {
        const err = await res.json();
        alert("Error deleting listing: " + err.error);
      }
    } catch (e) {
      alert("Network error");
    }
  };

  const handleUpdate = (updatedJob: any) => {
    setJobs(prev => prev.map(j => j._id === updatedJob._id ? updatedJob : j));
    setEditingJob(null);
  };

  const handleCreate = (newJob: any) => {
    setJobs(prev => [newJob, ...prev]);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
      
      <div>
        <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>
          {editingJob ? "Edit Listing" : "Add New Listing"}
        </h2>
        <JobForm 
          existingJob={editingJob} 
          onSuccess={editingJob ? handleUpdate : handleCreate} 
          onCancel={editingJob ? () => setEditingJob(null) : undefined}
        />
      </div>

      <div>
        <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>
          Active Listings Database
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {jobs.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No jobs posted yet.</p>
          ) : (
            jobs.map((job: any) => (
              <div 
                key={job._id.toString()} 
                style={{ 
                  background: "var(--surface)", 
                  padding: "15px", 
                  borderRadius: "8px", 
                  border: "1px solid var(--border)", 
                  borderLeft: `5px solid ${job.isSkillDevelopment ? "var(--accent)" : "var(--primary)"}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: job.isSkillDevelopment ? "var(--accent)" : "var(--primary)", background: "rgba(0,0,0,0.03)", padding: "2px 6px", borderRadius: "4px", marginRight: "8px" }}>
                      {job.isSkillDevelopment ? "SKILL PROGRAM" : "JOB OPPORTUNITY"}
                    </span>
                    <span style={{ 
                      fontSize: "0.7rem", 
                      fontWeight: "bold", 
                      color: job.status === "APPROVED" ? "#16a34a" : job.status === "DRAFT" ? "#6b7280" : "#d97706",
                      background: "rgba(0,0,0,0.03)", 
                      padding: "2px 6px", 
                      borderRadius: "4px" 
                    }}>
                      {job.status}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>{job.title}</h4>
                <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                  {job.company} • {job.location} • {job.type.replace('_', ' ')}
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                  <button 
                    onClick={() => setEditingJob(job)}
                    style={{ background: "var(--primary)", color: "white", padding: "6px 15px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(job._id, job.title)}
                    style={{ background: "transparent", color: "#ef4444", border: "1px solid #ef4444", padding: "6px 15px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

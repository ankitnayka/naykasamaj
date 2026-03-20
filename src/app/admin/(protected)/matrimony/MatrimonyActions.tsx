"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function MatrimonyActions({ profileId, isPending }: { profileId: string, isPending: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "APPROVE" | "REJECT") => {
    if (action === "REJECT" && !confirm("Warning: Rejecting will permanently delete this matrimony profile. Proceed?")) return;
    if (action === "APPROVE" && !confirm("Approve this profile for the private Members-only directory?")) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/matrimony", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, action })
      });
      if (res.ok) {
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
    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
      {isPending && (
        <button 
          onClick={() => handleAction("APPROVE")} 
          disabled={loading}
          style={{ flex: 1, background: "#8e44ad", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: loading ? "wait" : "pointer", fontSize: "0.85rem", fontWeight: "bold" }}
        >
          Approve Profile
        </button>
      )}
      <button 
        onClick={() => handleAction("REJECT")} 
        disabled={loading}
        style={{ flex: 1, background: "transparent", color: "#e74c3c", border: "1px solid #e74c3c", padding: "8px 12px", borderRadius: "4px", cursor: loading ? "wait" : "pointer", fontSize: "0.85rem", fontWeight: "bold" }}
      >
        {isPending ? "Reject & Delete" : "Remove Profile"}
      </button>
    </div>
  );
}

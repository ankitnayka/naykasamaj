"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArtisanActions({ artisanId, isPending }: { artisanId: string, isPending: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "APPROVE" | "REJECT") => {
    if (action === "REJECT" && !confirm("Are you sure you want to completely remove this artisan and their products?")) return;
    if (action === "APPROVE" && !confirm("Verify this artisan for the public marketplace?")) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/adi-haat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artisanId, action })
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
    <div style={{ display: "flex", gap: "8px" }}>
      {isPending && (
        <button 
          onClick={() => handleAction("APPROVE")} 
          disabled={loading}
          style={{ background: "#2ecc71", color: "white", border: "none", padding: "5px 10px", borderRadius: "12px", cursor: loading ? "wait" : "pointer", fontSize: "0.8rem", fontWeight: "bold" }}
        >
          Approve
        </button>
      )}
      <button 
        onClick={() => handleAction("REJECT")} 
        disabled={loading}
        style={{ background: "#e74c3c", color: "white", border: "none", padding: "5px 10px", borderRadius: "12px", cursor: loading ? "wait" : "pointer", fontSize: "0.8rem", fontWeight: "bold" }}
      >
        {isPending ? "Reject" : "Remove"}
      </button>
    </div>
  );
}

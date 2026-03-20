"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResolveButton({ messageId }: { messageId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    if (!confirm("Are you sure you want to mark this inquiry as resolved?")) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId })
      });
      if (res.ok) {
        router.refresh();
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
        setLoading(false);
      }
    } catch (err) {
      alert("Network Error");
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleResolve} 
      disabled={loading}
      style={{ 
        background: "var(--primary)", 
        color: "white", 
        border: "none", 
        padding: "6px 15px", 
        borderRadius: "4px", 
        cursor: loading ? "wait" : "pointer", 
        fontSize: "0.85rem",
        fontWeight: "bold"
      }}
    >
      {loading ? "Resolving..." : "Mark as Resolved"}
    </button>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface UserActionProps {
  userId: string;
  isPending: boolean;
  currentStatus: string;
}

export default function UserActions({ userId, isPending, currentStatus }: UserActionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string) => {
    if (action === "REJECT" || action === "BLOCK") {
      if (!confirm(`Are you sure you want to ${action.toLowerCase()} this user?`)) return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action })
      });
      
      const data = await res.json();
      if (res.ok) {
        // Refresh the page to reflect changes
        router.refresh();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Processing...</div>;
  }

  if (isPending) {
    return (
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={() => handleAction("APPROVE")} style={{ background: "var(--primary)", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}>Approve</button>
        <button onClick={() => handleAction("REJECT")} style={{ background: "#e74c3c", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}>Reject</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
      {currentStatus === "ACTIVE" ? (
        <button onClick={() => handleAction("SUSPEND")} style={{ background: "#f39c12", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}>Suspend</button>
      ) : (
        <span style={{ fontSize: "0.85rem", color: "#f39c12", fontWeight: "bold", paddingRight: "10px" }}>{currentStatus}</span>
      )}
      <button onClick={() => handleAction("BLOCK")} style={{ background: "#e74c3c", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}>Block</button>
    </div>
  );
}

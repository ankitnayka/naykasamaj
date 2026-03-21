import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function HeritageAdminDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div style={{ padding: "20px", fontFamily: "var(--font-primary)" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
        <h1 style={{ fontSize: "2rem", color: "var(--primary)" }}>HERITAGE DASHBOARD</h1>
        <div style={{ color: "var(--text-muted)" }}>Welcome, <strong>{session?.user?.name || "Admin"}</strong></div>
      </header>

      {/* METRICS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", borderTop: "4px solid var(--primary)", textAlign: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Items</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--foreground)" }}>156</div>
        </div>
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", borderTop: "4px solid var(--accent)", textAlign: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Pending Review</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--foreground)" }}>12</div>
        </div>
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", borderTop: "4px solid #e74c3c", textAlign: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Restricted Items</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--foreground)" }}>8</div>
        </div>
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", borderTop: "4px solid #f39c12", textAlign: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Needs Labels</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--foreground)" }}>3</div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ fontSize: "1.2rem", color: "var(--secondary)", marginBottom: "15px" }}>QUICK ACTIONS</h2>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <button style={{ padding: "10px 20px", background: "var(--primary)", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>+ Add New Story</button>
          <button style={{ padding: "10px 20px", background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>+ Upload Media</button>
          <button style={{ padding: "10px 20px", background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>+ Manage Labels</button>
          <button style={{ padding: "10px 20px", background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Reports</button>
        </div>
      </div>

      {/* TWO COLUMNS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        
        {/* RECENT ACTIVITY */}
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px" }}>
          <h2 style={{ fontSize: "1.2rem", color: "var(--secondary)", marginBottom: "15px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>RECENT CONTENT ACTIVITY</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>
            <li style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}><strong>Today 10:30 AM</strong> - Elder Interview uploaded by [Editor]</li>
            <li style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}><strong>Yesterday 4:15 PM</strong> - Festival Photos added by [Curator]</li>
            <li style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}><strong>Yesterday 2:00 PM</strong> - TK Label applied to 3 items by [Admin]</li>
            <li style={{ padding: "10px 0" }}><strong>Mar 15, 2025</strong> - Heritage Story published by [Editor]</li>
          </ul>
        </div>

        {/* CONTENT BY CATEGORY */}
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px" }}>
          <h2 style={{ fontSize: "1.2rem", color: "var(--secondary)", marginBottom: "15px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>CONTENT BY CATEGORY</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", color: "var(--text-muted)" }}>
            <div><strong>Oral Histories:</strong> 45</div>
            <div><strong>Photos:</strong> 62</div>
            <div><strong>Videos:</strong> 23</div>
            <div><strong>Songs:</strong> 18</div>
            <div><strong>Documents:</strong> 8</div>
            <div><strong>Stories:</strong> 32</div>
          </div>
        </div>

      </div>

      {/* PENDING REVIEW */}
      <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", marginTop: "30px" }}>
        <h2 style={{ fontSize: "1.2rem", color: "var(--secondary)", marginBottom: "15px", borderBottom: "1px solid var(--border)", paddingBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          PENDING REVIEW
          <div>
            <button style={{ padding: "5px 10px", background: "var(--primary)", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "0.85rem", marginRight: "10px" }}>[Approve All]</button>
            <button style={{ padding: "5px 10px", background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "5px", cursor: "pointer", fontSize: "0.85rem" }}>[Review Queue]</button>
          </div>
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--foreground)" }}>
          <li style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "5px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" /> <strong>Interview: Village Elder</strong> <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>(Added Mar 18)</span> - <span style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "0.85rem" }}>Awaiting Label Review</span>
          </li>
          <li style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "5px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" /> <strong>Photo Set: Harvest Festival 2025</strong> <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>(Added Mar 17)</span> - <span style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "0.85rem" }}>Awaiting Pending Review</span>
          </li>
          <li style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "5px", display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" /> <strong>Song Recording: Traditional Wedding Song</strong> <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>(Added Mar 16)</span> - <span style={{ color: "var(--accent)", fontWeight: "bold", fontSize: "0.85rem" }}>Awaiting Pending Review</span>
          </li>
        </ul>
      </div>

    </div>
  );
}

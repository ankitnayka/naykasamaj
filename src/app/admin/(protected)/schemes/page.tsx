import connectDB from "@/lib/db";
import Scheme from "@/models/Scheme";
import SchemeForm from "./SchemeForm";

export default async function ManageSchemes() {
  await connectDB();
  const schemes = await Scheme.find().sort({ createdAt: -1 });

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Opportunity Desk: Schemes & Grants</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)", maxWidth: "800px" }}>
        Manage government subsidies, educational scholarships, and NGO grants. Once added here, they will instantly appear in the public Scheme Finder tool.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        
        {/* Left Col: Setup Form */}
        <div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>Add New Scheme</h2>
          <SchemeForm />
        </div>

        {/* Right Col: Existing Schemes */}
        <div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>Active Schemes Database</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {schemes.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No schemes exist in the database yet.</p>
            ) : (
              schemes.map((scheme: any) => (
                <div key={scheme._id.toString()} style={{ background: "var(--surface)", padding: "15px", borderRadius: "8px", borderLeft: `4px solid ${scheme.provider === "STATE" ? "#3498db" : scheme.provider === "CENTRAL" ? "#2ecc71" : "#9b59b6"}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "bold", background: "#f1f5f9", padding: "3px 8px", borderRadius: "12px", color: "var(--primary)" }}>
                      {scheme.category}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "bold" }}>
                      {scheme.provider}
                    </span>
                  </div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "1.1rem" }}>{scheme.title}</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: "0 0 10px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {scheme.description}
                  </p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                    <span style={{ fontSize: "0.8rem", color: scheme.deadline && new Date(scheme.deadline) < new Date() ? "#e74c3c" : "var(--foreground)" }}>
                      {scheme.deadline ? `Deadline: ${new Date(scheme.deadline).toLocaleDateString()}` : "No Deadline"}
                    </span>
                    <button style={{ background: "transparent", color: "var(--accent)", border: "none", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline" }}>
                      Manage
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

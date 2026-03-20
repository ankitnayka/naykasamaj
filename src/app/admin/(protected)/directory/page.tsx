import connectDB from "@/lib/db";
import Artisan from "@/models/Artisan";
import MatrimonyProfile from "@/models/MatrimonyProfile";

export default async function DirectoryHub() {
  await connectDB();
  
  // Provide empty arrays if models don't have records yet
  let artisans = [];
  let profiles = [];
  
  try {
    artisans = await Artisan.find().sort({ createdAt: -1 }).limit(10);
    profiles = await MatrimonyProfile.find().sort({ createdAt: -1 }).limit(10);
  } catch (e) {
    console.warn("Error fetching directory data for admin", e);
  }

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Directory & Marketplace Hub</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)" }}>
        Review and Moderate the Adi Haat Artisan profiles and Matrimony listings to ensure quality and safety.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        
        {/* Left Column: Artisans */}
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)", borderBottom: "2px solid var(--accent)", paddingBottom: "10px" }}>Adi Haat Artisans</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {artisans.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No artisans registered.</p>
            ) : (
              artisans.map((art: any) => (
                <div key={art._id.toString()} style={{ border: "1px solid var(--border)", padding: "10px", borderRadius: "6px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{art.name}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "5px" }}>{art.craft} • {art.village}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.8rem", background: art.isVerified ? "#e8f5e9" : "#fff3cd", color: art.isVerified ? "var(--primary)" : "#856404", padding: "2px 8px", borderRadius: "12px" }}>
                      {art.isVerified ? "Verified Artisan" : "Pending Verification"}
                    </span>
                    <button style={{ background: "transparent", color: "var(--accent)", border: "none", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline" }}>View Profile</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Matrimony */}
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)", borderBottom: "2px solid #e74c3c", paddingBottom: "10px" }}>Matrimony Profiles</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {profiles.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No matrimony profiles found.</p>
            ) : (
              profiles.map((prof: any) => (
                <div key={prof._id.toString()} style={{ border: "1px solid var(--border)", padding: "10px", borderRadius: "6px" }}>
                   <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{prof.firstName} {prof.lastName} ({prof.age})</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "5px" }}>{prof.education} • {prof.city}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.8rem", background: prof.isApproved ? "#e8f5e9" : "#fff3cd", color: prof.isApproved ? "var(--primary)" : "#856404", padding: "2px 8px", borderRadius: "12px" }}>
                      {prof.isApproved ? "Approved" : "Needs Review"}
                    </span>
                    <button style={{ background: "transparent", color: "var(--accent)", border: "none", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline" }}>Review Detail</button>
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

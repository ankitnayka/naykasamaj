import connectDB from "@/lib/db";
import MatrimonyProfile from "@/models/MatrimonyProfile";
import MatrimonyActions from "./MatrimonyActions";

export default async function ManageMatrimony() {
  await connectDB();
  
  // Fetch profiles and populate user data
  const pendingProfiles = await MatrimonyProfile.find({ isApproved: false })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  const approvedProfiles = await MatrimonyProfile.find({ isApproved: true })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(50); // Show recent 50

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Matrimony Moderation Hub</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)", maxWidth: "800px" }}>
        Protect the community by reviewing matrimony profiles. New profiles are held here in "Pending Action" and must be explicitly approved before they become visible to verified community members.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>
        
        {/* Pending Approval */}
        <div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)", borderBottom: "2px solid #8e44ad", paddingBottom: "10px" }}>Pending Action ({pendingProfiles.length})</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
            {pendingProfiles.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic", gridColumn: "1/-1" }}>No matrimony profiles are currently pending approval.</p>
            ) : (
              pendingProfiles.map((profile: any) => (
                <div key={profile._id.toString()} style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #8e44ad", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <h4 style={{ margin: "0 0 5px 0", fontSize: "1.2rem" }}>
                        {profile.user?.name || "Unknown User"} 
                        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "normal" }}> ({profile.gender}, {profile.maritalStatus.replace("_", " ")})</span>
                      </h4>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "5px" }}>
                        <strong>Email:</strong> {profile.user?.email}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        <strong>Location:</strong> {profile.location} | <strong>Education:</strong> {profile.education}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem", color: "#334155", margin: "10px 0" }}>
                    <strong>About:</strong> {profile.aboutMe}
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "var(--primary)", marginBottom: "10px" }}>
                    {profile.isPrivacyEnabled ? "🔒 Privacy Enabled (Photos hidden)" : "👁 Public (Photos visible to members)"}
                  </div>
                  
                  <MatrimonyActions profileId={profile._id.toString()} isPending={true} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Approved Profiles */}
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)", borderBottom: "2px solid #2ecc71", paddingBottom: "10px" }}>Currently Approved Profiles ({approvedProfiles.length})</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px" }}>
            {approvedProfiles.length === 0 ? (
              <p style={{ color: "var(--text-muted)", gridColumn: "1/-1" }}>No approved matrimony profiles yet.</p>
            ) : (
              approvedProfiles.map((profile: any) => (
                <div key={profile._id.toString()} style={{ background: "var(--surface)", padding: "15px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <h4 style={{ margin: "0", fontSize: "1rem" }}>{profile.user?.name || "Unknown"}</h4>
                    <span style={{ fontSize: "0.75rem", background: "#e8f5e9", color: "#2e7d32", padding: "2px 8px", borderRadius: "12px", border: "1px solid #c8e6c9", fontWeight: "bold" }}>
                      Approved
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                    {profile.gender} • {profile.location}
                  </div>
                  
                  <MatrimonyActions profileId={profile._id.toString()} isPending={false} />
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

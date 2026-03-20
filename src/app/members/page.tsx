import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/User";

export default async function MembersDirectory(props: { searchParams?: Promise<any> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/members");
  }

  // Only verified members or Admins can view the directory
  if (!session.user.isVerified && session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    return (
      <div style={{ padding: "100px 20px", textAlign: "center", minHeight: "60vh" }}>
        <div style={{ fontSize: "4rem", marginBottom: "20px" }}>⏳</div>
        <h1 style={{ color: "var(--primary)", marginBottom: "15px" }}>Verification Pending</h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto", fontSize: "1.1rem" }}>
          Your account is currently awaiting administrator approval. You must be a verified Nayka Samaj member to access the private Member Directory.
        </p>
      </div>
    );
  }

  await connectDB();
  const searchParams = props.searchParams ? await props.searchParams : {};
  const { q, village, profession } = searchParams;
  
  const query: any = { isVerified: true };
  if (q) {
    query.name = { $regex: q, $options: "i" };
  }
  if (village && village !== "ALL") {
    query.village = village;
  }
  if (profession && profession !== "ALL") {
    query.profession = profession;
  }

  const members = await User.find(query).select("-password").sort({ name: 1 });

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0", background: "var(--background)", minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        
        <form method="GET" action="/members" style={{ background: "var(--surface)", padding: "20px", borderRadius: "12px", boxShadow: "var(--shadow-sm)", marginBottom: "40px", border: "1px solid var(--border)" }}>
          <h1 style={{ fontSize: "2rem", color: "var(--primary)", marginBottom: "10px" }}>Member Directory</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "25px" }}>Connect with {members.length} verified community members globally.</p>
          
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
            <input 
              type="text" 
              name="q"
              defaultValue={q}
              placeholder="Search by name..." 
              style={{ flex: 1, minWidth: "200px", padding: "10px 15px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
            />
            
            <select name="village" defaultValue={village || "ALL"} style={{ padding: "10px 15px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}>
              <option value="ALL">All Villages/Cities</option>
              <option value="Surat">Surat</option>
              <option value="Valsad">Valsad</option>
              <option value="Dang">Dang</option>
              <option value="Navsari">Navsari</option>
              <option value="Mumbai">Mumbai</option>
            </select>

            <select name="profession" defaultValue={profession || "ALL"} style={{ padding: "10px 15px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}>
              <option value="ALL">All Professions</option>
              <option value="Farming">Farming</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Technology">Technology</option>
            </select>
            
            <button type="submit" className="btn" style={{ padding: "10px 20px" }}>Search</button>
            <a href="/members" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem", padding: "10px" }}>Clear</a>
          </div>
        </form>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
          {members.length === 0 ? (
            <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "40px", color: "var(--text-muted)" }}>
              No members found matching your search criteria.
            </div>
          ) : (
            members.map((member) => (
              <div key={member._id.toString()} style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: "25px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: "15px", alignItems: "flex-start", marginBottom: "15px" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold", overflow: "hidden" }}>
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      member.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1.2rem", color: "var(--secondary)" }}>{member.name}</h3>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", fontSize: "0.8rem" }}>
                      <span style={{ background: "var(--primary)", color: "white", padding: "2px 8px", borderRadius: "10px" }}>
                        {member.role === "ADMIN" ? "Admin" : member.role === "MODERATOR" ? "Moderator" : "Member"}
                      </span>
                      {member.profession && (
                        <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "2px 8px", borderRadius: "10px", border: "1px solid #c8e6c9" }}>
                          {member.profession}
                        </span>
                      )}
                      {member.village && (
                        <span style={{ background: "#fff3e0", color: "#e65100", padding: "2px 8px", borderRadius: "10px", border: "1px solid #ffe0b2" }}>
                          📍 {member.village}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {member.bio && (
                  <p style={{ fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "15px", lineHeight: "1.5" }}>
                    "{member.bio}"
                  </p>
                )}

                <div style={{ display: "flex", gap: "10px", borderTop: "1px solid var(--border)", paddingTop: "15px" }}>
                  <button style={{ flex: 1, background: "transparent", border: "1px solid var(--primary)", color: "var(--primary)", borderRadius: "4px", padding: "6px", cursor: "pointer", fontSize: "0.9rem", transition: "0.2s" }} title="Messaging system coming soon">
                    Message
                  </button>
                  <button style={{ flex: 1, background: "transparent", border: "1px solid var(--text-muted)", color: "var(--text-muted)", borderRadius: "4px", padding: "6px", cursor: "pointer", fontSize: "0.9rem" }}>
                    View Profile
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

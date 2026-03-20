import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Article from "@/models/Article";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  await connectDB();
  const totalUsers = await User.countDocuments();
  const pendingUsers = await User.countDocuments({ isVerified: false });
  const totalArticles = await Article.countDocuments();

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "30px", color: "var(--primary)" }}>Dashboard Overview</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)" }}>
        Welcome back, <strong>{session?.user.name}</strong>. Here is the current status of the Project Setu portal.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        {/* Stat Card 1 */}
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", borderLeft: "4px solid var(--primary)" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold", marginBottom: "10px" }}>Total Members</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--foreground)" }}>{totalUsers}</div>
        </div>

        {/* Stat Card 2 */}
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", borderLeft: "4px solid var(--accent)" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold", marginBottom: "10px" }}>Pending Verifications</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--foreground)" }}>{pendingUsers}</div>
        </div>

        {/* Stat Card 3 */}
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", borderLeft: "4px solid #3498db" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold", marginBottom: "10px" }}>Published Announcements</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--foreground)" }}>{totalArticles}</div>
        </div>
      </div>
      
      <div style={{ marginTop: "40px", background: "var(--surface)", padding: "20px", borderRadius: "8px" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "20px", color: "var(--secondary)", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>Recent Activity</h2>
        <p style={{ color: "var(--text-muted)" }}>Activity logs will appear here soon.</p>
      </div>
    </div>
  );
}

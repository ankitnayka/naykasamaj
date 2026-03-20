import connectDB from "@/lib/db";
import User from "@/models/User";
import UserActions from "./UserActions";

export default async function UserManagement() {
  await connectDB();
  
  // Fetch pending users first
  const pendingUsers = await User.find({ isVerified: false }).sort({ createdAt: -1 });
  const verifiedUsers = await User.find({ isVerified: true }).sort({ createdAt: -1 }).limit(10); // Limit just for UI demo

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px", color: "var(--primary)" }}>User Verification & Management</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)" }}>
        Review and approve new member registrations. Unverified members cannot access the Private Member Hub.
      </p>

      {/* Pending Verifications */}
      <div style={{ background: "var(--surface)", borderRadius: "8px", overflow: "hidden", marginBottom: "40px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
        <div style={{ background: "#fff3cd", color: "#856404", padding: "15px 20px", fontWeight: "bold", borderBottom: "1px solid #ffeeba" }}>
          Pending Approvals ({pendingUsers.length})
        </div>
        <div style={{ padding: "20px" }}>
          {pendingUsers.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", fontStyle: "italic" }}>No pending users waiting for approval.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th style={{ padding: "10px", color: "var(--text-muted)", fontWeight: "600" }}>Name</th>
                  <th style={{ padding: "10px", color: "var(--text-muted)", fontWeight: "600" }}>Email</th>
                  <th style={{ padding: "10px", color: "var(--text-muted)", fontWeight: "600" }}>Registered</th>
                  <th style={{ padding: "10px", color: "var(--text-muted)", fontWeight: "600", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user: any) => (
                  <tr key={user._id.toString()} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 10px", fontWeight: "500" }}>{user.name}</td>
                    <td style={{ padding: "12px 10px", color: "var(--text-muted)" }}>{user.email}</td>
                    <td style={{ padding: "12px 10px", color: "var(--text-muted)" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      <UserActions userId={user._id.toString()} isPending={true} currentStatus={user.status || "ACTIVE"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Verified Members */}
      <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>Recently Verified Members</h2>
      <div style={{ background: "var(--surface)", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
         <div style={{ padding: "20px" }}>
          {verifiedUsers.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No verified members yet.</p>
          ) : (
             <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
             <thead>
               <tr style={{ borderBottom: "2px solid var(--border)" }}>
                 <th style={{ padding: "10px", color: "var(--text-muted)", fontWeight: "600" }}>Name</th>
                 <th style={{ padding: "10px", color: "var(--text-muted)", fontWeight: "600" }}>Email</th>
                 <th style={{ padding: "10px", color: "var(--text-muted)", fontWeight: "600" }}>Role</th>
                 <th style={{ padding: "10px", color: "var(--text-muted)", fontWeight: "600", textAlign: "right" }}>Actions</th>
               </tr>
             </thead>
             <tbody>
               {verifiedUsers.map((user: any) => (
                 <tr key={user._id.toString()} style={{ borderBottom: "1px solid var(--border)" }}>
                   <td style={{ padding: "12px 10px", fontWeight: "500" }}>{user.name}</td>
                   <td style={{ padding: "12px 10px", color: "var(--text-muted)" }}>{user.email}</td>
                   <td style={{ padding: "12px 10px" }}><span style={{ background: "#e8f5e9", color: "var(--primary)", padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold" }}>{user.role}</span></td>
                   <td style={{ padding: "12px 10px", textAlign: "right" }}>
                     <UserActions userId={user._id.toString()} isPending={false} currentStatus={user.status || "ACTIVE"} />
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
          )}
        </div>
      </div>
    </div>
  );
}

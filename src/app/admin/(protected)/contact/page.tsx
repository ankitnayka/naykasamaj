import connectDB from "@/lib/db";
import Message from "@/models/Message";
import ResolveButton from "./ResolveButton";

export default async function ManageContact() {
  await connectDB();
  const pendingMessages = await Message.find({ isResolved: false }).sort({ createdAt: 1 });
  const resolvedMessages = await Message.find({ isResolved: true }).sort({ updatedAt: -1 }).limit(10);

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Inquiries & Support Inbox</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)", maxWidth: "800px" }}>
        Review messages, questions, and support requests sent directly from the public Contact page.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px", maxWidth: "900px" }}>
        
        <div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)", borderBottom: "2px solid #e74c3c", paddingBottom: "10px" }}>Pending Action ({pendingMessages.length})</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {pendingMessages.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Inbox zero! All messages have been resolved.</p>
            ) : (
              pendingMessages.map((msg: any) => (
                <div key={msg._id.toString()} style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #e74c3c", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <h4 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>{msg.subject}</h4>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        <strong>From:</strong> {msg.name} ({msg.email}) {msg.phone ? `| ${msg.phone}` : ""}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.95rem", color: "#334155", whiteSpace: "pre-wrap", marginBottom: "15px" }}>
                    {msg.body}
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <ResolveButton messageId={msg._id.toString()} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--text-muted)", borderBottom: "2px solid var(--border)", paddingBottom: "10px" }}>Recently Resolved</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px" }}>
            {resolvedMessages.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No resolved messages yet.</p>
            ) : (
              resolvedMessages.map((msg: any) => (
                <div key={msg._id.toString()} style={{ background: "var(--surface)", padding: "15px", borderRadius: "6px", border: "1px solid var(--border)", opacity: 0.8 }}>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "0.95rem" }}>{msg.subject}</h4>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "5px" }}>From: {msg.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "bold" }}>
                    ✓ Resolved on {new Date(msg.updatedAt).toLocaleDateString()}
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

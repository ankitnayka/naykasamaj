import connectDB from "@/lib/db";
import Media from "@/models/Media";
import MediaUploadForm from "./MediaUploadForm";

export default async function MediaArchive() {
  await connectDB();
  const mediaItems = await Media.find().sort({ createdAt: -1 });

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Digital Heritage Archive</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)", maxWidth: "800px" }}>
        Manage the Nayaka digital footprint. Upload new photos, oral histories, and videos to the Cloudinary vault. Protect culturally sensitive records using the Traditional Knowledge (TK) label.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" }}>
        {/* Left Col: Upload Form */}
        <div>
          <MediaUploadForm />
        </div>

        {/* Right Col: Media Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", alignContent: "start" }}>
          {mediaItems.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No media uploaded to the archive yet.</p>
          ) : (
            mediaItems.map((item: any) => (
              <div key={item._id.toString()} style={{ background: "var(--surface)", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                {item.type === "PHOTO" ? (
                  <div style={{ height: "140px", backgroundImage: `url(${item.url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                ) : (
                  <div style={{ height: "140px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                    {item.type === "VIDEO" ? "🎥" : "🎵"}
                  </div>
                )}
                <div style={{ padding: "15px" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "bold", marginBottom: "5px", textTransform: "uppercase" }}>
                    {item.category}
                  </div>
                  <h3 style={{ fontSize: "1rem", margin: "0 0 10px 0", color: "var(--secondary)" }}>{item.title}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.isSensitiveTK && (
                      <span title="Sensitive Traditional Knowledge" style={{ background: "#e74c3c", color: "white", padding: "2px 6px", borderRadius: "12px", fontSize: "0.6rem", fontWeight: "bold" }}>TK</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

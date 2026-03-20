import connectDB from "@/lib/db";
import Artisan from "@/models/Artisan";
import Product from "@/models/Product";
import ArtisanActions from "./ArtisanActions";

export default async function ManageAdiHaat() {
  await connectDB();
  
  // Fetch artisans
  const pendingArtisans = await Artisan.find({ isVerified: false }).sort({ createdAt: -1 });
  const verifiedArtisans = await Artisan.find({ isVerified: true }).sort({ createdAt: -1 });

  // Get product counts for all artisans
  const productCounts = await Product.aggregate([
    { $group: { _id: "$artisanId", count: { $sum: 1 } } }
  ]);
  const productCountMap = new Map(productCounts.map(p => [p._id.toString(), p.count]));

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Adi Haat: Marketplace Moderation</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)", maxWidth: "800px" }}>
        Review and verify community artisans before their storefronts go live on the public Adi Haat marketplace. You can also permanently remove fraudulent profiles and their associated products.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>
        
        {/* Pending Approval */}
        <div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)", borderBottom: "2px solid #e74c3c", paddingBottom: "10px" }}>Pending Artisan Verifications ({pendingArtisans.length})</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {pendingArtisans.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No artisans are currently waiting for verification.</p>
            ) : (
              pendingArtisans.map((artisan: any) => (
                <div key={artisan._id.toString()} style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #e74c3c", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <h4 style={{ margin: "0 0 5px 0", fontSize: "1.2rem" }}>{artisan.name}</h4>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "5px" }}>
                        <strong>Craft:</strong> {artisan.craftType} | <strong>Location:</strong> {artisan.location}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        <strong>Contact:</strong> {artisan.contactEmail} {artisan.contactPhone && `| ${artisan.contactPhone}`}
                      </div>
                    </div>
                    <div>
                       <ArtisanActions artisanId={artisan._id.toString()} isPending={true} />
                    </div>
                  </div>
                  
                  <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.95rem", color: "#334155" }}>
                    <strong>Bio:</strong> {artisan.bio}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Verified Artisans */}
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)", borderBottom: "2px solid #2ecc71", paddingBottom: "10px" }}>Live Verified Storefronts ({verifiedArtisans.length})</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {verifiedArtisans.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No verified artisans yet.</p>
            ) : (
              verifiedArtisans.map((artisan: any) => (
                <div key={artisan._id.toString()} style={{ background: "var(--surface)", padding: "15px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <h4 style={{ margin: "0", fontSize: "1.1rem" }}>{artisan.name}</h4>
                    <span style={{ fontSize: "0.75rem", background: "#e8f5e9", color: "#2e7d32", padding: "2px 8px", borderRadius: "12px", border: "1px solid #c8e6c9", fontWeight: "bold" }}>
                      Public
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "12px" }}>{artisan.craftType} • {artisan.location}</div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                    <div style={{ fontSize: "0.80rem", color: "var(--primary)", fontWeight: "bold" }}>
                      {productCountMap.get(artisan._id.toString()) || 0} Products Listed
                    </div>
                    <ArtisanActions artisanId={artisan._id.toString()} isPending={false} />
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

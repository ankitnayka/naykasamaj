import connectDB from "@/lib/db";
import Artisan from "@/models/Artisan";
import Product from "@/models/Product";
import SuccessStory from "@/models/SuccessStory";
import Link from "next/link";
import ArtisanActions from "./ArtisanActions";

export default async function ManageAdiHaat() {
  await connectDB();
  
  // Quick stats
  const artisanCount = await Artisan.countDocuments();
  const productCount = await Product.countDocuments();
  const storyCount = await SuccessStory.countDocuments();
  const pendingArtisansCount = await Artisan.countDocuments({ isVerified: false });

  const navItemStyle = {
    padding: "20px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    textDecoration: "none",
    color: "var(--foreground)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "var(--transition)",
    boxShadow: "var(--shadow-sm)"
  } as React.CSSProperties;

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Adi Haat: Marketplace Management</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)", maxWidth: "800px" }}>
        Oversee the entire Adi Haat ecosystem. Manage artisans, products, and community success stories.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <Link href="/admin/adi-haat/artisans" style={navItemStyle}>
          <div style={{ fontSize: "1.5rem" }}>🎨</div>
          <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Artisan Directory</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{artisanCount} Total ({pendingArtisansCount} Pending)</div>
        </Link>
        <Link href="/admin/adi-haat/products" style={navItemStyle}>
          <div style={{ fontSize: "1.5rem" }}>🏺</div>
          <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Product Catalog</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{productCount} Products Listed</div>
        </Link>
        <Link href="/admin/adi-haat/success-stories" style={navItemStyle}>
          <div style={{ fontSize: "1.5rem" }}>📜</div>
          <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Success Stories</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{storyCount} Stories Published</div>
        </Link>
      </div>

      <div style={{ background: "rgba(242, 101, 34, 0.05)", padding: "20px", borderRadius: "12px", border: "1px dashed var(--primary)" }}>
         <h4 style={{ color: "var(--primary)", margin: "0 0 10px 0" }}>Moderation Tip</h4>
         <p style={{ fontSize: "0.9rem", margin: 0, color: "var(--text-muted)" }}>
           Always verify an artisan's location and contact details before approving their profile. Verified artisans can list products that appear in the public marketplace.
         </p>
      </div>
    </div>
  );
}

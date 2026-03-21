"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
}

interface Artisan {
  _id: string;
  name: string;
  bio: string;
  craftType: string;
  location: string;
  contactEmail: string;
  contactPhone?: string;
  imageUrl?: string;
}

export default function ArtisanPortfolioPage() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisanData = async () => {
      try {
        const artisanRes = await fetch(`/api/artisans/${id}`);
        if (artisanRes.ok) {
          const data = await artisanRes.json();
          setArtisan(data);
          
          // Fetch products by this artisan
          const prodRes = await fetch("/api/products");
          if (prodRes.ok) {
            const allProducts: any[] = await prodRes.json();
            setProducts(allProducts.filter(p => p.artisanId?._id === id));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchArtisanData();
  }, [id]);

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading artisan portfolio...</div>;
  if (!artisan) return <div style={{ padding: "100px", textAlign: "center" }}>Artisan not found. <Link href="/adi-haat">Back to Adi Haat</Link></div>;

  return (
    <div style={{ padding: "40px 0", background: "var(--background)", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "1100px" }}>
        
        <div style={{ marginBottom: "30px" }}>
          <Link href="/adi-haat" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "5px" }}>
            ← Back to Marketplace
          </Link>
        </div>

        {/* Artisan Profile Header */}
        <div style={{ position: "relative", background: "var(--surface)", borderRadius: "20px", padding: "40px", marginBottom: "50px", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
          <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: "220px", height: "220px", borderRadius: "20px", border: "4px solid var(--primary)", overflow: "hidden", background: "#f0f0f0" }}>
              {artisan.imageUrl ? (
                <img src={artisan.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={artisan.name} />
              ) : (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>🎨</div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: "300px" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Premium Artisan Portfolio</div>
              <h1 style={{ fontSize: "3rem", margin: "10px 0 15px 0", color: "var(--secondary)" }}>{artisan.name}</h1>
              <div style={{ display: "flex", gap: "20px", marginBottom: "25px", fontSize: "1rem", color: "var(--text-muted)" }}>
                <span>📍 {artisan.location}</span>
                <span>🎨 {artisan.craftType}</span>
                {artisan.contactPhone && <span>📞 {artisan.contactPhone}</span>}
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "10px" }}>Biography & Heritage</h3>
                <p style={{ lineHeight: "1.7", color: "var(--foreground)", fontSize: "1.05rem" }}>{artisan.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Artisan's Products Grid */}
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "30px", borderLeft: "5px solid var(--primary)", paddingLeft: "15px" }}>Featured Creations by {artisan.name}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "25px" }}>
            {products.map((product) => (
              <div key={product._id} className="glass" style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)" }}>
                <div style={{ height: "180px", background: "#f0f0f0" }}>
                  <img src={product.images?.[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={product.name} />
                </div>
                <div style={{ padding: "15px" }}>
                  <div style={{ fontSize: "0.65rem", color: "var(--primary)", fontWeight: "bold", textTransform: "uppercase" }}>{product.category}</div>
                  <h3 style={{ margin: "5px 0", fontSize: "1.1rem" }}>{product.name}</h3>
                  <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--primary)", marginBottom: "12px" }}>₹{product.price}</div>
                  <Link href={`/adi-haat/product/${product._id}`} className="btn" style={{ display: "block", textAlign: "center", padding: "8px", fontSize: "0.8rem", textDecoration: "none" }}>View Story</Link>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", gridColumn: "1 / -1", border: "1px dashed var(--border)", borderRadius: "15px" }}>
                No products found for this artisan.
              </div>
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <div style={{ background: "var(--surface)", borderRadius: "15px", padding: "40px", textAlign: "center", border: "1px solid var(--border)" }}>
           <h3 style={{ marginBottom: "15px" }}>Interested in a custom creation?</h3>
           <p style={{ color: "var(--text-muted)", marginBottom: "25px", maxWidth: "600px", margin: "0 auto 25px auto" }}>
             Every piece by {artisan.name} is a testament to tribal heritage. You can reach out directly for custom orders or bulk inquiries.
           </p>
           <a href={`mailto:${artisan.contactEmail}`} className="btn" style={{ padding: "12px 30px", textDecoration: "none" }}>Contact via Email</a>
        </div>

      </div>
    </div>
  );
}

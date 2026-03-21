"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  artisanId: {
    _id: string;
    name: string;
    bio: string;
    craftType: string;
    location: string;
    contactPhone?: string;
    imageUrl?: string;
  };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) setProduct(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading product...</div>;
  if (!product) return <div style={{ padding: "100px", textAlign: "center" }}>Product not found. <Link href="/adi-haat">Back to Adi Haat</Link></div>;

  return (
    <div style={{ padding: "40px 0", background: "var(--background)", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "1100px" }}>
        
        <div style={{ marginBottom: "30px" }}>
          <Link href="/adi-haat" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "5px" }}>
            ← Back to Marketplace
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "50px", marginBottom: "60px" }}>
          {/* Product Media */}
          <div>
            <div style={{ borderRadius: "20px", overflow: "hidden", background: "#f5f5f5", marginBottom: "15px", boxShadow: "var(--shadow-md)", height: "500px" }}>
              {product.images?.[activeImage] ? (
                <img src={product.images[activeImage]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={product.name} />
              ) : (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>🏺</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {product.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    style={{ 
                      width: "80px", 
                      height: "80px", 
                      borderRadius: "10px", 
                      overflow: "hidden", 
                      border: activeImage === i ? "2px solid var(--primary)" : "1px solid var(--border)",
                      padding: "2px",
                      cursor: "pointer",
                      background: "white"
                    }}
                  >
                    <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px" }}>{product.category}</div>
            <h1 style={{ fontSize: "2.8rem", color: "var(--secondary)", marginBottom: "15px", lineHeight: "1.1" }}>{product.name}</h1>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "var(--primary)", marginBottom: "25px" }}>₹{product.price}</div>
            
            <div style={{ padding: "25px", background: "var(--surface)", borderRadius: "15px", border: "1px solid var(--border)", marginBottom: "30px" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Product Description</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "1.05rem" }}>{product.description}</p>
            </div>

            {/* Artisan Spotlight */}
            <div style={{ padding: "25px", background: "linear-gradient(135deg, var(--surface) 0%, #fff9f0 100%)", borderRadius: "15px", border: "2px solid #ffefe0", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--primary)", flexShrink: 0, overflow: "hidden" }}>
                {product.artisanId?.imageUrl ? (
                  <img src={product.artisanId.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={product.artisanId.name} />
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "2rem" }}>{product.artisanId?.name?.[0]}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "bold", textTransform: "uppercase" }}>Meet the Artisan</div>
                <h4 style={{ margin: "2px 0 5px 0", fontSize: "1.2rem" }}>{product.artisanId?.name}</h4>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>📍 {product.artisanId?.location} • 🎨 {product.artisanId?.craftType}</div>
                <Link href={`/adi-haat/artisan/${product.artisanId?._id}`} style={{ display: "inline-block", marginTop: "10px", fontSize: "0.85rem", fontWeight: "bold", color: "var(--primary)", textDecoration: "none" }}>View Artisan Profile →</Link>
              </div>
            </div>

            <div style={{ marginTop: "40px", display: "flex", gap: "15px" }}>
              <button className="btn" style={{ flex: 1, padding: "15px" }}>Buy Now</button>
              <button className="btn-secondary" style={{ flex: 1, padding: "15px" }}>Add to Inquiry</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

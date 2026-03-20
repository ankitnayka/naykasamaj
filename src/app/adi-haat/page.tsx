"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  artisanId: { _id: string; name: string; location: string };
  images: string[];
}

export default function AdiHaat() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("PRODUCTS");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = filter !== "ALL" ? `?category=${filter}` : "";
        const res = await fetch(`/api/products${query}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProducts();
  }, [filter]);

  const mockProducts: Product[] = [
    {
      _id: "p1",
      name: "Handwoven Bamboo Basket",
      price: 450,
      category: "HANDICRAFTS",
      artisanId: { _id: "a1", name: "Ramesh Nayka", location: "Dang" },
      images: []
    },
    {
      _id: "p2",
      name: "Traditional Warli Painting",
      price: 1200,
      category: "ART",
      artisanId: { _id: "a2", name: "Sita Devi", location: "Surat" },
      images: []
    },
    {
      _id: "p3",
      name: "Organic Honey",
      price: 300,
      category: "FOOD",
      artisanId: { _id: "a3", name: "Kisan Cooperative", location: "Valsad" },
      images: []
    }
  ];

  const mockArtisans = [
    { _id: "a1", name: "Ramesh Nayka", location: "Dang", craft: "Bamboo Weaving", bio: "Weaving sustainable household items for over 20 years.", contact: "+91 9876543210" },
    { _id: "a2", name: "Sita Devi", location: "Surat", craft: "Warli Painting", bio: "Bringing traditional tribal art to modern canvases.", contact: "+91 9876543211" },
    { _id: "a3", name: "Kisan Cooperative", location: "Valsad", craft: "Organic Farming", bio: "A collective of 15 farmers producing pure forest honey.", contact: "+91 9876543212" }
  ];

  const mockStories = [
    { _id: "s1", title: "From Forest to Global Markets", artisanName: "Sita Devi", content: "Sita's Warli paintings, once only adorning her village walls, are now being shipped internationally thanks to the Setu Adi Haat platform..." },
    { _id: "s2", title: "Reviving Ancient Weaves", artisanName: "Ramesh Nayka", content: "By teaching the younger generation, Ramesh is ensuring that the centuries-old bamboo craft of the Dang region survives and thrives." }
  ];

  const categories = ["ALL", "HANDICRAFTS", "TEXTILES", "FOOD", "ART"];
  const displayProducts = products.length > 0 ? products : (filter === "ALL" ? mockProducts : mockProducts.filter(p => p.category === filter));

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0", background: "var(--background)" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* Header section */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "3rem", color: "var(--primary)", marginBottom: "15px" }}>Adi Haat</h1>
          <p style={{ fontSize: "1.2rem", color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
            The official Nayka Samaj Marketplace. Support local artisans and discover authentic traditional crafts, textiles, and organic products.
          </p>
        </div>

        {/* Top Navigation Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "40px" }}>
          {["PRODUCTS", "ARTISANS", "STORIES"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 25px",
                borderRadius: "30px",
                border: "none",
                background: activeTab === tab ? "var(--primary)" : "var(--surface)",
                color: activeTab === tab ? "white" : "var(--foreground)",
                fontWeight: activeTab === tab ? "bold" : "normal",
                boxShadow: "var(--shadow-sm)",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              {tab === "STORIES" ? "Success Stories" : tab === "ARTISANS" ? "Artisan Directory" : "Products"}
            </button>
          ))}
        </div>

        {activeTab === "PRODUCTS" && (
          <>
            {/* Filter */}
            <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "8px 20px",
                borderRadius: "30px",
                border: "none",
                background: filter === cat ? "var(--primary)" : "var(--surface)",
                color: filter === cat ? "white" : "var(--foreground)",
                boxShadow: "var(--shadow-sm)",
                cursor: "pointer",
                fontWeight: filter === cat ? "bold" : "normal",
                transition: "all 0.3s"
              }}
            >
              {cat === "ALL" ? "All Products" : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "30px" 
        }}>
          {displayProducts.map((product) => (
            <div key={product._id} style={{
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
              transition: "transform 0.3s",
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ height: "200px", background: "#eaeaea", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <span style={{ fontSize: "3rem" }}>
                  {product.category === "HANDICRAFTS" ? "🧺" : product.category === "ART" ? "🖼️" : product.category === "FOOD" ? "🍯" : "🧶"}
                </span>
              </div>
              <div style={{ padding: "20px" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: "bold", marginBottom: "5px" }}>
                  {product.category}
                </div>
                <h3 style={{ margin: "0 0 10px 0", color: "var(--secondary)", fontSize: "1.3rem" }}>{product.name}</h3>
                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "15px" }}>
                  By <strong>{product.artisanId.name}</strong> • {product.artisanId.location}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--primary)" }}>₹{product.price}</span>
                  <button className="btn" style={{ padding: "6px 15px", fontSize: "0.9rem" }}>Contact Artisan</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

        {activeTab === "ARTISANS" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
            {mockArtisans.map((art) => (
              <div key={art._id} style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: "25px", boxShadow: "var(--shadow-sm)", borderLeft: "4px solid var(--accent)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold" }}>
                    {art.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1.3rem", color: "var(--secondary)" }}>{art.name}</h3>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: "10px" }}>
                      <span>📍 {art.location}</span>
                      <span>🛠️ {art.craft}</span>
                    </div>
                  </div>
                </div>
                <p style={{ color: "var(--foreground)", fontSize: "0.95rem", marginBottom: "20px", lineHeight: "1.5" }}>{art.bio}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "15px" }}>
                  <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "500" }}>📞 {art.contact}</span>
                  <button className="btn" style={{ padding: "6px 15px", fontSize: "0.85rem" }}>Message</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "STORIES" && (
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "30px" }}>
            {mockStories.map(story => (
              <div key={story._id} style={{ background: "var(--surface)", borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
                <div style={{ height: "150px", background: "linear-gradient(135deg, var(--primary), var(--accent))", display: "flex", alignItems: "flex-end", padding: "20px" }}>
                  <span style={{ background: "white", color: "var(--primary)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>
                    Artisan Spotlight: {story.artisanName}
                  </span>
                </div>
                <div style={{ padding: "30px" }}>
                  <h2 style={{ fontSize: "1.8rem", color: "var(--secondary)", margin: "0 0 15px 0" }}>{story.title}</h2>
                  <p style={{ color: "var(--foreground)", fontSize: "1.05rem", lineHeight: "1.7" }}>{story.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

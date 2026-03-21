"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  artisanId: { _id: string; name: string; location: string };
  images: string[];
}

interface Artisan {
  _id: string;
  name: string;
  location: string;
  craftType: string;
  bio: string;
  contactPhone?: string;
  imageUrl?: string;
}

interface SuccessStory {
  _id: string;
  title: string;
  artisanName: string;
  story: string;
  images: string[];
  craftType: string;
  location: string;
}

export default function AdiHaat() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);

  const [activeTab, setActiveTab] = useState("PRODUCTS");
  const [filters, setFilters] = useState({
    category: "ALL",
    location: "ALL"
  });

  const [dynamicFilters, setDynamicFilters] = useState({
    categories: ["ALL"],
    locations: ["ALL"]
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch("/api/adi-haat/filters");
        if (res.ok) setDynamicFilters(await res.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "PRODUCTS") {
          const params = new URLSearchParams();
          if (filters.category !== "ALL") params.append("category", filters.category);
          if (filters.location !== "ALL") params.append("location", filters.location);
          const res = await fetch(`/api/products?${params.toString()}`);
          if (res.ok) setProducts(await res.json());
        } else if (activeTab === "ARTISANS") {
          const params = new URLSearchParams();
          if (filters.location !== "ALL") params.append("location", filters.location);
          const res = await fetch(`/api/artisans?${params.toString()}`);
          if (res.ok) setArtisans(await res.json());
        } else if (activeTab === "STORIES") {
          const res = await fetch(`/api/success-stories`);
          if (res.ok) setStories(await res.json());
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [activeTab, filters]);

  return (
    <div className="animate-fade-in" style={{ padding: "20px 0", background: "var(--background)", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* Header - Minimalist */}
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <h1 style={{ fontSize: "1.2rem", color: "var(--primary)", marginBottom: "2px" }}>Adi Haat</h1>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0" }}>
            The Premium Tribal Marketplace of the Nayka Community.
          </p>
        </div>

        {/* Tabs & Filters - Ultra Compact */}
        <div style={{ background: "var(--surface)", padding: "8px 15px", borderRadius: "10px", boxShadow: "var(--shadow-sm)", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>

            <div style={{ display: "flex", gap: "4px", background: "rgba(0,0,0,0.05)", padding: "3px", borderRadius: "30px" }}>
              {[
                { id: "PRODUCTS", label: "Market", icon: "🏺" },
                { id: "ARTISANS", label: "Artisans", icon: "🎨" },
                { id: "STORIES", label: "Stories", icon: "📜" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "30px",
                    border: "none",
                    background: activeTab === tab.id ? "var(--primary)" : "transparent",
                    color: activeTab === tab.id ? "white" : "var(--foreground)",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {activeTab === "PRODUCTS" && (
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <label style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>category:</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    style={{ padding: "4px 8px", borderRadius: "5px", border: "1px solid var(--border)", fontSize: "0.75rem", outline: "none" }}
                  >
                    {dynamicFilters.categories.map(cat => <option key={cat} value={cat}>{cat === "ALL" ? "All" : cat}</option>)}
                  </select>
                </div>
              )}
              {(activeTab === "ARTISANS" || activeTab === "PRODUCTS") && (
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <label style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Location:</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    style={{ padding: "4px 8px", borderRadius: "5px", border: "1px solid var(--border)", fontSize: "0.75rem", outline: "none" }}
                  >
                    {dynamicFilters.locations.map(loc => <option key={loc} value={loc}>{loc === "ALL" ? "All" : loc}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div>
          {activeTab === "PRODUCTS" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "15px" }}>
              {products.map((product) => (
                <div key={product._id} style={{ background: "var(--surface)", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)", transition: "transform 0.2s" }}>
                  <div style={{ height: "160px", background: "#f0f0f0" }}>
                    {product.images?.[0] ? (
                      <img src={product.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={product.name} />
                    ) : (
                      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>🏺</div>
                    )}
                  </div>
                  <div style={{ padding: "12px" }}>
                    <div style={{ fontSize: "0.6rem", color: "var(--primary)", fontWeight: "bold", textTransform: "uppercase", marginBottom: "3px" }}>{product.category}</div>
                    <h3 style={{ margin: "0 0 5px 0", color: "var(--secondary)", fontSize: "1rem" }}>{product.name}</h3>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                      By {product.artisanId?.name} • {product.artisanId?.location}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--primary)" }}>₹{product.price}</span>
                      <Link href={`/adi-haat/product/${product._id}`} className="btn" style={{ padding: "5px 10px", fontSize: "0.7rem", textDecoration: "none" }}>Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "ARTISANS" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "15px" }}>
              {artisans.map((artisan) => (
                <div key={artisan._id} style={{ background: "var(--surface)", borderRadius: "10px", padding: "15px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {artisan.imageUrl ? (
                      <img src={artisan.imageUrl} style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }} alt={artisan.name} />
                    ) : (
                      <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1rem" }}>{artisan.name[0]}</div>
                    )}
                    <div>
                      <h4 style={{ margin: 0, fontSize: "0.95rem" }}>{artisan.name}</h4>
                      <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "bold" }}>{artisan.craftType}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>📍 {artisan.location}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--foreground)", lineHeight: "1.4", margin: "0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{artisan.bio}</p>
                  <Link href={`/adi-haat/artisan/${artisan._id}`} className="btn" style={{ width: "100%", padding: "6px", fontSize: "0.75rem", marginTop: "auto", display: "block", textAlign: "center", textDecoration: "none" }}>Portfolio</Link>
                </div>
              ))}
            </div>
          )}

          {activeTab === "STORIES" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {stories.map(story => (
                <div key={story._id} style={{ background: "var(--surface)", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid var(--border)" }}>
                  <div style={{ height: "150px" }}>
                    {story.images?.[0] ? (
                      <img src={story.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={story.title} />
                    ) : (
                      <div style={{ height: "100%", background: "var(--primary)", opacity: 0.1 }}></div>
                    )}
                  </div>
                  <div style={{ padding: "15px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "0.6rem", textTransform: "uppercase", marginBottom: "5px" }}>Success Story</div>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "10px", color: "var(--secondary)" }}>{story.title}</h3>
                    <p style={{ fontSize: "0.85rem", lineHeight: "1.5", color: "var(--text-muted)", marginBottom: "15px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{story.story}</p>
                    <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem" }}>🎨 {story.craftType}</span>
                      <Link href={`/success-stories/${story._id}`} style={{ fontWeight: "bold", color: "var(--primary)", textDecoration: "none", fontSize: "0.8rem" }}>Read More →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

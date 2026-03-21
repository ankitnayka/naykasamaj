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

export default function ProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "ALL", location: "ALL" });
  const [dynamicFilters, setDynamicFilters] = useState({ categories: ["ALL"], locations: ["ALL"] });

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
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.category !== "ALL") params.append("category", filters.category);
        if (filters.location !== "ALL") params.append("location", filters.location);
        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) setProducts(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  return (
    <div style={{ padding: "40px 0", background: "var(--background)", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        
        {/* Header - Compact */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2rem", color: "var(--primary)", marginBottom: "5px" }}>Our Products</h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: "0" }}>
            Authentic creations from the heart of our community.
          </p>
        </div>

        {/* Filters - High Density */}
        <div style={{ background: "var(--surface)", padding: "10px 20px", borderRadius: "10px", boxShadow: "var(--shadow-sm)", marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Category:</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "0.8rem", outline: "none" }}
              >
                {dynamicFilters.categories.map(cat => <option key={cat} value={cat}>{cat === "ALL" ? "All" : cat}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Location:</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "0.8rem", outline: "none" }}
              >
                {dynamicFilters.locations.map(loc => <option key={loc} value={loc}>{loc === "ALL" ? "All" : loc}</option>)}
              </select>
            </div>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Showing <strong>{products.length}</strong> items
          </div>
        </div>

        {/* Grid - High Density */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading products...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {products.map((product) => (
              <div key={product._id} style={{ background: "var(--surface)", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", transition: "transform 0.2s" }}>
                <div style={{ height: "180px", background: "#f5f5f5" }}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={product.name} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🏺</div>
                  )}
                </div>
                <div style={{ padding: "15px" }}>
                  <div style={{ fontSize: "0.65rem", color: "var(--primary)", fontWeight: "bold", textTransform: "uppercase", marginBottom: "4px" }}>{product.category}</div>
                  <h3 style={{ margin: "0 0 6px 0", color: "var(--secondary)", fontSize: "1.1rem" }}>{product.name}</h3>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                    By {product.artisanId?.name} • {product.artisanId?.location}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--primary)" }}>₹{product.price}</span>
                    <Link href={`/adi-haat/product/${product._id}`} className="btn" style={{ padding: "6px 12px", fontSize: "0.75rem", textDecoration: "none" }}>Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

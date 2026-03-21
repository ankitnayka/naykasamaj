"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface SuccessStory {
  _id: string;
  title: string;
  artisanName: string;
  story: string;
  images: string[];
  craftType: string;
  location: string;
}

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("/api/success-stories");
        if (res.ok) setStories(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <div style={{ padding: "40px 0", background: "var(--background)", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        
        {/* Header - Compact */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2rem", color: "var(--primary)", marginBottom: "8px" }}>Success Stories</h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
            Celebrating the journeys, triumphs, and craftsmanship of our community artisans.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading stories...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
            {stories.map(story => (
              <div key={story._id} style={{ background: "var(--surface)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)", transition: "transform 0.2s" }}>
                <div style={{ height: "180px", position: "relative" }}>
                  {story.images?.[0] ? (
                    <img src={story.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={story.title} />
                  ) : (
                    <div style={{ height: "100%", background: "var(--primary)", opacity: 0.1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>📜</div>
                  )}
                  <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(255,255,255,0.9)", padding: "4px 10px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "bold", color: "var(--primary)" }}>
                    Spotlight
                  </div>
                </div>
                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "0.65rem", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1px" }}>Artisan Journey</div>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "12px", color: "var(--secondary)", lineHeight: "1.3" }}>{story.title}</h3>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "15px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        <span>👤 {story.artisanName}</span>
                        <span>🎨 {story.craftType}</span>
                    </div>
                    <p style={{ fontSize: "0.85rem", lineHeight: "1.6", color: "var(--foreground)", marginBottom: "20px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{story.story}</p>
                    <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>📍 {story.location}</span>
                        <Link href={`/success-stories/${story._id}`} style={{ fontWeight: "bold", color: "var(--primary)", textDecoration: "none", fontSize: "0.85rem" }}>Read More →</Link>
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

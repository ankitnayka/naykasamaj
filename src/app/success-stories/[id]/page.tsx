"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function SingleStoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState<SuccessStory | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(`/api/success-stories?id=${id}`);
        if (res.ok) {
          setStory(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStory();
  }, [id]);

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading story...</div>;
  if (!story) return <div style={{ padding: "100px", textAlign: "center" }}>Story not found. <Link href="/success-stories">Back to stories</Link></div>;

  return (
    <div style={{ padding: "80px 0", background: "var(--background)", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: "40px" }}>
          <Link href="/success-stories" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>←</span> Back to Success Stories
          </Link>
        </div>

        <article>
          <div style={{ marginBottom: "40px" }}>
            <div style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>Community Spotlight</div>
            <h1 style={{ fontSize: "3.5rem", color: "var(--secondary)", marginBottom: "20px", lineHeight: "1.1" }}>{story.title}</h1>
            <div style={{ display: "flex", gap: "25px", fontSize: "1rem", color: "var(--text-muted)", paddingBottom: "20px", borderBottom: "1px solid var(--border)" }}>
              <span>👤 <strong>{story.artisanName}</strong></span>
              <span>🎨 {story.craftType}</span>
              <span>📍 {story.location}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "50px" }}>
            {story.images?.map((img, i) => (
              <div key={i} style={{ borderRadius: "20px", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
                <img src={img} style={{ width: "100%", height: "auto", display: "block" }} alt={`Story image ${i + 1}`} />
              </div>
            ))}
          </div>

          <div style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "var(--foreground)", whiteSpace: "pre-wrap" }}>
            {story.story}
          </div>

          <div style={{ marginTop: "60px", padding: "40px", background: "var(--surface)", borderRadius: "20px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ marginBottom: "15px" }}>Inspired by {story.artisanName}'s journey?</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "25px" }}>Explore authentic products and support local craftsmanship in our marketplace.</p>
            <Link href="/adi-haat" className="btn" style={{ padding: "12px 30px" }}>Visit Adi Haat Marketplace</Link>
          </div>
        </article>
      </div>
    </div>
  );
}

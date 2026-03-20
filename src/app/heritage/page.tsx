"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface MediaItem {
  _id: string;
  title: string;
  description: string;
  type: "PHOTO" | "VIDEO" | "AUDIO";
  url: string;
  category: string;
  isSensitiveTK: boolean;
  createdAt: string;
}

export default function HeritageHub() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("TIMELINE");
  const [media, setMedia] = useState<MediaItem[]>([]);

  // Mock data for immediate visual representation
  const timelineEvents = [
    { year: "Antiquity", title: "Origins in the Forests", desc: "The Nayka community thrived in unison with nature, relying on gathering and traditional farming." },
    { year: "1800s", title: "Colonial Resistance", desc: "Participation in various uprisings against colonial forestry laws to protect indigenous land rights." },
    { year: "1950s", title: "Post-Independence Reforms", desc: "Integration into the broader socio-economic framework while fighting to maintain cultural identity." },
    { year: "Present", title: "Digital Awakening - Project Setu", desc: "A unified movement to preserve heritage digitally and uplift the community through education and commerce." }
  ];

  const mockMedia: MediaItem[] = [
    { _id: "m1", title: "Dangi Dance Ceremony", description: "Annual harvest festival celebration.", type: "VIDEO", url: "https://example.com/video1", category: "FESTIVAL", isSensitiveTK: false, createdAt: new Date().toISOString() },
    { _id: "m2", title: "The Story of the Great Banyan", description: "Elder Somabhai narrates an ancestral legend.", type: "AUDIO", url: "https://example.com/audio1", category: "ORAL_HISTORY", isSensitiveTK: true, createdAt: new Date().toISOString() },
    { _id: "m3", title: "Traditional Wedding Rituals", description: "Archival photos from 1980.", type: "PHOTO", url: "https://example.com/photo1", category: "CEREMONY", isSensitiveTK: false, createdAt: new Date().toISOString() },
  ];

  useEffect(() => {
    // In a real app, we'd fetch from /api/media
    setMedia(mockMedia);
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0", background: "var(--background)" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* Hero Section */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "3rem", color: "var(--primary)", marginBottom: "15px" }}>Digital Heritage & Culture Hub</h1>
          <p style={{ fontSize: "1.2rem", color: "var(--text-muted)", maxWidth: "800px", margin: "0 auto" }}>
            Preserving the songs, stories, and sacred traditions of the Nayka Samaj for generations to come.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "50px", flexWrap: "wrap" }}>
          {["TIMELINE", "PHOTO_GALLERY", "VIDEO_ARCHIVE", "ORAL_HISTORY"].map((tab) => (
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
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "TIMELINE" && (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2rem", color: "var(--secondary)", textAlign: "center", marginBottom: "40px" }}>Our Origins</h2>
            <div style={{ position: "relative", borderLeft: "4px solid var(--accent)", paddingLeft: "30px", marginLeft: "20px" }}>
              {timelineEvents.map((event, index) => (
                <div key={index} style={{ marginBottom: "40px", position: "relative" }}>
                  <div style={{ position: "absolute", left: "-42px", top: "0", width: "20px", height: "20px", borderRadius: "50%", background: "var(--accent)", border: "4px solid var(--background)" }}></div>
                  <span style={{ display: "inline-block", padding: "4px 12px", background: "var(--primary)", color: "white", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "10px" }}>{event.year}</span>
                  <h3 style={{ fontSize: "1.4rem", color: "var(--foreground)", marginBottom: "10px" }}>{event.title}</h3>
                  <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>{event.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "PHOTO_GALLERY" && (
          <div>
            <h2 style={{ fontSize: "2rem", color: "var(--secondary)", textAlign: "center", marginBottom: "40px" }}>Community Photo Gallery</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {media.filter(m => m.type === "PHOTO").map(item => (
                <div key={item._id} style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ height: "200px", background: "#ddd", borderRadius: "4px", marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>📷</div>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "5px" }}>{item.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "VIDEO_ARCHIVE" && (
          <div>
            <h2 style={{ fontSize: "2rem", color: "var(--secondary)", textAlign: "center", marginBottom: "40px" }}>Ceremonies & Celebrations</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "30px" }}>
              {media.filter(m => m.type === "VIDEO").map(item => (
                <div key={item._id} style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ height: "250px", background: "#2c3e50", borderRadius: "4px", marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>▶️</div>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "5px" }}>{item.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "ORAL_HISTORY" && (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2rem", color: "var(--secondary)", textAlign: "center", marginBottom: "40px" }}>Oral History & Songs</h2>
            <div style={{ display: "grid", gap: "20px" }}>
              {media.filter(m => m.type === "AUDIO").map(item => (
                <div key={item._id} style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: "25px", boxShadow: "var(--shadow-sm)", borderLeft: "4px solid var(--primary)" }}>
                  
                  {item.isSensitiveTK && (
                    <div style={{ display: "inline-block", background: "#fef3c7", color: "#d97706", padding: "4px 10px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "15px" }}>
                      ⚠️ Traditional Knowledge (TK) Label: Respectful listening required.
                    </div>
                  )}

                  <h3 style={{ fontSize: "1.3rem", marginBottom: "10px", color: "var(--secondary)" }}>{item.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "20px" }}>{item.description}</p>
                  
                  <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "30px", display: "flex", alignItems: "center", gap: "15px" }}>
                    <button style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
                    <div style={{ flex: 1, height: "6px", background: "#ddd", borderRadius: "3px" }}>
                      <div style={{ width: "0%", height: "100%", background: "var(--primary)", borderRadius: "3px" }}></div>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>0:00 / 4:32</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

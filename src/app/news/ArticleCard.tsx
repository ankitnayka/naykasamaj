"use client";

import React, { useState } from "react";

interface ArticleCardProps {
  article: {
    _id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    images?: string[];
    gallery?: string[];
    excerpt?: string;
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const allImages = [...(article.images || []), ...(article.gallery || [])];
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div style={{
      background: "var(--surface)",
      padding: "30px",
      borderRadius: "var(--radius)",
      boxShadow: "var(--shadow-sm)",
      borderLeft: `5px solid ${article.category === 'FACT_CHECK' ? '#e74c3c' : article.category === 'ALERT' ? '#f59e0b' : 'var(--primary)'}`
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--text-muted)", textTransform: "uppercase" }}>
          {article.category.replace("_", " ")}
        </span>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          {new Date(article.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <h2 style={{ fontSize: "1.5rem", color: "var(--secondary)", marginBottom: "15px" }}>{article.title}</h2>
      
      {allImages.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <img 
            src={allImages[selectedIdx]} 
            alt={article.title} 
            style={{ width: "100%", maxHeight: "500px", objectFit: "contain", borderRadius: "8px", background: "#f3f4f6" }} 
          />
          
          {allImages.length > 1 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              {allImages.map((imgSrc, idx) => (
                <img 
                  key={idx} 
                  src={imgSrc} 
                  alt={`${article.title} thumbnail ${idx}`} 
                  onClick={() => setSelectedIdx(idx)}
                  style={{ 
                    width: "80px", 
                    height: "60px", 
                    objectFit: "cover", 
                    borderRadius: "4px", 
                    cursor: "pointer",
                    border: selectedIdx === idx ? "2px solid var(--primary)" : "2px solid transparent",
                    opacity: selectedIdx === idx ? 1 : 0.7,
                    transition: "all 0.2s"
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
        {article.excerpt ? article.excerpt : article.content}
      </p>
    </div>
  );
}

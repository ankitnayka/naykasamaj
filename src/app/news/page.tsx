"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ArticleCard from "./ArticleCard";

interface Article {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  images?: string[];
  gallery?: string[];
  excerpt?: string;
}

export default function News() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [categories, setCategories] = useState<string[]>(["ALL", "NEWS", "ALERT", "FACT_CHECK", "STATEMENT", "BLOG"]);

  const mockNews = [
    { _id: "1", title: "Project Setu Beta Release", content: "We are thrilled to launch the beta version of the Nayka Samaj portal...", category: "NEWS", createdAt: new Date().toISOString() },
    { _id: "2", title: "Fact Check: Scholarship Deadline", content: "Contrary to rumors circulating on WhatsApp, the deadline for the Vidya Scheme has not been extended.", category: "FACT_CHECK", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: "3", title: "President's Address on Foundation Day", content: "Our rich heritage continues to be the bedrock of our modern society...", category: "STATEMENT", createdAt: new Date(Date.now() - 172800000).toISOString() }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/news/categories");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setCategories(["ALL", ...data.map((c: any) => c.name.toUpperCase())]);
          }
        }
      } catch (e) {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const query = filter !== "ALL" ? `?category=${filter}` : "";
        const res = await fetch(`/api/news${query}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setArticles(data);
        } else {
          setArticles(filter === "ALL" ? mockNews : mockNews.filter(n => n.category === filter));
        }
      } catch (e) {
        setArticles(filter === "ALL" ? mockNews : mockNews.filter(n => n.category === filter));
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "30px", textAlign: "center" }}>
          Official Information & News
        </h1>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "40px" }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                background: filter === cat ? "var(--primary)" : "transparent",
                color: filter === cat ? "white" : "var(--foreground)",
                border: "1px solid var(--primary)",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "var(--transition)"
              }}
            >
              {cat.replace("_", " ")}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <div style={{ display: "grid", gap: "25px" }}>
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
            
            {articles.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--text-muted)" }}>No articles found in this category.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

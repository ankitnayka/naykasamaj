"use client";

import React, { useEffect, useState } from "react";
import styles from "./NewsTicker.module.css";

interface Article {
  _id: string;
  title: string;
  category: string;
}

const NewsTicker = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback mock data if DB is empty for demonstration
  const mockNews = [
    { _id: "1", title: "Project Setu officially launched! Register today to explore the Member Hub.", category: "ANNOUNCEMENT" },
    { _id: "2", title: "Scholarship applications open for the academic year 2026-2027.", category: "ALERT" },
    { _id: "3", title: "Cultural Festival scheduled for October 10th - Mark your calendars!", category: "NEWS" },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news?limit=5");
        const data = await res.json();
        if (data && data.length > 0) {
          setNews(data);
        } else {
          setNews(mockNews);
        }
      } catch (error) {
        setNews(mockNews);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return null;

  return (
    <div className={styles.tickerWrapper}>
      <div className={styles.tickerLabel}>Latest Updates</div>
      <div className={styles.tickerContainer}>
        <div className={styles.tickerContent}>
          {news.map((item, index) => (
            <span key={item._id} className={styles.tickerItem}>
              <span className={styles.categoryBadge}>{item.category}</span>
              {item.title}
              {index < news.length - 1 && <span className={styles.separator}>|</span>}
            </span>
          ))}
          {/* Duplicate for infinite scroll effect */}
          {news.map((item, index) => (
            <span key={`${item._id}-dup`} className={styles.tickerItem}>
              <span className={styles.categoryBadge}>{item.category}</span>
              {item.title}
              {index < news.length - 1 && <span className={styles.separator}>|</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;

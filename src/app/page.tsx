"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./page.module.css";
import Link from "next/link";
import NewsTicker from "@/components/NewsTicker/NewsTicker";
import Carousel from "@/components/Carousel/Carousel";
import Image from "next/image";

export default function Home() {
  const { t } = useLanguage();
  const [latestNews, setLatestNews] = useState<any>(null);
  const [latestEvent, setLatestEvent] = useState<any>(null);
  const [latestScheme, setLatestScheme] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const [newsRes, eventRes, schemeRes, allEventsRes, storiesRes, productsRes] = await Promise.all([
          fetch("/api/news?limit=1"),
          fetch("/api/events?limit=1"),
          fetch("/api/schemes?limit=1"),
          fetch("/api/events?limit=3"),
          fetch("/api/success-stories?limit=3"),
          fetch("/api/products?limit=4")
        ]);

        if (newsRes.ok) {
          const newsData = await newsRes.json();
          if (newsData.length > 0) setLatestNews(newsData[0]);
        }
        if (eventRes.ok) {
          const eventData = await eventRes.json();
          if (eventData.length > 0) setLatestEvent(eventData[0]);
        }
        if (schemeRes.ok) {
          const schemeData = await schemeRes.json();
          if (schemeData.length > 0) setLatestScheme(schemeData[0]);
        }
        if (allEventsRes.ok) {
          setEvents(await allEventsRes.json());
        }
        if (storiesRes.ok) {
          setStories(await storiesRes.json());
        }
        if (productsRes.ok) {
          setProducts(await productsRes.json());
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* <NewsTicker /> */}

      {/* Carousel Hero */}
      <Carousel />

      <section className={styles.section} style={{ background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleCentered}`}>{t.home.missionTitle}</h2>
          <p style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 50px", fontSize: "1.1rem" }}>
            {t.home.missionDesc}
          </p>

          <div className={styles.missionGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🤝</div>
              <h3 className={styles.cardTitle}>{t.nav.about}</h3>
              <p>Learn about our history, vision, and leadership driving the community forward.</p>
              <Link href="/about" style={{ marginTop: "15px", display: "inline-block", color: "var(--primary)", fontWeight: "600" }}>
                {t.common.readMore} →
              </Link>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>🎓</div>
              <h3 className={styles.cardTitle}>{t.nav.schemes}</h3>
              <p>Explore scholarship opportunities, job postings, and career guidance.</p>
              <Link href="/schemes" style={{ marginTop: "15px", display: "inline-block", color: "var(--primary)", fontWeight: "600" }}>
                {t.common.readMore} →
              </Link>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>📅</div>
              <h3 className={styles.cardTitle}>{t.nav.events}</h3>
              <p>Stay updated with our upcoming cultural programs, meetings, and events.</p>
              <Link href="/events" style={{ marginTop: "15px", display: "inline-block", color: "var(--primary)", fontWeight: "600" }}>
                {t.common.readMore} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section style={{ padding: "40px 0", background: "#fcfcfc", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

            {/* News Update */}
            <div style={{ flex: 1, minWidth: "300px", background: "white", padding: "20px", borderRadius: "12px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: "var(--primary)", background: "#fff0f0", padding: "4px 10px", borderRadius: "20px", textTransform: "uppercase" }}>Latest News</span>
                <Link href="/news" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "none" }}>Show All</Link>
              </div>
              {latestNews ? (
                <>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "10px", lineHeight: "1.4" }}>{latestNews.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "15px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{latestNews.summary || latestNews.content.substring(0, 100)}...</p>
                  <Link href="/news" style={{ marginTop: "auto", fontSize: "0.80rem", fontWeight: "bold", color: "var(--primary)", textDecoration: "none" }}>Show in News Section →</Link>
                </>
              ) : <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading latest news...</div>}
            </div>

            {/* Event Update */}
            <div style={{ flex: 1, minWidth: "300px", background: "white", padding: "20px", borderRadius: "12px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: "#2d7aed", background: "#eef5ff", padding: "4px 10px", borderRadius: "20px", textTransform: "uppercase" }}>Upcoming Event</span>
                <Link href="/events" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "none" }}>Show All</Link>
              </div>
              {latestEvent ? (
                <>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "10px", lineHeight: "1.4" }}>{latestEvent.title}</h3>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "15px" }}>
                    📅 {new Date(latestEvent.date).toLocaleDateString()} • 📍 {latestEvent.location}
                  </div>
                  <Link href="/events" style={{ marginTop: "auto", fontSize: "0.8rem", fontWeight: "bold", color: "#2d7aed", textDecoration: "none" }}>View Events Calendar →</Link>
                </>
              ) : <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No upcoming events currently.</div>}
            </div>

            {/* Scheme Update */}
            <div style={{ flex: 1, minWidth: "300px", background: "white", padding: "20px", borderRadius: "12px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: "#b35900", background: "#fff4e6", padding: "4px 10px", borderRadius: "20px", textTransform: "uppercase" }}>New Scheme</span>
                <Link href="/schemes" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "none" }}>Show All</Link>
              </div>
              {latestScheme ? (
                <>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "10px", lineHeight: "1.4" }}>{latestScheme.title}</h3>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "15px" }}>
                    🏛️ {latestScheme.provider} • 🎨 {latestScheme.category}
                  </div>
                  <Link href="/schemes" style={{ marginTop: "auto", fontSize: "0.8rem", fontWeight: "bold", color: "#b35900", textDecoration: "none" }}>Explore All Schemes →</Link>
                </>
              ) : <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Check back soon for new schemes.</div>}
            </div>

          </div>
        </div>
      </section>

      {/* Events Section Preview */}
      <section className={styles.section} id="events-preview">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming Events</h2>
            <Link href="/events" className={styles.viewAll}>View All Events →</Link>
          </div>
          <div className={styles.grid}>
            {events.length > 0 ? events.map((event: any) => (
              <div key={event._id} className={styles.previewCard}>
                <div className={styles.cardInfo}>
                  <span className={styles.tag}>{new Date(event.date).toLocaleDateString()}</span>
                  <h3 className={styles.cardTitle}>{event.title}</h3>
                  <p className={styles.cardText}>📍 {event.location}</p>
                </div>
              </div>
            )) : <p className={styles.noData}>No upcoming events at the moment. Stay tuned!</p>}
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className={styles.section} style={{ background: "#f9f9f9" }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Success Stories</h2>
            <Link href="/success-stories" className={styles.viewAll}>Read More Stories →</Link>
          </div>
          <div className={styles.grid}>
            {stories.length > 0 ? stories.map((story: any) => (
              <Link href={`/success-stories/${story._id}`} key={story._id} className={styles.previewCardHover}>
                {story.image && (
                  <div className={styles.previewImage}>
                    <Image src={story.image} alt={story.title} fill />
                  </div>
                )}
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{story.title}</h3>
                  <p className={styles.cardText} style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{story.summary || story.content}</p>
                </div>
              </Link>
            )) : <p>Loading success stories...</p>}
          </div>
        </div>
      </section>

      {/* Adi Haat Preview */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Adi Haat (Handicrafts)</h2>
            <Link href="/adi-haat" className={styles.viewAll}>Explore All Products →</Link>
          </div>
          <div className={styles.productGrid}>
            {products.length > 0 ? products.map((product: any) => (
              <div key={product._id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <Image src={product.images?.[0] || "/placeholder.png"} alt={product.name} fill />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productPrice}>₹{product.price}</p>
                </div>
              </div>
            )) : <p>Loading products...</p>}
          </div>
        </div>
      </section>

    </div>
  );
}

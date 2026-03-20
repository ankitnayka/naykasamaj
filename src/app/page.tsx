"use client";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./page.module.css";
import Link from "next/link";
import NewsTicker from "@/components/NewsTicker/NewsTicker";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      <NewsTicker />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>{t.home.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{t.home.heroSubtitle}</p>
          <div className={styles.heroButtons}>
            <Link href="/register" className="btn btn-lg">
              {t.home.joinUs}
            </Link>
            <Link href="/donate" className={`btn btn-lg ${styles.btnSecondary}`}>
              {t.home.supportUs}
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{t.home.missionTitle}</h2>
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
    </div>
  );
}

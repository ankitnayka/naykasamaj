"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./page.module.css";
import Link from "next/link";
import Carousel from "@/components/Carousel/Carousel";
import ProgressReport from "@/components/ProgressReport/ProgressReport";

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <div className="animate-fade-in">
      {/* Carousel Hero */}
      <Carousel />

      <section className={styles.section} style={{ background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleCentered}`}>{t.home.missionTitle}</h2>
          <p style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 30px", fontSize: "1.1rem" }}>
            {t.home.missionDesc}
          </p>

          <div className={styles.missionPreamble}>
            {/* {t.home.missionPreamble} */}
          </div>

          <div className={styles.missionGrid}>
            {t.home.missionItems && t.home.missionItems.map((item: any, index: number) => (
              <div key={index} className={styles.missionItem}>
                <h3 className={styles.missionItemTitle}>{item.title}</h3>
                <p className={styles.missionItemDesc}>{item.description}</p>
              </div>
            ))}
          </div>

          {/* <ProgressReport /> */}
        </div>
      </section>

      {/* App Promo Section - Moved after Mission */}
      <section className={styles.appPromo}>
        <div className="container">
          <h2 className={styles.promoTitle}>
            {language === "en" ? "Stay Connected on the Go!" : "ગમે ત્યાંથી જોડાયેલા રહો!"}
          </h2>
          <p className={styles.promoDesc}>
            {language === "en"
              ? "Download the official Shree Nayaka Samaj Directory App to access member details, latest news, and exclusive updates directly on your smartphone."
              : "તમારા સ્માર્ટફોન પર સીધા જ સભ્યની વિગતો, નવીનતમ સમાચાર અને અપડેટ્સ ઍક્સેસ કરવા માટે સત્તાવાર શ્રી નાયક સમાજ ડિરેક્ટરી એપ ડાઉનલોડ કરો."}
          </p>
          <div className={styles.promoButtons}>
            <Link
              href="https://play.google.com/store/apps/details?id=com.directory.nayakasamaj"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnApp}
            >
              <i className="bi bi-google-play" style={{ marginRight: "10px" }}></i>  Play Store
            </Link>
            {/* <button className={styles.btnApp}>
              <i className="bi bi-apple" style={{ marginRight: "10px" }}></i> App Store
            </button> */}
          </div>
        </div>
      </section>
    </div>
  );
}

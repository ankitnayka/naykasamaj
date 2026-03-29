"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./bhavan.module.css";
import { useLanguage } from "@/context/LanguageContext";

const IMAGES = Array.from({ length: 7 }, (_, i) => `/images/bhavan/bhavan-${i + 1}.jpg`);

export default function BhavanClient() {
  const { t } = useLanguage();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Close lightbox on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{t.bhavan.title}</h1>
          <p className={styles.subtitle}>
            {t.bhavan.subtitle}
          </p>
        </div>
      </section>

      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <div className={styles.masonryGrid}>
            {IMAGES.map((src, index) => (
              <div 
                key={src} 
                className={styles.imageCard}
                onClick={() => setLightboxImage(src)}
              >
                <div className={styles.imageWrapper}>
                  <Image 
                    src={src} 
                    alt={`Bhavan Render ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.galleryImage}
                    priority={index < 3}
                  />
                  <div className={styles.overlay}>
                    <span>{t.bhavan.viewImage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className={styles.lightbox} onClick={() => setLightboxImage(null)}>
          <button className={styles.closeBtn} onClick={() => setLightboxImage(null)}>
            ✕
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image 
              src={lightboxImage}
              alt="Expanded Render"
              fill
              style={{ objectFit: "contain" }}
              quality={100}
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}

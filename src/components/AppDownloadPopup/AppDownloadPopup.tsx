"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";
import styles from "./AppDownloadPopup.module.css";

const AppDownloadPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    const hasClosed = localStorage.getItem("appDownloadPopupClosed");

    // Show after 2 seconds only if not closed before in this session
    const timer = setTimeout(() => {
      if (!hasClosed) {
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || pathname?.startsWith("/admin")) return null;

  return (
    <div className={styles.popupContainer}>
      <button className={styles.closeButton} onClick={handleClose} aria-label="Close popup">
        <i className="bi bi-x"></i>
      </button>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <i className="bi bi-phone"></i>
        </div>
        <div className={styles.textWrapper}>
          <h4 className={styles.title}>{t.appDownload.title}</h4>
          <p className={styles.description}>{t.appDownload.description}</p>
        </div>
      </div>
      <a
        href="https://play.google.com/store/apps/details?id=com.directory.nayakasamaj"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.downloadButton}
      >
        <i className="bi bi-google-play"></i>
        <span>{t.appDownload.downloadNow}</span>
      </a>
    </div>
  );
};

export default AppDownloadPopup;

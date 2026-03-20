"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Footer.module.css";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.brandSection}>
          <h2 className={styles.logo}>Nayka Samaj</h2>
          <p className={styles.tagline}>{t.home.heroSubtitle}</p>
        </div>

        <div className={styles.linksSection}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/">{t.nav.home}</Link></li>
            <li><Link href="/about">{t.nav.about}</Link></li>
            <li><Link href="/events">{t.nav.events}</Link></li>
            <li><Link href="/gallery">{t.nav.gallery}</Link></li>
          </ul>
        </div>

        <div className={styles.supportSection}>
          <h3>Support</h3>
          <ul>
            <li><Link href="/schemes">{t.nav.schemes}</Link></li>
            <li><Link href="/jobs">{t.nav.jobs}</Link></li>
            <li><Link href="/donate">{t.common.donate}</Link></li>
            <li><Link href="/register">{t.common.register}</Link></li>
          </ul>
        </div>

        <div className={styles.legalSection}>
          <h3>Legal</h3>
          <ul>
            <li><Link href="/legal/privacy">{t.footer.privacy}</Link></li>
            <li><Link href="/legal/terms">{t.footer.terms}</Link></li>
            <li><Link href="/legal/disclaimer">{t.footer.disclaimer}</Link></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <div className="container">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

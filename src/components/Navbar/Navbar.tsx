"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  // const { data: session } = useSession(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const handleDonate = () => {
    setShowDonateModal(true);
    setIsMenuOpen(false);
  };

  const copyNumber = () => {
    navigator.clipboard.writeText("9662003868");
    alert("Mobile number copied to clipboard!");
  };

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.navContainer}`}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/logo.jpeg"
              alt="Nayka Samaj Logo"
              width={50}
              height={50}
              className={styles.logoImg}
            />
            <span className={styles.logoText}>નાયકા સમાજ </span>
          </Link>

          <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
            <Link href="/" className={styles.navItem} onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/about" className={styles.navItem} onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link href="/contact" className={styles.navItem} onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.directory.nayakasamaj"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navItem}
              onClick={() => setIsMenuOpen(false)}
            >
              App
            </Link>

            <div className={styles.actionGroup}>
              <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle Theme">
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              <button className={styles.langToggle} onClick={toggleLanguage}>
                {language === "en" ? "ગુજરાતી" : "English"}
              </button>

              {/* {session ? (
                <>
                  {(session.user?.role === "ADMIN" || session.user?.role === "MODERATOR") && (
                    <Link href="/admin" className={styles.navItem} onClick={() => setIsMenuOpen(false)}>Admin</Link>
                  )}
                  <button onClick={() => signOut()} className={styles.langToggle}>Log Out</button>
                </>
              ) : (
                <Link href="/api/auth/signin" className={styles.navItem} onClick={() => setIsMenuOpen(false)}>Log In</Link>
              )} */}

              <button
                className="btn"
                style={{
                  color: "white",
                  backgroundColor: "var(--samaj-maroon)",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 20px",
                  borderRadius: "var(--radius)"
                }}
                onClick={handleDonate}
              >
                {t.common.donate}
              </button>
            </div>
          </nav>

          <button
            className={styles.mobileMenuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* Custom Donation Modal */}
      {showDonateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDonateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowDonateModal(false)}>✕</button>
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>🧡</div>
              <h2 className={styles.modalTitle}>
                {language === "en" ? "Thank You for Your Support!" : "સહયોગ માટે આભાર!"}
              </h2>
            </div>
            <p className={styles.modalBody}>
              {language === "en"
                ? "For any donation-related queries or information, please contact our community lead directly."
                : "વધુ માહિતી માટે કૃપા કરીને નીચેના નંબર પર કૃણાલ પટેલનો સંપર્ક કરો."}
            </p>
            <div className={styles.contactCard}>
              <div className={styles.contactInfo}>
                <span className={styles.contactName}>કૃણાલ પટેલ (Krunal Patel)</span>
                <span className={styles.contactNumber}>+91 96620 03868</span>
              </div>
              <button className={styles.copyBtn} onClick={copyNumber}>
                Copy Number 📋
              </button>
            </div>
            <div className={styles.modalFooter}>
              <Link href={`tel:+919662003868`} className={styles.callBtn}>
                Call Now 📞
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

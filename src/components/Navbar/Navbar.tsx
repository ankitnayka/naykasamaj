"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSession, signOut } from "next-auth/react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          Nayka Samaj
        </Link>
        
        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
          <Link href="/" onClick={() => setIsMenuOpen(false)}>{t.nav.home}</Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)}>{t.nav.about}</Link>
          <Link href="/heritage" onClick={() => setIsMenuOpen(false)}>{t.nav.heritage}</Link>
          <Link href="/members" onClick={() => setIsMenuOpen(false)}>{t.nav.members}</Link>
          <Link href="/forum" onClick={() => setIsMenuOpen(false)}>Forum</Link>
          <Link href="/matrimony" onClick={() => setIsMenuOpen(false)}>Matrimony</Link>
          <Link href="/events" onClick={() => setIsMenuOpen(false)}>{t.nav.events}</Link>
          <Link href="/jobs" onClick={() => setIsMenuOpen(false)}>{t.nav.jobs}</Link>
          <Link href="/schemes" onClick={() => setIsMenuOpen(false)}>{t.nav.schemes}</Link>
          <Link href="/adi-haat" onClick={() => setIsMenuOpen(false)}>{t.nav.marketplace}</Link>
          <Link href="/gallery" onClick={() => setIsMenuOpen(false)}>{t.nav.gallery}</Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)}>{t.nav.contact}</Link>
          
          <div className={styles.actionGroup}>
            <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button className={styles.langToggle} onClick={toggleLanguage}>
              {language === "en" ? "ગુજરાતી" : "English"}
            </button>
            
            {session ? (
              <>
                {(session.user?.role === "ADMIN" || session.user?.role === "MODERATOR") && (
                  <Link href="/admin" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Admin</Link>
                )}
                <button onClick={() => signOut()} className={styles.langToggle}>Log Out</button>
              </>
            ) : (
              <Link href="/api/auth/signin" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Log In</Link>
            )}

            <Link href="/donate" className="btn" onClick={() => setIsMenuOpen(false)}>
              {t.common.donate}
            </Link>
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
  );
};

export default Navbar;

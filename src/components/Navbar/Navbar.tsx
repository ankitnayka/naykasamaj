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
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo.jpeg"
            alt="Nayka Samaj Logo"
            width={45}
            height={45}
            className={styles.logoImg}
          />
          <span className={styles.logoText}>નાયકા સમાજ </span>
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Community ▾</button>
            <div className={styles.dropdownContent}>
              <Link href="/about" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>About Us</Link>
              <Link href="/news" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>News</Link>
              <Link href="/events" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Events</Link>
              <Link href="/forum" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Forum</Link>
              <Link href="/members" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Member Directory</Link>
              <Link href="/matrimony" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Matrimony</Link>
            </div>
          </div>

          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Resources ▾</button>
            <div className={styles.dropdownContent}>
              <Link href="/schemes" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Govt Schemes</Link>
              <Link href="/jobs" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Jobs</Link>
              <Link href="/skills" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Skill Development</Link>
              <Link href="/scd-support" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>SCD Support</Link>
            </div>
          </div>
          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Marketplace ▾</button>
            <div className={styles.dropdownContent}>
              <Link href="/adi-haat" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Adi Haat (Artisans)</Link>
              <Link href="/products" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Products</Link>
              <Link href="/success-stories" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Success Stories</Link>
            </div>
          </div>
          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Heritage ▾</button>
            <div className={styles.dropdownContent}>
              <Link href="/heritage/stories" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Stories</Link>
              <Link href="/heritage/oral-history" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Oral History</Link>
              <Link href="/gallery" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Gallery</Link>
              <Link href="/heritage/audio" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Audio Archive</Link>
              <Link href="/heritage/language" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Language</Link>
            </div>
          </div>



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

            <Link href="/donate" className="btn" style={{ color: "white", backgroundColor: "var(--samaj-maroon)" }} onClick={() => setIsMenuOpen(false)}>
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

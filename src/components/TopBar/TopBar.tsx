"use client";

import React from "react";
import styles from "./TopBar.module.css";

const TopBar = () => {
  const text = "શિક્ષિત બનો સંગઠિત બનો સમૃધ્ર્દ્ર બનો સંઘર્ષ કરો સલામત રહો";

  return (
    <div className={styles.topBar}>
      <div className={styles.scrollingText}>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default TopBar;

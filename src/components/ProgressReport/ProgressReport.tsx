"use client";

import React from "react";
import styles from "./ProgressReport.module.css";

const ProgressReport = () => {
  const data = [
    {
      years: "2000 - 2005",
      title: "Foundation & Unity",
      description: "Establishment of the core community directory and initial registration of families across the region.",
      highlights: ["Community Registration", "Leadership Board Formed"],
      color: "#800020" // Maroon
    },
    {
      years: "2005 - 2010",
      title: "Educational Outreach",
      description: "Launched scholarship programs and vocational training centers to empower the youth.",
      highlights: ["Scholarship Programs", "Training Centers"],
      color: "#a52a2a"
    },
    {
      years: "2010 - 2015",
      title: "Digital Integration",
      description: "Transitioned to digital record-keeping and launched the first community forum for global connectivity.",
      highlights: ["Digital Directory", "Online Forum"],
      color: "#d4af37" // Gold
    },
    {
      years: "2015 - 2020",
      title: "Sustainable Growth",
      description: "Initiated large-scale cultural preservation projects and established heritage archives.",
      highlights: ["Heritage Preservation", "Sustainable Funding"],
      color: "#b35900"
    },
    {
      years: "2020 - 2025",
      title: "Modernization & Beyond",
      description: "Full-scale mobile app integration, matrimonial portal, and AI-driven career assistance.",
      highlights: ["Mobile App Launch", "Matrimonial Portal"],
      color: "#800020"
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.timeline}>
        {data.map((item, index) => (
          <div key={index} className={styles.cardWrapper}>
            <div className={styles.card}>
              <div className={styles.cardHeader} style={{ backgroundColor: item.color }}>
                <span className={styles.years}>{item.years}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.description}</p>
                <ul className={styles.highlights}>
                  {item.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressReport;

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Carousel.module.css";

const Carousel = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const images = ["/crusal1.jpeg", "/crusal2.jpeg", "/crusal3.jpeg"];
  
  // Combine static images with translatable text
  const slides = ((t.home as any).slides || []).map((slide: any, idx: number) => ({
    ...slide,
    image: images[idx] || images[0]
  }));

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className={styles.carousel}>
      {slides.map((slide: any, index: number) => (
        <div
          key={index}
          className={`${styles.slide} ${index === current ? styles.activeSlide : ""}`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className={styles.image}
            priority={index === 0}
          />
          <div className={styles.overlay}></div>
          <div className={styles.content}>
            <h2 className={styles.title}>{slide.title}</h2>
            <p className={styles.subtitle}>{slide.subtitle}</p>
          </div>
        </div>
      ))}


      <div className={styles.indicators}>
        {slides.map((_: any, index: number) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === current ? styles.activeIndicator : ""}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Carousel.module.css";

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      image: "/crusal1.jpeg",
      title: "Empowering Nayka Community",
      subtitle: "Connecting hearts, preserving heritage, and building a brighter future together."
    },
    {
      image: "/crusal2.jpeg",
      title: "Cultural Excellence",
      subtitle: "Celebrating our rich traditions and passing them to the next generation."
    },
    {
      image: "/crusal3.jpeg",
      title: "Stronger Together",
      subtitle: "Support, growth, and unity for every member of our community."
    }
  ];

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.carousel}>
      {slides.map((slide, index) => (
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
        {slides.map((_, index) => (
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

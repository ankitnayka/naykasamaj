"use client";

import React, { useState } from "react";

interface EventCardProps {
  event: any;
}

export default function EventCard({ event }: EventCardProps) {
  const allImages = [...(event.images || []), ...(event.gallery || [])];
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div style={{
      background: "var(--surface)",
      padding: "30px",
      borderRadius: "var(--radius)",
      boxShadow: "var(--shadow-sm)",
      borderLeft: "5px solid var(--primary)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--primary)", textTransform: "uppercase" }}>
          {event.category.replace("_", " ")}
        </span>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.95rem", color: "var(--text)", fontWeight: "bold" }}>
             📅 {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
             📍 {event.isVirtual ? "Virtual Event" : event.location}
          </div>
        </div>
      </div>
      
      <h2 style={{ fontSize: "1.5rem", color: "var(--secondary)", marginBottom: "15px" }}>{event.title}</h2>
      
      {allImages.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <img 
            src={allImages[selectedIdx]} 
            alt={event.title} 
            style={{ width: "100%", maxHeight: "500px", objectFit: "contain", borderRadius: "8px", background: "#f3f4f6" }} 
          />
          
          {allImages.length > 1 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              {allImages.map((imgSrc, idx) => (
                <img 
                  key={idx} 
                  src={imgSrc} 
                  alt={`${event.title} thumbnail ${idx}`} 
                  onClick={() => setSelectedIdx(idx)}
                  style={{ 
                    width: "80px", 
                    height: "60px", 
                    objectFit: "cover", 
                    borderRadius: "4px", 
                    cursor: "pointer",
                    border: selectedIdx === idx ? "2px solid var(--primary)" : "2px solid transparent",
                    opacity: selectedIdx === idx ? 1 : 0.7,
                    transition: "all 0.2s"
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ color: "var(--text-muted)", lineHeight: "1.6", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
        {event.description}
      </div>

      {event.isVirtual && event.meetingLink && (
         <div style={{ marginTop: "20px" }}>
           <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "var(--primary)", color: "white", padding: "10px 20px", borderRadius: "20px", textDecoration: "none", fontWeight: "500" }}>
             Join Digital Meeting
           </a>
         </div>
      )}
    </div>
  );
}

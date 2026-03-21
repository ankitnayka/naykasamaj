"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import EventCard from "./EventCard";

export default function Events() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [categories, setCategories] = useState<string[]>(["ALL", "CULTURAL", "MEETING", "WORKSHOP", "HEALTH_DRIVE"]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/events/categories");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setCategories(["ALL", ...data.map((c: any) => c.name.toUpperCase())]);
          }
        }
      } catch (e) {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const query = filter !== "ALL" ? `?category=${filter}` : "";
        const res = await fetch(`/api/admin/events${query}`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        } else {
          setEvents([]);
        }
      } catch (e) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filter]);

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "30px", textAlign: "center" }}>
          {t?.nav?.events || "Community Events"}
        </h1>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "40px" }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                background: filter === cat ? "var(--primary)" : "transparent",
                color: filter === cat ? "white" : "var(--foreground)",
                border: "1px solid var(--primary)",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "var(--transition)"
              }}
            >
              {cat.replace("_", " ")}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <div style={{ display: "grid", gap: "25px" }}>
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
            
            {events.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--text-muted)" }}>No events found in this category.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

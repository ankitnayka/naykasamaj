"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Events() {
  const { t } = useLanguage();

  const events = [
    { id: 1, title: "Annual General Meeting 2026", date: "April 15, 2026", type: "Meeting", status: "Upcoming" },
    { id: 2, title: "Navratri Cultural Festival", date: "October 10, 2026", type: "Cultural", status: "Upcoming" },
    { id: 3, title: "Youth Education Seminar", date: "June 05, 2026", type: "Education", status: "Upcoming" },
    { id: 4, title: "Community Health Drive", date: "January 20, 2026", type: "Welfare", status: "Completed" },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container">
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "40px", textAlign: "center" }}>
          {t.nav.events}
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
          {events.map((event) => (
            <div key={event.id} style={{ 
              background: "var(--surface)", 
              padding: "25px", 
              borderRadius: "var(--radius)", 
              boxShadow: "var(--shadow-md)",
              borderTop: `4px solid ${event.status === 'Upcoming' ? 'var(--primary)' : 'var(--text-muted)'}`,
              transition: "var(--transition)",
            }}
            className="card-hover">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <span style={{ 
                  background: event.status === 'Upcoming' ? 'rgba(242, 101, 34, 0.1)' : 'rgba(102, 102, 102, 0.1)', 
                  color: event.status === 'Upcoming' ? 'var(--primary)' : 'var(--text-muted)',
                  padding: "5px 12px", 
                  borderRadius: "20px", 
                  fontSize: "0.85rem",
                  fontWeight: "600"
                }}>
                  {event.status}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>{event.type}</span>
              </div>
              <h3 style={{ fontSize: "1.3rem", color: "var(--secondary)", marginBottom: "10px" }}>{event.title}</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                📅 {event.date}
              </p>
              <button style={{ width: "100%", padding: "10px", background: "transparent", border: "1px solid var(--primary)", color: "var(--primary)", borderRadius: "var(--radius)", cursor: "pointer", fontWeight: "600", transition: "var(--transition)" }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; }}
              >
                {t.common.readMore}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

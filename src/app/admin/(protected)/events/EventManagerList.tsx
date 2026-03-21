"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import EventForm from "./EventForm";

export default function EventManagerList({ initialEvents }: { initialEvents: any[] }) {
  const router = useRouter();
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Event deleted");
        router.refresh();
      } else {
        alert("Failed to delete event");
      }
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>
            {editingEvent ? "Edit Event" : "Create New Event"}
          </h2>
          <EventForm 
            key={editingEvent ? editingEvent._id : "new"} 
            editEvent={editingEvent} 
            onSuccess={() => setEditingEvent(null)} 
          />
        </div>

        <div>
           <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>Manage Events</h2>
           <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
             {initialEvents.length === 0 ? (
               <p style={{ color: "var(--text-muted)" }}>No events listed yet.</p>
             ) : (
               initialEvents.map((event: any) => (
                 <div key={event._id.toString()} style={{ background: "var(--surface)", padding: "15px", borderRadius: "8px", borderLeft: "4px solid var(--primary)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                   <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "var(--accent)", marginBottom: "5px" }}>{event.category}</div>
                   <h4 style={{ margin: "0 0 5px 0", fontSize: "1rem" }}>{event.title}</h4>
                   <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "5px" }}>
                     📅 {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                   <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                     📍 {event.isVirtual ? "Virtual Event" : event.location}
                   </div>
                   <div style={{ display: "flex", gap: "10px" }}>
                     <button onClick={() => setEditingEvent(event)} style={{ flex: 1, padding: "5px", background: "var(--border)", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}>Edit</button>
                     <button onClick={() => handleDelete(event._id.toString())} style={{ flex: 1, padding: "5px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}>Delete</button>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </>
  );
}

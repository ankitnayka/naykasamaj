import connectDB from "@/lib/db";
import Event from "@/models/Event";
import EventForm from "./EventForm";

export default async function ManageEvents() {
  await connectDB();
  const upcomingEvents = await Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(10);
  const pastEvents = await Event.find({ date: { $lt: new Date() } }).sort({ date: -1 }).limit(5);

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Content Desk: Community Events</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)" }}>
        Manage the dynamic community event calendar. Schedule meetings, cultural festivals, and skill-building workshops for the public and members.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>Schedule New Event</h2>
          <EventForm />
        </div>

        <div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>Upcoming Events</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
            {upcomingEvents.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No upcoming events scheduled.</p>
            ) : (
              upcomingEvents.map((ev: any) => (
                <div key={ev._id.toString()} style={{ background: "var(--surface)", padding: "15px", borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", borderLeft: "4px solid var(--accent)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "bold" }}>{ev.category}</span>
                    <span style={{ fontSize: "0.8rem", color: "#e74c3c", fontWeight: "bold" }}>{new Date(ev.date).toLocaleDateString()}</span>
                  </div>
                  <h4 style={{ margin: "0 0 5px 0" }}>{ev.title}</h4>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>📍 {ev.isVirtual ? "Virtual (Online)" : ev.location}</div>
                </div>
              ))
            )}
          </div>

          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--text-muted)" }}>Recent Past Events</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pastEvents.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No past events.</p>
            ) : (
              pastEvents.map((ev: any) => (
                <div key={ev._id.toString()} style={{ background: "var(--surface)", padding: "10px 15px", borderRadius: "6px", border: "1px solid var(--border)", opacity: 0.7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{ev.title}</strong>
                    <span style={{ fontSize: "0.8rem" }}>{new Date(ev.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

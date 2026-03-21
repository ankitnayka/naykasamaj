import connectDB from "@/lib/db";
import Event from "@/models/Event";
import EventCategoryManager from "./EventCategoryManager";
import EventManagerList from "./EventManagerList";

export const dynamic = 'force-dynamic';

export default async function ManageEvents() {
  await connectDB();
  const events = await Event.find().sort({ date: -1 }).lean();

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Event Management</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)" }}>
        Manage Categories, Schedule community gatherings, virtual meetings, and health drives.
      </p>

      <EventCategoryManager />

      <EventManagerList initialEvents={JSON.parse(JSON.stringify(events))} />
    </div>
  );
}

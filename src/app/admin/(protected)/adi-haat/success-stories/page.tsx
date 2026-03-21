import connectDB from "@/lib/db";
import SuccessStory from "@/models/SuccessStory";
import SuccessStoryManager from "../SuccessStoryManager";
import Link from "next/link";

export default async function ManageSuccessStories() {
  await connectDB();
  const stories = await SuccessStory.find().sort({ createdAt: -1 });
  
  // Transform to plain objects for client component
  const plainStories = stories.map(s => ({
    _id: s._id.toString(),
    title: s.title,
    artisanName: s.artisanName,
    story: s.story,
    imageUrl: s.imageUrl,
    craftType: s.craftType,
    location: s.location,
    artisanId: s.artisanId ? s.artisanId.toString() : null
  }));

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/admin/adi-haat" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.9rem" }}>← Back to Adi Haat Hub</Link>
      </div>
      <SuccessStoryManager initialStories={plainStories as any} />
    </div>
  );
}

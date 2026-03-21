import connectDB from "@/lib/db";
import Artisan from "@/models/Artisan";
import ArtisanManager from "../ArtisanManager";
import Link from "next/link";

export default async function ManageArtisans() {
  await connectDB();
  const artisans = await Artisan.find().sort({ createdAt: -1 });
  
  // Transform to plain objects for client component
  const plainArtisans = artisans.map(a => ({
    _id: a._id.toString(),
    name: a.name,
    bio: a.bio,
    craftType: a.craftType,
    location: a.location,
    contactEmail: a.contactEmail,
    contactPhone: a.contactPhone,
    imageUrl: a.imageUrl,
    isVerified: a.isVerified
  }));

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/admin/adi-haat" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.9rem" }}>← Back to Adi Haat Hub</Link>
      </div>
      <ArtisanManager initialArtisans={plainArtisans} />
    </div>
  );
}

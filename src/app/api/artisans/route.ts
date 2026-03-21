import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Artisan from "@/models/Artisan";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    const craftType = searchParams.get("craftType");

    let query: any = { isVerified: true };
    if (location && location !== "ALL") query.location = location;
    if (craftType && craftType !== "ALL") query.craftType = craftType;

    const artisans = await Artisan.find(query).sort({ name: 1 });
    return NextResponse.json(artisans);
  } catch (error) {
    console.error("Error fetching artisans:", error);
    return NextResponse.json({ error: "Failed to fetch artisans" }, { status: 500 });
  }
}

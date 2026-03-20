import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Media from "@/models/Media";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    
    let query: any = {};
    if (type) query.type = type;

    const mediaList = await Media.find(query).sort({ createdAt: -1 });
    return NextResponse.json(mediaList);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SuccessStory from "@/models/SuccessStory";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const limit = searchParams.get("limit");

    if (id) {
      const story = await SuccessStory.findById(id);
      if (!story) return NextResponse.json({ error: "Story not found" }, { status: 404 });
      return NextResponse.json(story);
    }

    let query = SuccessStory.find().sort({ createdAt: -1 });
    if (limit) query = query.limit(parseInt(limit));

    const stories = await query.exec();
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching success stories:", error);
    return NextResponse.json({ error: "Failed to fetch success stories" }, { status: 500 });
  }
}

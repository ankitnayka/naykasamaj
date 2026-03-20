import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Article from "@/models/Article";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query: any = { isPublished: true };
    if (category) {
      query.category = category;
    }

    const articles = await Article.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .populate("authorId", "name");

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

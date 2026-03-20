import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Article from "@/models/Article";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, excerpt, category, tags, imageUrl, isPublished } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    
    // Parse tags if it's a comma-separated string
    const parsedTags = Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];

    const newArticle = new Article({
      title,
      content,
      excerpt,
      category,
      tags: parsedTags,
      imageUrl,
      isPublished: !!isPublished,
      publishedAt: isPublished ? new Date() : undefined,
      authorId: session.user.id === "admin-global" ? undefined : session.user.id
    });

    await newArticle.save();

    return NextResponse.json({ success: true, article: newArticle });
  } catch (error) {
    console.error("Article Creation Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

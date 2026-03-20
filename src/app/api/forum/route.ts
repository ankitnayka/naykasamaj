import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Post } from "@/models/Forum";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Required to populate Author details
import "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (!session.user.isVerified && session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query: any = {};
    if (category && category !== "ALL") query.category = category;

    // Fetch posts, populate author (but handle anonymity later in the client or here)
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "name _id");
      
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (!session.user.isVerified && session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { title, content, category, isAnonymous } = await req.json();

    if (!title || !content || !category) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newPost = await Post.create({
      title,
      content,
      category,
      author: session.user.id,
      isAnonymous: isAnonymous || false,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

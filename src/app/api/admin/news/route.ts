import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Article from "@/models/Article";
import cloudinary from "@/lib/cloudinary";

const uploadFileToCloudinary = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
  return (uploadResult as any).secure_url;
};

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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const tagsStr = formData.get("tags") as string;
    const isPublished = formData.get("isPublished") === "true";

    const imagesFiles = formData.getAll("images") as File[];
    const galleryFiles = formData.getAll("gallery") as File[];

    if (!title || !content || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const imageUrls = [];
    for (const file of imagesFiles) {
      if (file.size > 0) {
        const url = await uploadFileToCloudinary(file);
        imageUrls.push(url);
      }
    }

    const galleryUrls = [];
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const url = await uploadFileToCloudinary(file);
        galleryUrls.push(url);
      }
    }

    const parsedTags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : [];

    await connectDB();

    const newArticle = new Article({
      title,
      content,
      excerpt,
      category,
      tags: parsedTags,
      images: imageUrls,
      gallery: galleryUrls,
      isPublished,
      publishedAt: isPublished ? new Date() : undefined,
      authorId: session.user.id === "admin-global" ? undefined : session.user.id
    });

    await newArticle.save();

    return NextResponse.json({ success: true, article: newArticle });
  } catch (error: any) {
    console.error("Article Creation Error:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

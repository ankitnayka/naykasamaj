import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import SuccessStory from "@/models/SuccessStory";
import cloudinary from "@/lib/cloudinary";

const uploadFileToCloudinary = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "success-stories" },
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
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const stories = await SuccessStory.find().sort({ createdAt: -1 });
    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
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
    const artisanName = formData.get("artisanName") as string;
    const story = formData.get("story") as string;
    const craftType = formData.get("craftType") as string;
    const location = formData.get("location") as string;
    const artisanId = formData.get("artisanId") as string;
    
    // Multiple images
    const imageFiles = formData.getAll("images") as File[];

    if (!title || !artisanName || !story || !craftType || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const url = await uploadFileToCloudinary(file);
        imageUrls.push(url);
      }
    }

    await connectDB();
    const newStory = new SuccessStory({
      title,
      artisanName,
      story,
      images: imageUrls,
      craftType,
      location,
      artisanId: artisanId || undefined
    });

    await newStory.save();
    return NextResponse.json({ success: true, story: newStory });
  } catch (error: any) {
    console.error("Success Story Creation Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

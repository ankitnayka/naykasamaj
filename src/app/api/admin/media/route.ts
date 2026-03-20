import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Media from "@/models/Media";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const media = await Media.find().sort({ createdAt: -1 });
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching media" }, { status: 500 });
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
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;
    const category = formData.get("category") as string;
    const isSensitiveTK = formData.get("isSensitiveTK") === "true";
    const file = formData.get("file") as File;

    if (!title || !type || !category || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert file to buffer and upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: type === "VIDEO" || type === "AUDIO" ? "video" : "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const secureUrl = (uploadResult as any).secure_url;

    await connectDB();
    const newMedia = new Media({
      title,
      description,
      type,
      category,
      url: secureUrl,
      isSensitiveTK,
      uploadedBy: session.user.id === "admin-global" ? undefined : session.user.id
    });

    await newMedia.save();

    return NextResponse.json({ success: true, media: newMedia });
  } catch (error) {
    console.error("Media Upload Error:", error);
    return NextResponse.json({ error: "Server Error during upload" }, { status: 500 });
  }
}

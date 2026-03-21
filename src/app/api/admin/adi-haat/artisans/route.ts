import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Artisan from "@/models/Artisan";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";

const uploadFileToCloudinary = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "artisans" },
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
    const artisans = await Artisan.find().sort({ createdAt: -1 });
    return NextResponse.json(artisans);
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
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const craftType = formData.get("craftType") as string;
    const location = formData.get("location") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const isVerified = formData.get("isVerified") === "true";
    const imageFile = formData.get("image") as File;

    if (!name || !bio || !craftType || !location || !contactEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFileToCloudinary(imageFile);
    }

    await connectDB();
    const newArtisan = new Artisan({
      name,
      bio,
      craftType,
      location,
      contactEmail,
      contactPhone,
      imageUrl,
      isVerified,
      ownerId: session.user.id === "admin-global" ? new mongoose.Types.ObjectId() : session.user.id
    });

    await newArtisan.save();
    return NextResponse.json({ success: true, artisan: newArtisan });
  } catch (error: any) {
    console.error("Artisan Creation Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

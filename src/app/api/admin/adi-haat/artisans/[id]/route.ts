import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Artisan from "@/models/Artisan";
import Product from "@/models/Product";
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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const craftType = formData.get("craftType") as string;
    const location = formData.get("location") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const isVerified = formData.get("isVerified") === "true";
    const imageFile = formData.get("image") as File;
    const existingImageUrl = formData.get("imageUrl") as string;

    if (!name || !bio || !craftType || !location || !contactEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageUrl = existingImageUrl;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFileToCloudinary(imageFile);
    }

    await connectDB();
    const updated = await Artisan.findByIdAndUpdate(
      id,
      { name, bio, craftType, location, contactEmail, contactPhone, imageUrl, isVerified },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Artisan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, artisan: updated });
  } catch (error: any) {
    console.error("Artisan Update Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    
    // Delete all products for this artisan first
    await Product.deleteMany({ artisanId: id });
    
    const deleted = await Artisan.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Artisan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Artisan Deletion Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

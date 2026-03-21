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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const formData = await req.formData();
    
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const tagsStr = formData.get("tags") as string;
    const isPublished = formData.get("isPublished") === "true";
    
    // Existing URLs that the user decided to keep
    const existingImagesStr = formData.get("existingImages") as string;
    const existingGalleryStr = formData.get("existingGallery") as string;
    const existingImages = existingImagesStr ? JSON.parse(existingImagesStr) : [];
    const existingGallery = existingGalleryStr ? JSON.parse(existingGalleryStr) : [];

    const imagesFiles = formData.getAll("images") as File[];
    const galleryFiles = formData.getAll("gallery") as File[];

    const imageUrls = [...existingImages];
    for (const file of imagesFiles) {
      if (file.size > 0) {
        const url = await uploadFileToCloudinary(file);
        imageUrls.push(url);
      }
    }

    const galleryUrls = [...existingGallery];
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const url = await uploadFileToCloudinary(file);
        galleryUrls.push(url);
      }
    }

    await connectDB();

    const parsedTags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : [];

    const updated = await Article.findByIdAndUpdate(id, {
      title,
      content,
      excerpt,
      category,
      tags: parsedTags,
      images: imageUrls,
      gallery: galleryUrls,
      isPublished,
      publishedAt: isPublished ? new Date() : undefined
    }, { new: true });

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, article: updated });
  } catch (error: any) {
    console.error("Error updating article:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
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
    
    const deleted = await Article.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

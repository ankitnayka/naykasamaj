import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

const uploadFileToCloudinary = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "products" },
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
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const category = formData.get("category") as string;
    const artisanId = formData.get("artisanId") as string;
    const inStock = formData.get("inStock") === "true";
    
    // Existing and new images
    const existingImagesJson = formData.get("existingImages") as string;
    const existingImages = existingImagesJson ? JSON.parse(existingImagesJson) : [];
    const newImageFiles = formData.getAll("images") as File[];

    if (!name || !description || !price || !category || !artisanId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const imageUrls = [...existingImages];
    for (const file of newImageFiles) {
      if (file && file.size > 0) {
        const url = await uploadFileToCloudinary(file);
        imageUrls.push(url);
      }
    }

    await connectDB();
    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price: Number(price),
        category,
        artisanId,
        images: imageUrls,
        inStock
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Product Update Error:", error);
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
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product Deletion Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Scheme from "@/models/Scheme";
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
    const provider = formData.get("provider") as string;
    const description = formData.get("description") as string;
    const shortDescription = formData.get("shortDescription") as string || description;
    const fullDescription = formData.get("fullDescription") as string;
    const category = formData.get("category") as string;
    
    // Eligibility
    const ageLimit = formData.get("ageLimit") as string;
    const incomeCriteria = formData.get("incomeCriteria") as string;
    const targetGroup = formData.get("targetGroup") as string;
    
    // Benefits
    const financialBenefit = formData.get("financialBenefit") as string;
    const otherBenefits = formData.get("otherBenefits") as string;
    
    // Details
    const startDate = formData.get("startDate") as string;
    const lastDate = formData.get("lastDate") as string;
    const status = formData.get("status") as string;
    
    // Links & Media
    const officialWebsite = formData.get("officialWebsite") as string;
    const applyLink = formData.get("applyLink") as string;

    const existingImage = formData.get("existingImage") as string;
    const removeImage = formData.get("removeImage") === "true";
    const imageFile = formData.get("image") as File;

    if (!title || !provider || !description || !shortDescription || !fullDescription || !category || !targetGroup || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageUrl = existingImage || "";
    if (removeImage) imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFileToCloudinary(imageFile);
    }

    await connectDB();

    const updated = await Scheme.findByIdAndUpdate(id, {
      title,
      provider,
      description,
      shortDescription,
      fullDescription,
      category,
      ageLimit,
      incomeCriteria,
      targetGroup,
      financialBenefit,
      otherBenefits,
      startDate: startDate ? new Date(startDate) : undefined,
      lastDate: lastDate ? new Date(lastDate) : undefined,
      status,
      officialWebsite,
      applyLink,
      image: imageUrl
    }, { new: true });

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, scheme: updated });
  } catch (error: any) {
    console.error("Error updating scheme:", error);
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
    
    const deleted = await Scheme.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

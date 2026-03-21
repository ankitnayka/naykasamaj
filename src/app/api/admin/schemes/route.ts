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

export async function GET(req: Request) {
  try {
    await connectDB();
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    return NextResponse.json(schemes);
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

    const imageFile = formData.get("image") as File;

    if (!title || !provider || !description || !shortDescription || !fullDescription || !category || !targetGroup || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFileToCloudinary(imageFile);
    }

    await connectDB();

    const newScheme = new Scheme({
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
    });

    await newScheme.save();

    return NextResponse.json({ success: true, scheme: newScheme });
  } catch (error: any) {
    console.error("Scheme Creation Error:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

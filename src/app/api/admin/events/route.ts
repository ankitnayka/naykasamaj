import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
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

    let query: any = {};
    if (category) {
      query.category = category;
    }

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("organizer", "name");

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
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
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const category = formData.get("category") as string;
    const isVirtual = formData.get("isVirtual") === "true";
    const meetingLink = formData.get("meetingLink") as string;

    const imagesFiles = formData.getAll("images") as File[];
    const galleryFiles = formData.getAll("gallery") as File[];

    if (!title || !description || !date || !location || !category) {
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

    await connectDB();

    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      location,
      category,
      isVirtual,
      meetingLink,
      images: imageUrls,
      gallery: galleryUrls,
      organizer: session.user.id === "admin-global" ? undefined : session.user.id
    });

    await newEvent.save();

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error: any) {
    console.error("Event Creation Error:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

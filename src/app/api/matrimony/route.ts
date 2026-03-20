import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import MatrimonyProfile from "@/models/MatrimonyProfile";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Required for population
import "@/models/User";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (!session.user.isVerified && session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const genderId = searchParams.get("gender");

    let query: any = {};
    if (genderId && genderId !== "ALL") query.gender = genderId;

    // Do not show the current user's profile in their search results
    query.user = { $ne: session.user.id };

    const profiles = await MatrimonyProfile.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name email isVerified");
      
    // Handle Privacy Mode: If privacy is enabled, scramble the name and hide the photo
    const processedProfiles = profiles.map(p => {
      const obj = p.toObject();
      if (obj.isPrivacyEnabled) {
        obj.user.name = "Private Member";
        obj.photos = [];
      }
      return obj;
    });

    return NextResponse.json(processedProfiles);
  } catch (error) {
    console.error("Error fetching matrimony profiles:", error);
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (!session.user.isVerified && session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    const existingProfile = await MatrimonyProfile.findOne({ user: session.user.id });
    if (existingProfile) {
      return NextResponse.json({ error: "Profile already exists" }, { status: 400 });
    }

    const newProfile = await MatrimonyProfile.create({
      ...data,
      user: session.user.id,
    });

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error("Error creating matrimony profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

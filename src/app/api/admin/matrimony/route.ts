import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import MatrimonyProfile from "@/models/MatrimonyProfile";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { profileId, action } = await req.json();

    if (!profileId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const profile = await MatrimonyProfile.findById(profileId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      profile.isApproved = true;
      await profile.save();
    } else if (action === "REJECT") {
      // Physically remove the profile if rejected for safety
      await MatrimonyProfile.findByIdAndDelete(profileId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Matrimony Moderation Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

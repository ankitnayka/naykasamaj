import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Event from "@/models/Event";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, date, location, category, isVirtual, meetingLink } = await req.json();

    if (!title || !description || !date || !location || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    
    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      location,
      category,
      isVirtual: !!isVirtual,
      meetingLink,
      organizer: session.user.id === "admin-global" ? undefined : session.user.id
    });

    await newEvent.save();

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    console.error("Event Creation Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

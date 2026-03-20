import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Scheme from "@/models/Scheme";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, provider, category, eligibility, applicationLink, deadline } = await req.json();

    if (!title || !description || !provider || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    
    // Parse eligibility if it's a comma-separated string
    const parsedEligibility = Array.isArray(eligibility) 
      ? eligibility 
      : typeof eligibility === "string" 
        ? eligibility.split("\n").map((e: string) => e.trim()).filter(Boolean) 
        : [];

    const newScheme = new Scheme({
      title,
      description,
      provider,
      category,
      eligibility: parsedEligibility,
      applicationLink,
      deadline: deadline ? new Date(deadline) : undefined,
    });

    await newScheme.save();

    return NextResponse.json({ success: true, scheme: newScheme });
  } catch (error) {
    console.error("Scheme Creation Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

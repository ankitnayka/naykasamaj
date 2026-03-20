import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Job from "@/models/Job";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, company, location, type, description, requirements, applyLink, isSkillDevelopment } = await req.json();

    if (!title || !company || !location || !type || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    
    // Parse requirements if it's a newline-separated string
    const parsedRequirements = Array.isArray(requirements) 
      ? requirements 
      : typeof requirements === "string" 
        ? requirements.split("\n").map((r: string) => r.trim()).filter(Boolean) 
        : [];

    const newJob = new Job({
      title,
      company,
      location,
      type,
      description,
      requirements: parsedRequirements,
      applyLink,
      isSkillDevelopment: !!isSkillDevelopment,
      postedBy: session.user.id === "admin-global" ? undefined : session.user.id
    });

    await newJob.save();

    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    console.error("Job Creation Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

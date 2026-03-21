import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Job from "@/models/Job";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, company, location, type, description, requirements, applyLink, isSkillDevelopment, status, visibility, contactEmail, contactPhone } = await req.json();

    if (!title || !company || !location || !type || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const parsedRequirements = Array.isArray(requirements) 
      ? requirements 
      : typeof requirements === "string" 
        ? requirements.split("\n").map((r: string) => r.trim()).filter(Boolean) 
        : [];

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        title,
        company,
        location,
        type,
        description,
        requirements: parsedRequirements,
        applyLink,
        contactEmail,
        contactPhone,
        isSkillDevelopment: !!isSkillDevelopment,
        status,
        visibility
      },
      { new: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error("Job Update Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
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
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Job Deletion Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

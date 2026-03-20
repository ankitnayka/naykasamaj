import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Job from "@/models/Job";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const isSkillDevelopment = searchParams.get("isSkillDevelopment");

    let query: any = {};
    if (type && type !== "ALL") query.type = type;
    if (isSkillDevelopment === "true") query.isSkillDevelopment = true;

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate("postedBy", "name email");
      
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

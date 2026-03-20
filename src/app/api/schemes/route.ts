import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Scheme from "@/models/Scheme";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get("provider");
    const category = searchParams.get("category");

    let query: any = {};
    if (provider && provider !== "ALL") query.provider = provider;
    if (category && category !== "ALL") query.category = category;

    const schemes = await Scheme.find(query).sort({ createdAt: -1 });
    return NextResponse.json(schemes);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    return NextResponse.json({ error: "Failed to fetch schemes" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Artisan from "@/models/Artisan";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const artisan = await Artisan.findById(id);
    if (!artisan) return NextResponse.json({ error: "Artisan not found" }, { status: 404 });
    return NextResponse.json(artisan);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch artisan" }, { status: 500 });
  }
}

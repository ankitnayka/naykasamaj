import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import TargetGroup from "@/models/TargetGroup";

export async function GET(req: Request) {
  try {
    await connectDB();
    const items = await TargetGroup.find().sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    await connectDB();
    const existing = await TargetGroup.findOne({ name });
    if (existing) return NextResponse.json({ error: "Target Group already exists" }, { status: 400 });

    const newItem = new TargetGroup({ name, description });
    await newItem.save();
    return NextResponse.json({ success: true, targetGroup: newItem });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, description } = await req.json();
    if (!id || !name) return NextResponse.json({ error: "ID and Name are required" }, { status: 400 });

    await connectDB();
    
    const existing = await TargetGroup.findOne({ name, _id: { $ne: id } });
    if (existing) return NextResponse.json({ error: "Target Group name already exists" }, { status: 400 });

    const updated = await TargetGroup.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, targetGroup: updated });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await connectDB();
    await TargetGroup.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

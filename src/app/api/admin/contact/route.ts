import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Message from "@/models/Message";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = await req.json();

    if (!messageId) {
      return NextResponse.json({ error: "Missing message ID" }, { status: 400 });
    }

    await connectDB();
    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    message.isResolved = true;
    message.responderId = session.user.id === "admin-global" ? undefined : session.user.id;
    await message.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resolve Message Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

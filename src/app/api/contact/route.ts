import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, body } = await req.json();

    if (!name || !email || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const newMessage = new Message({ name, email, phone, subject, body });
    await newMessage.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json({ error: "Server error while sending message" }, { status: 500 });
  }
}

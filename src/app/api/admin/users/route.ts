import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, action } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent modifying other admins
    if (user.role === "ADMIN" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Cannot modify Admin users" }, { status: 403 });
    }

    switch (action) {
      case "APPROVE":
        user.isVerified = true;
        user.role = "VERIFIED_MEMBER";
        user.status = "ACTIVE";
        break;
      case "REJECT":
        await User.findByIdAndDelete(userId);
        return NextResponse.json({ message: "User rejected and deleted" });
      case "SUSPEND":
        user.status = "SUSPENDED";
        break;
      case "BLOCK":
        user.status = "BLOCKED";
        user.isVerified = false;
        break;
      case "UNBLOCK":
        user.status = "ACTIVE";
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await user.save();
    return NextResponse.json({ message: `User successfully updated to ${action}` });
  } catch (error) {
    console.error("Admin User Action Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

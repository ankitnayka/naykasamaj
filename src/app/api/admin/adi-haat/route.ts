import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Artisan from "@/models/Artisan";
import Product from "@/models/Product";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { artisanId, action } = await req.json();

    if (!artisanId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return NextResponse.json({ error: "Artisan not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      artisan.isVerified = true;
      await artisan.save();
    } else if (action === "REJECT") {
      // If rejected, delete the artisan and all associated products
      await Product.deleteMany({ artisanId });
      await Artisan.findByIdAndDelete(artisanId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Adi Haat Moderation Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

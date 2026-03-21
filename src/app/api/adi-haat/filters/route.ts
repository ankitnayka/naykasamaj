import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Artisan from "@/models/Artisan";

export async function GET() {
  try {
    await connectDB();
    
    // Get unique categories from Products
    const categories = await Product.distinct("category");
    
    // Get unique locations from Artisans
    const locations = await Artisan.distinct("location");

    return NextResponse.json({
      categories: ["ALL", ...categories],
      locations: ["ALL", ...locations]
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 });
  }
}

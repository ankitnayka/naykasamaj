import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
// Required for population
import "@/models/Artisan";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query: any = {};
    if (category && category !== "ALL") query.category = category;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .populate("artisanId");
      
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

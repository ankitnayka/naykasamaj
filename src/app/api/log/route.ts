import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log(`\n📱 [PHONE LOG]:`, data.message);
    if (data.error) {
      console.error(`📱 [PHONE ERROR DETAILS]:`, data.error);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to parse remote log:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

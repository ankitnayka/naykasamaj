import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, action } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const model = getGeminiModel();
    let finalPrompt = "";

    if (action === "DRAFT_NEWS") {
      finalPrompt = `Write a professional short news announcement (2-3 paragraphs) about the following topic for the Nayka Community Portal. Keep the tone respectful and informative.\n\nTopic: ${prompt}`;
    } else if (action === "FACT_CHECK") {
      finalPrompt = `Analyze the following claim or statement and output a brief fact-check summary. State clearly if it seems true, false, or needs more context, based on general knowledge.\n\nClaim: ${prompt}`;
    } else {
      finalPrompt = prompt;
    }

    const result = await model.generateContent(finalPrompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}

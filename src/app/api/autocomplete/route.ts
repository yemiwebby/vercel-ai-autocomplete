import { fetchGeminiSuggestion } from "../../../lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ completion: "Missing prompt" }, { status: 400 });
    }

    const text = await fetchGeminiSuggestion(prompt);

    return NextResponse.json({ completion: text });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Server error:", error.message);

      if (error.message.includes("Rate limit")) {
        return NextResponse.json(
          { completion: "Rate limit exceeded. Please wait a few seconds." },
          { status: 429 }
        );
      }
    } else {
      console.error("Unknown error:", error);
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

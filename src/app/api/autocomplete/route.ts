import { NextRequest, NextResponse } from "next/server";
import { generateAutocomplete } from "../../../lib/autocomplete";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ completion: "Missing prompt" }, { status: 400 });
  }

  try {
    const completion = await generateAutocomplete(prompt);
    return NextResponse.json({ completion });
  } catch (err) {
    console.error("Autocomplete API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

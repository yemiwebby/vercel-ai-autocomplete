export async function fetchGeminiSuggestion(prompt: string): Promise<string> {
  const formattedPrompt = `Suggest one possible word completion for: "${prompt}". Just give the word without explanation.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-001:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: formattedPrompt }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API error:", errorText);

    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }

    throw new Error("Gemini API request failed");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}

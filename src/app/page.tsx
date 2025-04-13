"use client";

import { useState, useCallback } from "react";
import debounce from "lodash/debounce";

export default function Page() {
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSuggestion = useCallback(
    debounce(async (text: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text }),
        });

        const data = await res.json();

        if (!res.ok) {
          setSuggestion("");
          setError(data.completion || "Failed to fetch suggestion");
        } else {
          const cleaned = data.completion.replace(/[🌀-🛿]/gu, "").trim();
          setSuggestion(cleaned);
        }
      } catch (err) {
        console.error("Error fetching suggestion:", err);
        setError("Something went wrong.");
        setSuggestion("");
      }
      setLoading(false);
    }, 400),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val.trim()) fetchSuggestion(val);
    else setSuggestion("");
  };

  const handleSuggestionClick = () => {
    setInput(suggestion);
    setSuggestion("");
  };

  return (
    <div className="space-y-4 p-4 max-w-xl mx-auto relative">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Start typing..."
        className="w-full border p-2 rounded"
      />

      {suggestion && !error && (
        <div
          onClick={handleSuggestionClick}
          className="absolute left-4 right-4 top-16 bg-white border border-gray-300 rounded shadow-md p-2 cursor-pointer hover:bg-gray-100 z-10 text-gray-900"
        >
          {suggestion}
        </div>
      )}

      {loading && <p className="text-gray-500 text-sm">Thinking...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

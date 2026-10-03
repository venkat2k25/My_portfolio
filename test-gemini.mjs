import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
});

try {
  console.log("Testing Gemini...\n");

  const response = await ai.models.generateContent({
    model,
    contents: "Say hello to Venkata in one short sentence.",
  });

  console.log("✅ Gemini is working!\n");
  console.log("Response:");
  console.log(response.text);
} catch (error) {
  console.error("❌ Gemini request failed:\n");
  console.error(error);
}

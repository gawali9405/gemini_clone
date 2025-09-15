import { GoogleGenerativeAI } from "@google/generative-ai";

// Read API key from .env via Vite
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Use Gemini 2.5 Pro model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

async function runChat(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "⚠️ Something went wrong while fetching response.";
  }
}

export default runChat;

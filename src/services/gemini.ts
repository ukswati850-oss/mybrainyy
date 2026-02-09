import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (API_KEY && API_KEY !== "YOUR_API_KEY") {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

export const getGeminiResponse = async (prompt: string, systemInstruction?: string): Promise<string> => {
  if (!model) {
    console.warn("Gemini API Key missing. Returning mock response.");
    return "I am in offline mode. Please add your VITE_GEMINI_API_KEY to the .env file to unlock my full potential!";
  }

  try {
    const fullPrompt = systemInstruction 
      ? `${systemInstruction}\n\nUser Query: ${prompt}`
      : prompt;
      
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to Brainy's AI core.");
  }
};

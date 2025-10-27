import { GoogleGenerativeAI } from "@google/generative-ai";

export async function sendMessageToAI(message) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return data.reply || "No response from AI.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Something went wrong. Please try again.";
  }
}

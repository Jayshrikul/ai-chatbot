import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing in your .env file.");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Routes
app.get("/", (req, res) => {
  res.send("AI Chatbot Server is running ✅");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const result = await model.generateContent(message);
    const reply = result.response?.text() || "⚠ No response from AI.";
    res.json({ reply });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Export for Vercel
export default app;

// ✅ Start server locally (only when run directly, not in Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running locally on http://localhost:${PORT}`));
}

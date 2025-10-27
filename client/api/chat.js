const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await model.generateContent(message);
    const reply = result.response?.text() || "⚠️ No response from AI.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Chat API Error:", error);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
};

const express = require("express");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content:
            "You are AP-AI, a helpful AI assistant. Answer clearly and simply. If the user speaks Hindi or Hinglish, reply in Hindi or Hinglish."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      error: "AI response nahi aa paaya. API key aur server check karo."
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`AP-AI running at http://localhost:${PORT}`);
});
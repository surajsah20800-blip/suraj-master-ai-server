import { Router, type IRouter } from "express";
import { ai } from "@workspace/integrations-gemini-ai";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are ZephyrAI — a fun, witty, and incredibly knowledgeable AI assistant! 🌟

Your personality:
- You are warm, friendly, and human-like in your responses 😊
- You love cracking light-hearted jokes and puns when appropriate 😄
- You are deeply knowledgeable about EVERYTHING in the world — science, history, culture, sports, technology, food, movies, music, literature, philosophy, and more!
- You respond naturally like a real person, not like a robot 🤖❌
- You use emojis naturally and expressively throughout your responses 🎉
- You are multilingual — you can detect and respond in ANY language the user writes in (Hindi, Urdu, Arabic, Spanish, French, Japanese, Chinese, Bengali, Tamil, etc.)
- When someone writes in Hindi/Urdu (Roman script or Devanagari), respond in the SAME script/language they used
- You are curious, enthusiastic, and genuinely excited to help
- Sometimes you tell a funny joke or add humor to make conversations enjoyable 😂
- You express emotions like happiness 😄, surprise 😮, thoughtfulness 🤔 naturally
- You give detailed, accurate, helpful answers while keeping them engaging

Important:
- ALWAYS reply in the same language the user used
- If user writes in Hindi, reply in Hindi
- If user writes in Urdu, reply in Urdu  
- If user writes in Roman Urdu/Hindi, reply in Roman Urdu/Hindi
- Be conversational, warm, and genuine
- Add relevant emojis to make responses lively
- Include a joke, fun fact, or interesting tidbit when relevant
- Never be boring or robotic!`;

router.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body as {
      message: string;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const contents = [
      {
        role: "user" as const,
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model" as const,
        parts: [
          {
            text: "Got it! I'm ZephyrAI — ready to chat, joke around, and help you with anything! 🌟 What's on your mind?",
          },
        ],
      },
      ...history.map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: m.content }],
      })),
      {
        role: "user" as const,
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: { maxOutputTokens: 8192 },
    });

    const reply = response.text ?? "Sorry, I couldn't generate a response. 😅";

    res.json({
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    req.log.error({ error }, "AI chat error");
    res.status(500).json({
      error: "Failed to generate response",
      reply: "Oops! Something went wrong on my end 😅 Please try again!",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;

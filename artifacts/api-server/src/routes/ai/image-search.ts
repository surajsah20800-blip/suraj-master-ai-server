import { Router, type IRouter } from "express";
import { ai } from "@workspace/integrations-gemini-ai";

const router: IRouter = Router();

router.post("/image-search", async (req, res) => {
  try {
    const { query } = req.body as { query: string };

    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    const searchPrompt = `I need to find an image for: "${query}"

Please provide a direct image URL from the web for this topic. 
Return a JSON response with exactly these fields:
{
  "imageUrl": "https://... (a real, working, publicly accessible image URL)",
  "title": "A descriptive title for the image",
  "source": "The source website name"
}

Use well-known image sources like:
- Wikimedia Commons (https://upload.wikimedia.org/wikipedia/commons/...)
- NASA images (https://www.nasa.gov/sites/default/files/...)
- Wikipedia image files

For common topics, provide real image URLs you know exist. Return ONLY valid JSON, no other text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: searchPrompt }],
        },
      ],
      config: {
        maxOutputTokens: 512,
        responseMimeType: "application/json",
      },
    });

    const text = response.text ?? "{}";

    let result: { imageUrl?: string; title?: string; source?: string } = {};
    try {
      const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        imageUrl: `https://via.placeholder.com/800x600.png?text=${encodeURIComponent(query)}`,
        title: query,
        source: "Placeholder",
      };
    }

    res.json({
      imageUrl:
        result.imageUrl ||
        `https://via.placeholder.com/800x600.png?text=${encodeURIComponent(query)}`,
      title: result.title || query,
      source: result.source || "Web Search",
    });
  } catch (error) {
    req.log.error({ error }, "Image search error");
    res.status(500).json({
      error: "Failed to search image",
      imageUrl: `https://via.placeholder.com/800x600.png?text=${encodeURIComponent(req.body?.query || "image")}`,
      title: req.body?.query || "Image",
      source: "Fallback",
    });
  }
});

export default router;

import { Router } from "express";
import Groq from "groq-sdk";
import { GROQ_API_KEY } from "../config/env.js";
import accommodationService from "../services/accommodationService.js";
import roomService from "../services/roomService.js";
import provinceService from "../services/provinceService.js";
import { decisionPrompt, responsePrompt, personalityPrompt } from "../constants/chatPrompts.js";

const chatRoutes = Router();

const groq = new Groq({ apiKey: GROQ_API_KEY });

const MODEL = "llama-3.3-70b-versatile";

const tools = {
  get_accommodations: () => accommodationService.listarPublico(),
  get_cheapest_rooms: (limit = 5) => roomService.listarMasBaratas(limit),
  get_most_expensive_rooms: (limit = 5) => roomService.listarMasCaras(limit),
  get_provinces: () => provinceService.listar(),
};

chatRoutes.post("/", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // 1. ROUTER: decide si usar una herramienta o responder normal
    const decision = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0,
      messages: [
        { role: "system", content: decisionPrompt },
        ...history,
        { role: "user", content: message },
      ],
    });

    const content = decision.choices[0].message.content.trim();

    // 2. TOOL PATH
    if (content.startsWith("TOOL:")) {
      const parts = content.replace("TOOL:", "").split(":");
      const toolName = parts[0].trim();
      const limit = parts[1] ? parseInt(parts[1]) : null;

      const tool = tools[toolName];
      if (!tool) {
        return res.json({ reply: "No encontré esa información 🤔" });
      }

      const result = await (limit ? tool(limit) : tool());

      const final = await groq.chat.completions.create({
        model: MODEL,
        temperature: 0.3,
        messages: [
          { role: "system", content: responsePrompt },
          ...history,
          { role: "user", content: `RESULTADO:\n${JSON.stringify(result, null, 2)}` },
        ],
      });

      return res.json({ reply: final.choices[0].message.content });
    }

    // 3. CHAT NORMAL
    const normal = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.6,
      messages: [
        { role: "system", content: personalityPrompt },
        ...history,
        { role: "user", content: message },
      ],
    });

    return res.json({ reply: normal.choices[0].message.content });
  } catch (error) {
    console.log("Error en el chat:", error.message);
    return res.status(500).json({ error: "Error en el servidor del chat" });
  }
});

export default chatRoutes;

import OpenAI from "openai";
import { getSystemPrompt } from "../src/llm/prompts.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Vercel serverless function
 * POST /api/gm
 * Body: GMInput JSON
 * Response: GMOutput JSON
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const gmInput = req.body;

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      // System prompt with all of our GM rules
      instructions: getSystemPrompt(),
      // Send GMInput as a JSON string
      input: JSON.stringify(gmInput),
      temperature: 0.2,
    });

    // Responses API: first output, first content block, text field
    const content = completion.output?.[0]?.content?.[0];
    const text = content?.text;

    if (!text) {
      console.error("GM API: no text in response", completion);
      return res.status(500).json({ error: "GM server error (no text output)" });
    }

    let gmOutput;
    try {
      gmOutput = JSON.parse(text);
    } catch (e) {
      console.error("GM API: failed to parse JSON from text:", text);
      throw e;
    }

    return res.status(200).json(gmOutput);
  } catch (err) {
    console.error("GM API error:", err);
    return res.status(500).json({ error: "GM server error" });
  }
}
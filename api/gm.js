import OpenAI from "openai";
import { getSystemPrompt } from "../src/llm/prompts"; // adjust path if needed

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
      // System prompt for the GM
      instructions: getSystemPrompt(),
      // The structured GMInput we built on the client
      input: gmInput,
      // New parameter name for JSON output
      text_format: { type: "json_object" },
      temperature: 0.2,
    });

    // Responses API: JSON is in the content array
    const first = completion.output?.[0]?.content?.[0];
    const gmOutput = first?.json ?? completion.output_json ?? first;

    return res.status(200).json(gmOutput);
  } catch (err) {
    console.error("GM API error:", err);
    return res.status(500).json({ error: "GM server error" });
  }
}
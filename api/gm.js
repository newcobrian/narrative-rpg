import OpenAI from "openai";
import { getSystemPrompt } from "../src/llm/prompts.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const gmInput = req.body;

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: getSystemPrompt(),
      input: gmInput,
      text_format: { type: "json_object" },
      temperature: 0.2,
    });

    const first = completion.output?.[0]?.content?.[0];
    const gmOutput = first?.json ?? completion.output_json ?? first;

    return res.status(200).json(gmOutput);
  } catch (err) {
    console.error("GM API error:", err);
    return res.status(500).json({ error: "GM server error" });
  }
}
// /api/gm.js
import OpenAI from "openai";

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
      input: gmInput,
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const gmOutput =
      completion.output?.[0]?.content?.[0]?.json ?? completion.output_json;

    return res.status(200).json(gmOutput);
  } catch (err) {
    console.error("GM API error:", {
      message: err.message,
      name: err.name,
      status: err.status,
      cause: err.cause,
    });
    return res.status(500).json({ error: "GM server error" });
  }
}
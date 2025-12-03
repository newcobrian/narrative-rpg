import OpenAI from "openai";

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

    // Call OpenAI Responses API with JSON output
    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: gmInput,
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    // Depending on SDK version, output_json is the parsed object
    const gmOutput = completion.output[0].content[0].json ?? completion.output_json;

    return res.status(200).json(gmOutput);
  } catch (err) {
    console.error("GM API error:", err);
    return res.status(500).json({ error: "GM server error" });
  }
}
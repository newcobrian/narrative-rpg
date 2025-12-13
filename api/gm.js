import { callGMWithConfiguredProvider } from "../src/llm/gmRouter.js";

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

    let text;
    try {
      text = await callGMWithConfiguredProvider(gmInput);
    } catch (providerErr) {
      console.error("GM provider error:", providerErr);
      return res.status(500).json({ error: "GM provider error" });
    }

    // --- Robust JSON extraction ---
    const raw = text.trim();

    // Take everything up to and including the last closing brace.
    // This safely discards any accidental trailing text like
    // "What do you do next?"
    const lastBraceIndex = raw.lastIndexOf("}");
    const jsonText =
      lastBraceIndex !== -1 ? raw.slice(0, lastBraceIndex + 1) : raw;

    let gmOutput;
    try {
      gmOutput = JSON.parse(jsonText);
    } catch (parseErr) {
      console.error("GM API: failed to parse JSON from text:", raw);
      console.error("JSON fragment that was parsed:", jsonText);
      return res
        .status(500)
        .json({ error: "GM server error: invalid JSON from model" });
    }

    return res.status(200).json(gmOutput);
  } catch (err) {
    console.error("GM API error:", err);
    return res.status(500).json({ error: "GM server error" });
  }
}
import OpenAI from "openai";
import { getSystemPrompt } from "./prompts.js";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * OpenAI provider implementation
 */
async function callOpenAIProvider(gmInput) {
  const model = process.env.GM_MODEL || "gpt-4.1";
  const temperature = process.env.GM_TEMPERATURE
    ? Number(process.env.GM_TEMPERATURE)
    : 0.35;

  const completion = await openaiClient.responses.create({
    model,
    instructions: getSystemPrompt(),
    input: JSON.stringify(gmInput),
    temperature,
  });

  const content = completion.output?.[0]?.content?.[0];
  const text = content?.text;

  if (!text) {
    console.error("OpenAI GM: no text in response", JSON.stringify(completion, null, 2));
    throw new Error("OpenAI GM: no text in response");
  }

  return text;
}

/**
 * Claude provider stub
 */
async function callClaudeProvider(gmInput) {
  // TODO: Implement Anthropic/Claude here.
  // Should:
  // 1. Use getSystemPrompt() as system/instructions
  // 2. Use JSON.stringify(gmInput) as user content
  // 3. Return the raw JSON text from the model
  throw new Error("Claude provider not implemented yet");
}

/**
 * Gemini provider stub
 */
async function callGeminiProvider(gmInput) {
  // TODO: Implement Gemini here.
  throw new Error("Gemini provider not implemented yet");
}

/**
 * Grok provider stub
 */
async function callGrokProvider(gmInput) {
  // TODO: Implement Grok here.
  throw new Error("Grok provider not implemented yet");
}

/**
 * Provider-agnostic router that calls the configured GM provider
 * @param {Object} gmInput - The GM input object
 * @returns {Promise<string>} - The raw JSON text string from the model
 */
export async function callGMWithConfiguredProvider(gmInput) {
  const provider = (process.env.GM_PROVIDER || "openai").toLowerCase();

  switch (provider) {
    case "openai":
      return callOpenAIProvider(gmInput);
    case "claude":
      return callClaudeProvider(gmInput);
    case "gemini":
      return callGeminiProvider(gmInput);
    case "grok":
      return callGrokProvider(gmInput);
    default:
      console.warn(`Unknown GM_PROVIDER '${provider}', falling back to openai`);
      return callOpenAIProvider(gmInput);
  }
}

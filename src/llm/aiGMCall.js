import { getSystemPrompt } from './prompts';
import { validateGMOutput } from './validateGMOutput';

/**
 * @typedef {import('../types/gmTypes').GMInput} GMInput
 * @typedef {import('../types/gmTypes').GMOutput} GMOutput
 */

const GAME_ID = 'narrative-rpg-v0';

const MAX_HISTORY = 5;

function trimHistory(history) {
  if (!history || history.length === 0) return [];
  return history
    .slice(-MAX_HISTORY)
    .map(({ speaker, text }) => ({ speaker, text }));
}

function buildPlayerAction(raw_text, meta = {}) {
  return {
    raw_text,
    ability_id: meta.ability_id ?? null,
    suggested_action_id: meta.suggested_action_id ?? null
  };
}

export function buildGMInput({
  location,
  currentEncounter,
  playerState,
  encounterState,
  locationState,
  messageHistory,
  playerAction
}) {
  const recent_history = trimHistory(messageHistory);
  return {
    game_id: 'narrative_rpg_v0',
    location_id: location.location_id,
    encounter_id: encounterState.encounter_id,
    player_state: playerState,
    encounter_state: encounterState,
    location_state: locationState,
    location_data: currentEncounter,
    recent_history,
    player_action: buildPlayerAction(playerAction.raw_text, playerAction.meta),
    config: {
      difficulty: currentEncounter.difficulty || 'normal',
      max_narration_length: 220
    }
  };
}

/**
 * Generates a mock GM response for testing
 * @param {GMInput} gmInput
 * @returns {GMOutput}
 */
function generateMockResponse(gmInput) {
  const action = gmInput.player_action.raw_text || 'take a moment';
  const encounter = gmInput.location_data?.title || gmInput.encounter_id;
  return {
    narration: `Mock narration (${encounter}): You ${action} and nothing dramatic happens yet. What do you do next?`,
    suggested_actions: ['Press the attack.', 'Look around for clues.', 'Use an ability.'],
    player_state_updates: undefined,
    encounter_state_updates: undefined,
    location_state_updates: undefined,
    encounter_complete: false,
    location_complete: false,
    gm_notes: 'mock response'
  };
}

/**
 * Calls the AI GM with a GMInput and returns a validated GMOutput
 * @param {GMInput} gmInput - The structured input for the AI GM
 * @returns {Promise<GMOutput>} - The validated GM response
 */
export async function callAIGM(gmInput) {
  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const envModel = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
  const envUseMock = import.meta.env.VITE_USE_MOCK_GM === 'true';
  const useMock = (gmInput.config?.use_mock ?? envUseMock) || !envApiKey;

  console.log('🔍 AI GM Debug:', {
    hasApiKey: !!envApiKey,
    apiKeyLength: envApiKey?.length || 0,
    useMock,
    model: envModel
  });

  if (useMock) {
    console.log('📝 Returning mocked GM output');
    const mockResponse = generateMockResponse(gmInput);
    // Validate mock response too
    try {
      return validateGMOutput(mockResponse);
    } catch (error) {
      console.warn('⚠️ Mock response validation failed:', error);
      return mockResponse; // Return anyway for development
    }
  }

  console.log('🤖 Calling OpenAI API...');
  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: envApiKey,
      dangerouslyAllowBrowser: true
    });

    const systemPrompt = getSystemPrompt();
    const userContent = JSON.stringify(gmInput, null, 2);

    const response = await openai.chat.completions.create({
      model: envModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    });

    const content = response.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      console.error('❌ Failed to parse GM response as JSON', error);
      throw error;
    }

    // Validate the parsed response
    try {
      const validated = validateGMOutput(parsed);
      return validated;
    } catch (validationError) {
      console.error('❌ GM response validation failed:', validationError);
      console.error('Raw response:', parsed);
      
      // Fallback: ensure at least narration exists
      if (!parsed.narration) {
        parsed.narration = 'The Game Master seems unsure. Try your action again.';
      }
      if (!Array.isArray(parsed.suggested_actions)) {
        parsed.suggested_actions = [];
      }
      if (typeof parsed.encounter_complete !== 'boolean') {
        parsed.encounter_complete = false;
      }
      if (typeof parsed.location_complete !== 'boolean') {
        parsed.location_complete = false;
      }
      
      // Return a partially valid response with warnings
      return parsed;
    }
  } catch (error) {
    console.error('❌ OpenAI GM call failed:', error);
    return generateMockResponse(gmInput);
  }
}

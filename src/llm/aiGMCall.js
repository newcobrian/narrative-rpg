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
  playerAction,
}) {
  const recent_history = trimHistory(messageHistory);
  return {
    game_id: 'narrative_rpg_v0',
    location_id: location.location_id,
    encounter_id: encounterState.encounter_id,
    player_state: playerState,
    encounter_state: encounterState,
    location_state: locationState,
    location_data: location,
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
export async function callAIGM(input) {
  const response = await fetch("/api/gm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    console.error("GM API error", response.status);
    throw new Error("GM API error: " + response.status);
  }

  const gmOutput = await response.json();

  // still use your existing validator to be safe
  const validated = validateGMOutput(gmOutput);
  return validated;
}

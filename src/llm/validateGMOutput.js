/**
 * Runtime validator for GMOutput
 * Validates that the AI GM response matches the expected schema
 */

/**
 * Validates a GMOutput object
 * @param {any} raw - The raw parsed JSON from the AI GM
 * @returns {import('../types/gmTypes').GMOutput} - Validated GMOutput
 * @throws {Error} - If validation fails
 */
export function validateGMOutput(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('GMOutput must be an object');
  }

  // Required fields
  if (typeof raw.narration !== 'string') {
    throw new Error('GMOutput.narration must be a string');
  }

  if (!Array.isArray(raw.suggested_actions)) {
    throw new Error('GMOutput.suggested_actions must be an array');
  }

  if (!raw.suggested_actions.every(action => typeof action === 'string')) {
    throw new Error('GMOutput.suggested_actions must be an array of strings');
  }

  if (typeof raw.encounter_complete !== 'boolean') {
    throw new Error('GMOutput.encounter_complete must be a boolean');
  }

  if (typeof raw.location_complete !== 'boolean') {
    throw new Error('GMOutput.location_complete must be a boolean');
  }

  // Optional dice_rolls validation
  if (raw.dice_rolls !== undefined && raw.dice_rolls !== null) {
    if (typeof raw.dice_rolls !== 'object') {
      throw new Error('GMOutput.dice_rolls must be an object if provided');
    }

    const requiredDiceFields = ['skill_name', 'roll', 'modifier', 'dc', 'total', 'outcome'];
    for (const field of requiredDiceFields) {
      if (!(field in raw.dice_rolls)) {
        throw new Error(`GMOutput.dice_rolls.${field} is required`);
      }
    }

    // Validate skill_name
    if (typeof raw.dice_rolls.skill_name !== 'string' || raw.dice_rolls.skill_name.trim() === '') {
      throw new Error('GMOutput.dice_rolls.skill_name must be a non-empty string');
    }
    const validSkillNames = ['Strength', 'Agility', 'Magic', 'Insight', 'Charisma'];
    if (!validSkillNames.includes(raw.dice_rolls.skill_name)) {
      throw new Error(`GMOutput.dice_rolls.skill_name must be one of: ${validSkillNames.join(', ')}`);
    }

    if (typeof raw.dice_rolls.roll !== 'number') {
      throw new Error('GMOutput.dice_rolls.roll must be a number');
    }
    if (typeof raw.dice_rolls.modifier !== 'number') {
      throw new Error('GMOutput.dice_rolls.modifier must be a number');
    }
    if (typeof raw.dice_rolls.dc !== 'number') {
      throw new Error('GMOutput.dice_rolls.dc must be a number');
    }
    if (typeof raw.dice_rolls.total !== 'number') {
      throw new Error('GMOutput.dice_rolls.total must be a number');
    }
    if (raw.dice_rolls.outcome !== 'success' && raw.dice_rolls.outcome !== 'failure') {
      throw new Error('GMOutput.dice_rolls.outcome must be "success" or "failure"');
    }
  }

  // Optional state updates - just check they're objects if present
  if (raw.player_state_updates !== undefined && raw.player_state_updates !== null) {
    if (typeof raw.player_state_updates !== 'object') {
      throw new Error('GMOutput.player_state_updates must be an object if provided');
    }
  }

  if (raw.encounter_state_updates !== undefined && raw.encounter_state_updates !== null) {
    if (typeof raw.encounter_state_updates !== 'object') {
      throw new Error('GMOutput.encounter_state_updates must be an object if provided');
    }
  }

  if (raw.location_state_updates !== undefined && raw.location_state_updates !== null) {
    if (typeof raw.location_state_updates !== 'object') {
      throw new Error('GMOutput.location_state_updates must be an object if provided');
    }
  }

  // Optional gm_notes
  if (raw.gm_notes !== undefined && raw.gm_notes !== null && typeof raw.gm_notes !== 'string') {
    throw new Error('GMOutput.gm_notes must be a string or null if provided');
  }

  // Return the validated object (with defaults for missing optional fields)
  return {
    narration: raw.narration,
    suggested_actions: raw.suggested_actions,
    dice_rolls: raw.dice_rolls,
    player_state_updates: raw.player_state_updates,
    encounter_state_updates: raw.encounter_state_updates,
    location_state_updates: raw.location_state_updates,
    encounter_complete: raw.encounter_complete,
    location_complete: raw.location_complete,
    gm_notes: raw.gm_notes ?? null
  };
}


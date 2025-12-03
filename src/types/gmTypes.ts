/**
 * TypeScript types for AI GM input/output
 * These types align with the schemas defined in docs/ai-gm-prompt-spec.txt
 */

// State types (inferred from the actual state structures)
export interface PlayerState {
  player_id: string;
  name: string;
  class_id: string;
  race_id: string;
  background_id: string;
  level: number;
  stats: {
    hp: number;
    pow: number;
    agi: number;
    mag: number;
    ins: number;
    chr: number;
  };
  max_hp?: number;
  abilities: Array<{
    id: string;
    name: string;
    description: string;
    uses_remaining?: number | null;
  }>;
  inventory: Array<{
    item_id: string;
    name: string;
    type: string;
  }>;
  status_effects: string[];
  flags: { [key: string]: boolean };
}

export interface EncounterState {
  encounter_id: string;
  has_intro_been_shown: boolean;
  turn_number: number;
  encounter_end_reason?: string | null;
  enemies: Array<{
    enemy_id: string;
    current_hp: number;
    status_effects: string[];
  }>;
  enemy_state: { [enemyId: string]: 'alive' | 'defeated' | 'tied_up' };
  npcs: Array<{
    npc_id: string;
    [key: string]: any;
  }>;
  npc_state: { [npcId: string]: 'present' | 'rescued' | 'missing' | 'dead' };
  objectives_state: { [objectiveId: string]: 'active' | 'completed' | 'failed' };
}

export interface LocationState {
  location_id: string;
  current_encounter_id: string;
  completed_encounters: string[];
  rewards_collected: boolean;
  visited_encounters: string[];
  location_flags: { [key: string]: boolean };
}

/**
 * GMInput - The structured input sent to the AI GM
 */
export interface GMInput {
  game_id: string;
  location_id: string;
  encounter_id: string;
  player_state: PlayerState;
  encounter_state: EncounterState;
  location_state: LocationState;
  location_data: any; // The current encounter definition from the JSON location file
  recent_history: Array<{
    speaker: 'player' | 'gm';
    text: string;
  }>;
  player_action: {
    raw_text: string;
    ability_id?: string | null;
    suggested_action_id?: string | null;
  };
  config?: {
    difficulty?: 'easy' | 'normal' | 'hard';
    max_narration_length?: number;
    use_mock?: boolean;
  };
}

/**
 * DiceRoll - Represents a single dice roll result
 */
export interface DiceRoll {
  skill_name: string;  // Required: one of "Strength", "Agility", "Magic", "Insight", "Charisma"
  roll: number;
  modifier: number;
  dc: number;
  total: number;
  outcome: 'success' | 'failure';
}

/**
 * GMOutput - The structured output from the AI GM
 * Must match the schema in docs/ai-gm-prompt-spec.txt
 */
export interface GMOutput {
  narration: string;
  suggested_actions: string[];
  
  dice_rolls?: DiceRoll | null;
  
  player_state_updates?: Partial<PlayerState>;
  encounter_state_updates?: Partial<EncounterState>;
  location_state_updates?: Partial<LocationState>;
  
  encounter_complete: boolean;
  location_complete: boolean;
  
  gm_notes?: string | null;
}


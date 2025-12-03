/**
 * EncounterState utilities
 * Handles initialization and updates to encounter state
 */

export function initializeEncounterState(encounter) {
  const enemyState = {};
  encounter.enemies.forEach(enemy => {
    enemyState[enemy.enemy_id] = 'alive';
  });

  const npcState = {};
  encounter.npcs.forEach(npc => {
    npcState[npc.npc_id] = 'present';
  });

  return {
    encounter_id: encounter.encounter_id,
    has_intro_been_shown: false,
    enemies: encounter.enemies.map(enemy => ({
      enemy_id: enemy.enemy_id,
      current_hp: enemy.stats.hp,
      status_effects: []
    })),
    enemy_state: enemyState,
    npcs: encounter.npcs.map(npc => ({
      npc_id: npc.npc_id,
      ...npc
    })),
    npc_state: npcState,
    objectives_state: encounter.objectives.reduce((acc, obj) => {
      acc[obj.id] = 'active';
      return acc;
    }, {}),
    turn_number: 1,
    encounter_end_reason: null
  };
}

export function mergeEncounterState(prev, updates) {
  if (!updates) return prev;
  const merged = { ...prev };

  if (updates.enemy_state) {
    merged.enemy_state = { ...prev.enemy_state, ...updates.enemy_state };
    // Ensure enemies array retains HP info from updates if provided
    if (updates.enemies) {
      merged.enemies = merged.enemies.map(enemy => {
        const incoming = updates.enemies.find(e => e.enemy_id === enemy.enemy_id);
        return incoming ? { ...enemy, ...incoming } : enemy;
      });
    }
  } else if (updates.enemies) {
    merged.enemies = merged.enemies.map(enemy => {
      const incoming = updates.enemies.find(e => e.enemy_id === enemy.enemy_id);
      return incoming ? { ...enemy, ...incoming } : enemy;
    });
  }

  if (updates.npc_state) {
    merged.npc_state = { ...prev.npc_state, ...updates.npc_state };
  }

  if (updates.npcs) {
    merged.npcs = merged.npcs.map(npc => {
      const incoming = updates.npcs.find(n => n.npc_id === npc.npc_id);
      return incoming ? { ...npc, ...incoming } : npc;
    });
  }

  if (updates.objectives_state) {
    merged.objectives_state = {
      ...prev.objectives_state,
      ...updates.objectives_state
    };
  }

  if (updates.has_intro_been_shown !== undefined) {
    merged.has_intro_been_shown = updates.has_intro_been_shown;
  }

  if (updates.turn_number !== undefined) {
    merged.turn_number = updates.turn_number;
  }

  if (updates.encounter_end_reason !== undefined) {
    merged.encounter_end_reason = updates.encounter_end_reason;
  }

  return merged;
}


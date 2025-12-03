/**
 * PlayerState utilities
 * Handles creation and updates to player state
 */

import classesData from '../data/classes.json';
import abilitiesData from '../data/abilities.json';

export function createPlayerState(characterData) {
  const { name, race_id, class_id, background_id = 'wanderer', selectedAbilities } = characterData;
  
  // Load class data to get base stats
  const classData = classesData.find(c => c.class_id === class_id);
  
  if (!classData) {
    throw new Error(`Class ${class_id} not found`);
  }

  // Create ability objects from selected ability IDs
  const classAbilities = abilitiesData[class_id] || {};
  
  const playerAbilities = selectedAbilities.map(abilityId => {
    const ability = classAbilities[abilityId];
    if (!ability) {
      throw new Error(`Ability ${abilityId} not found for class ${class_id}`);
    }
    return {
      id: ability.id,
      name: ability.name,
      description: ability.description
    };
  });

  // Store max HP for HP bar calculations
  const baseStats = { ...classData.base_stats };
  const maxHp = baseStats.hp;

  return {
    player_id: `player_${Date.now()}`,
    name,
    class_id,
    race_id,
    background_id,
    level: 1,
    stats: baseStats,
    max_hp: maxHp, // Store max HP for UI
    abilities: playerAbilities,
    inventory: [],
    status_effects: [],
    flags: {}
  };
}

export function updatePlayerState(currentState, changes) {
  const updated = { ...currentState };
  
  if (changes.hp_delta !== undefined) {
    updated.stats = { ...updated.stats };
    updated.stats.hp = Math.max(0, updated.stats.hp + changes.hp_delta);
  }
  
  if (changes.status_effects_added) {
    updated.status_effects = [...updated.status_effects, ...changes.status_effects_added];
  }
  
  if (changes.status_effects_removed) {
    updated.status_effects = updated.status_effects.filter(
      effect => !changes.status_effects_removed.includes(effect)
    );
  }

  if (changes.flags) {
    updated.flags = { ...updated.flags, ...changes.flags };
  }
  
  return updated;
}


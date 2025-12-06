/**
 * PlayerState utilities
 * Handles creation and updates to player state
 */

import classesData from '../data/classes.json';
import abilitiesData from '../data/abilities.json';

// Level 5 scaling configuration for each class
const CLASS_LEVEL5_CONFIG = {
  warrior: { level: 5, hpBonus: 15, powBonus: 2, agiBonus: 1, magBonus: 0, insBonus: 1, chrBonus: 0 },
  rogue:   { level: 5, hpBonus: 8,  powBonus: 0, agiBonus: 2, magBonus: 0, insBonus: 1, chrBonus: 1 },
  ranger:  { level: 5, hpBonus: 10, powBonus: 1, agiBonus: 1, magBonus: 0, insBonus: 2, chrBonus: 0 },
  mage:    { level: 5, hpBonus: 5,  powBonus: 0, agiBonus: 0, magBonus: 2, insBonus: 1, chrBonus: 1 },
  sorcerer:{ level: 5, hpBonus: 8,  powBonus: 1, agiBonus: 0, magBonus: 2, insBonus: 0, chrBonus: 1 },
  cleric:  { level: 5, hpBonus: 12, powBonus: 0, agiBonus: 0, magBonus: 1, insBonus: 2, chrBonus: 1 }
};

// Helper to get class by ID
function getClassById(classId) {
  return classesData.classes.find(c => c.id === classId);
}

// Helper to get ability by ID
function getAbilityById(id) {
  return abilitiesData.abilities.find(a => a.id === id);
}

// Apply level 5 scaling to base stats
function applyLevel5Scaling(baseStats, classId) {
  const cfg = CLASS_LEVEL5_CONFIG[classId];
  if (!cfg) return baseStats;

  return {
    hp:  (baseStats.hp  || 0) + cfg.hpBonus,
    pow: (baseStats.pow || 0) + cfg.powBonus,
    agi: (baseStats.agi || 0) + cfg.agiBonus,
    mag: (baseStats.mag || 0) + cfg.magBonus,
    ins: (baseStats.ins || 0) + cfg.insBonus,
    chr: (baseStats.chr || 0) + cfg.chrBonus
  };
}

export function createPlayerState(characterData) {
  const { name, race_id, class_id, background_id = 'wanderer' } = characterData;
  
  // Load class data
  const classDef = getClassById(class_id);
  
  if (!classDef) {
    throw new Error(`Class ${class_id} not found`);
  }

  // Compute base stats (starting from level 1 defaults)
  const baseStats = {
    hp: 10,
    pow: 1,
    agi: 1,
    mag: 1,
    ins: 1,
    chr: 1
  };

  // Apply level 5 scaling
  const scaledStats = applyLevel5Scaling(baseStats, class_id);

  // Load all abilities from class kit
  const abilityIds = [
    ...(classDef.starter_abilities || []),
    ...(classDef.mid_tier_abilities || []),
    classDef.signature_ability,
    classDef.passive_ability
  ].filter(Boolean);

  const abilities = abilityIds.map(id => {
    const ab = getAbilityById(id);
    if (!ab) {
      console.warn(`Ability ${id} not found`);
      return null;
    }
    return {
      id: ab.id,
      name: ab.name,
      description: ab.description,
      type: ab.type,
      isSignature: id === classDef.signature_ability,
      isPassive: id === classDef.passive_ability
    };
  }).filter(Boolean);

  // Load magic item
  const inventory = [];
  if (classDef.magic_item) {
    const item = getAbilityById(classDef.magic_item);
    if (item) {
      inventory.push({
        item_id: item.id,
        name: item.name,
        type: item.type || 'magic_item',
        description: item.description
      });
    }
  }

  // Store max HP for HP bar calculations
  const maxHp = scaledStats.hp;

  return {
    player_id: crypto.randomUUID ? crypto.randomUUID() : `player_${Date.now()}`,
    name,
    class_id,
    race_id,
    background_id,
    level: 5,
    stats: scaledStats,
    max_hp: maxHp,
    abilities,
    inventory,
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


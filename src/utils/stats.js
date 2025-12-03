/**
 * Stat name mapping utilities
 * Maps internal stat abbreviations to human-readable names
 */

export const STAT_NAME_MAP = {
  POW: "Strength",
  AGI: "Agility",
  MAG: "Magic",
  INS: "Insight",
  CHR: "Charisma"
};

/**
 * Converts a stat abbreviation to its full name
 * @param {string} statAbbr - The stat abbreviation (POW, AGI, MAG, INS, CHR)
 * @returns {string} - The full stat name, or the input if not found
 */
export function getStatName(statAbbr) {
  return STAT_NAME_MAP[statAbbr] || statAbbr;
}

/**
 * Valid stat names that the GM should use
 */
export const VALID_SKILL_NAMES = [
  "Strength",
  "Agility",
  "Magic",
  "Insight",
  "Charisma"
];



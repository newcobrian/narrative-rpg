/**
 * Maps skill names to generic reason phrases
 */
const SKILL_REASON_MAP = {
  "Insight": "searching for hidden details",
  "Perception": "noticing subtle clues",
  "Strength": "forcing something physically",
  "Agility": "moving carefully or quickly",
  "Magic": "shaping arcane forces",
  "Charisma": "influencing others"
};

/**
 * Gets a reason text for a skill check
 * @param {string | null} skillName - The skill name
 * @param {string | null} lastPlayerActionText - Optional player action text to use instead
 * @returns {string} - The reason text
 */
function getSkillReason(skillName, lastPlayerActionText) {
  if (lastPlayerActionText) {
    // Capitalize first letter and strip trailing periods
    const cleaned = lastPlayerActionText.trim().replace(/\.+$/, "");
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  if (!skillName) return "resolving your action";
  
  const key = skillName.trim();
  return SKILL_REASON_MAP[key] || "resolving your action";
}

/**
 * Message component for chat display
 * @param {Object} props
 * @param {'GM' | 'Player'} props.speaker
 * @param {string} props.text
 * @param {Object | null} [props.diceRolls] - Optional dice roll data (only for GM messages)
 * @param {string | null} [props.lastPlayerActionText] - The player action that triggered this GM response (only for GM messages with dice rolls)
 */
export default function Message({ speaker, text, diceRolls = null, lastPlayerActionText = null }) {
  const isGM = speaker === 'GM';
  const reasonText = isGM && diceRolls ? getSkillReason(diceRolls.skill_name, lastPlayerActionText) : null;
  
  return (
    <div className={`flex ${isGM ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] ${isGM ? '' : 'px-3 py-2 bg-[#2A2A2A] text-[#E5E5E5] border border-[#5A5A5A] rounded-md'}`}>
        <div className={`text-xs mb-1 ${isGM ? 'text-[#7A7A7A]' : 'text-[#7A7A7A]'}`}>
          {speaker}
        </div>
        
        {/* Render dice panel BEFORE narration for GM messages */}
        {isGM && diceRolls && (
          <div className="mb-3 p-3 rounded-lg bg-[#111111] border border-[#3A3A3A]">
            <div className="text-sm font-bold text-[#E5E5E5]">
              🎲 {diceRolls.skill_name || 'Skill'} Check ({reasonText})
            </div>
            <div className="text-xs text-[#7A7A7A] mt-1">
              DC {diceRolls.dc} (need {diceRolls.dc}+)
            </div>
            <div className="text-xs text-[#CFCFCF] mt-1">
              {diceRolls.modifier !== 0
                ? `Roll: ${diceRolls.roll} + ${diceRolls.modifier} (${diceRolls.skill_name || 'Skill'} bonus) = ${diceRolls.total} — ${diceRolls.outcome === 'success' ? 'Success!' : 'Failure.'}`
                : `Roll: ${diceRolls.roll} = ${diceRolls.total} — ${diceRolls.outcome === 'success' ? 'Success!' : 'Failure.'}`}
            </div>
          </div>
        )}
        
        <div className={`whitespace-pre-wrap font-sans ${isGM ? 'text-[#E5E5E5]' : 'text-[#E5E5E5]'}`}>
          {text}
        </div>
      </div>
    </div>
  );
}


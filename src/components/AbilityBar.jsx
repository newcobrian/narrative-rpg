import { useState } from 'react';

// Helper function to determine mana cost based on ability
function getManaCost(ability) {
  if (ability.type === 'passive' || ability.type === 'magic_item') {
    return null; // No mana cost for passives or magic items
  }

  // Magic-based abilities (mage, sorcerer, cleric)
  const magicAbilityIds = [
    'firebolt', 'arcane_shield', 'frostbind', 'spectral_hand', 'arcane_cataclysm',
    'chaos_bolt', 'draconic_shout', 'wild_surge', 'enchant_mind', 'prismatic_overload',
    'radiant_strike', 'healing_word', 'divine_barrier', 'sanctify', 'celestial_descent'
  ];

  if (ability.type === 'signature') {
    return 3; // Signature abilities cost 3 mana
  }

  if (magicAbilityIds.includes(ability.id)) {
    return 2; // Magic active abilities cost 2 mana
  }

  return null; // Physical abilities have no mana cost
}

export default function AbilityBar({ abilities, onAbilityClick }) {
  const [hoveredAbility, setHoveredAbility] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  if (!abilities || abilities.length === 0) return null;

  const handleMouseEnter = (ability, event) => {
    setHoveredAbility(ability);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleMouseLeave = () => {
    setHoveredAbility(null);
  };

  return (
    <div className="space-y-1 relative">
      <div className="text-xs text-[#E5E5E5] font-sans tracking-wider uppercase">
        ABILITIES
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {abilities.map(ability => {
          const manaCost = getManaCost(ability);
          return (
            <div key={ability.id} className="relative">
              <button
                onClick={() => onAbilityClick(ability)}
                onMouseEnter={(e) => handleMouseEnter(ability, e)}
                onMouseLeave={handleMouseLeave}
                className="px-3 py-2 bg-[#444444] text-[#FFFFFF] border-2 border-[#5A5A5A] hover:bg-[#555555] hover:scale-105 active:scale-95 active:translate-y-[1px] transition-all whitespace-nowrap text-xs font-bold tracking-wide uppercase cursor-pointer font-pixel shadow-inner"
              >
                {ability.name}
              </button>
              
              {hoveredAbility?.id === ability.id && (
                <div
                  className="fixed z-50 pointer-events-none"
                  style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                    transform: 'translate(-50%, -100%)',
                    marginTop: '-8px'
                  }}
                >
                  <div className="bg-[#0A0A0A] border-2 border-[#8BC6FF] p-3 max-w-xs shadow-[0_0_8px_rgba(139,198,255,0.5)]">
                    <div className="font-pixel text-xs text-[#8BC6FF] mb-2 uppercase tracking-wider">
                      {ability.name}
                    </div>
                    <div className="text-sm font-sans text-[#CFCFCF] mb-2">
                      {ability.description}
                    </div>
                    {manaCost !== null && (
                      <div className="border-t border-[#3A3A3A] pt-2 mt-2">
                        <div className="text-xs font-pixel text-[#7A7A7A] uppercase tracking-wider">
                          Mana Cost: <span className="text-[#8BC6FF]">{manaCost}</span>
                        </div>
                      </div>
                    )}
                    {manaCost === null && (ability.type === 'passive' || ability.type === 'magic_item') && (
                      <div className="border-t border-[#3A3A3A] pt-2 mt-2">
                        <div className="text-xs font-pixel text-[#7A7A7A] uppercase tracking-wider">
                          {ability.type === 'passive' ? 'Passive Ability' : 'Magic Item'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


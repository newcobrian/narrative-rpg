export default function AbilityBar({ abilities, onAbilityClick }) {
  if (!abilities || abilities.length === 0) return null;

  return (
    <div className="space-y-1">
      <div className="text-xs text-[#E5E5E5] font-sans tracking-wider uppercase">
        ABILITIES
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {abilities.map(ability => (
          <button
            key={ability.id}
            onClick={() => onAbilityClick(ability)}
            className="px-3 py-2 bg-[#444444] text-[#FFFFFF] border-2 border-[#5A5A5A] hover:bg-[#555555] hover:scale-105 active:scale-95 active:translate-y-[1px] transition-all whitespace-nowrap text-xs font-bold tracking-wide uppercase cursor-pointer font-pixel shadow-inner"
          >
            {ability.name}
          </button>
        ))}
      </div>
    </div>
  );
}


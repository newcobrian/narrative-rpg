export default function PlayerPanel({ playerState }) {
  if (!playerState) return null;

  const maxHp = playerState.max_hp || playerState.stats.hp;
  const currentHp = playerState.stats.hp;
  const hpPercentage = (currentHp / maxHp) * 100;
  const lostHpPercentage = 100 - hpPercentage;

  return (
    <div className="bg-[#0A0A0A] border-2 border-[#3A3A3A] overflow-hidden">
      <div className="bg-[#000000] px-3 py-2">
        <h3 className="text-sm font-semibold uppercase text-[#8BC6FF] font-pixel text-xs">{playerState.name}</h3>
      </div>
      <div className="px-3 py-2 text-sm text-[#E5E5E5] font-sans">
        <div className="mb-2 text-[#7A7A7A]">
          {playerState.race_id} {playerState.class_id}
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1 font-pixel text-[#E5E5E5]">
            <span>HP</span>
            <span>{currentHp} / {maxHp}</span>
          </div>
          <div className="w-full h-4 border-2 border-[#3A3A3A] relative">
            {/* Lost HP (red) */}
            {lostHpPercentage > 0 && (
          <div
                className="absolute top-0 right-0 h-full bg-[#BF616A] transition-all"
                style={{ width: `${Math.max(0, Math.min(100, lostHpPercentage))}%` }}
              />
            )}
            {/* Remaining HP (green) */}
            <div
              className="absolute top-0 left-0 h-full bg-[#A3BE8C] transition-all"
            style={{ width: `${Math.max(0, Math.min(100, hpPercentage))}%` }}
          />
        </div>
      </div>
      {playerState.status_effects.length > 0 && (
          <div className="text-xs text-[#7A7A7A] font-sans">
          Effects: {playerState.status_effects.join(', ')}
        </div>
      )}
      </div>
    </div>
  );
}


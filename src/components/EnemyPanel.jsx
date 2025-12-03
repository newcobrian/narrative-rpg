export default function EnemyPanel({ encounter, encounterState }) {
  if (!encounter || !encounterState) return null;

  // Check if this is a boss encounter
  const isBoss = encounter.encounter_id.includes('boss') || encounter.type === 'boss';

  return (
    <div className="bg-[#0A0A0A] border-2 border-[#3A3A3A] overflow-hidden">
      <div className="bg-[#000000] px-3 py-2">
        <h3 className="text-sm font-semibold uppercase font-pixel text-xs" style={{ color: isBoss ? '#8BC6FF' : '#FF4A4A' }}>
          {isBoss ? 'BOSS' : 'ENEMIES'}
        </h3>
      </div>
      <div className="px-3 py-2 space-y-3">
        {encounterState.enemies.map(enemyState => {
          const enemy = encounter.enemies.find(e => e.enemy_id === enemyState.enemy_id);
          if (!enemy) return null;
          
          const maxHp = enemy.stats.hp;
          const currentHp = enemyState.current_hp;
          const hpPercentage = (currentHp / maxHp) * 100;
          const lostHpPercentage = 100 - hpPercentage;

          return (
            <div key={enemyState.enemy_id} className="border-b-2 border-[#3A3A3A] pb-2 last:border-0">
              <div className={`font-pixel text-xs mb-1 ${isBoss ? 'text-[#8BC6FF]' : 'text-[#E5E5E5]'}`}>{enemy.name}</div>
              <div className="flex justify-between text-xs text-[#E5E5E5] mb-1 font-pixel">
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
              {enemyState.status_effects.length > 0 && (
                <div className="text-xs text-[#7A7A7A] mt-1 font-sans">
                  {enemyState.status_effects.join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


import { useGame } from '../state/gameContext';

export default function CompletionScreen({
  playerState: finalPlayerStateProp = null,
  locationState: finalLocationStateProp = null,
  onRestart
}) {
  const { location, playerState, resetGame } = useGame();
  const player = finalPlayerStateProp || playerState;
  const rewards = location?.base_rewards || { xp: 0, gold: 0, items: [] };

  const getItemName = (itemId) => {
    if (location?.encounters) {
      for (const encounter of location.encounters) {
        const encounterItem = encounter.items?.find(item => item.item_id === itemId);
        if (encounterItem) return encounterItem.name;
      }
    }
    return itemId.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000]">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-[#0A0A0A] border-2 border-[#3A3A3A] p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-pixel text-[#E5E5E5] mb-4">LOCATION COMPLETE!</h1>
            <p className="text-lg text-[#E5E5E5] font-sans">
              {location?.name || 'Location'} has been cleared.
            </p>
            {player && (
              <p className="text-sm text-[#CFCFCF] mt-2 font-sans">
                Well done, {player.name}!
              </p>
            )}
          </div>

          <div className="border-t-2 border-b-2 border-[#3A3A3A] py-6">
            <h2 className="text-xl font-pixel text-[#8BC6FF] mb-4 text-sm">REWARDS</h2>
            <div className="space-y-3 font-sans">
              <div className="flex justify-between text-[#E5E5E5]">
                <span>Experience:</span>
                <span className="font-semibold">{rewards.xp} XP</span>
              </div>
              <div className="flex justify-between text-[#E5E5E5]">
                <span>Gold:</span>
                <span className="font-semibold">{rewards.gold} gold</span>
              </div>
              {rewards.items.length > 0 && (
                <div>
                  <span className="text-[#E5E5E5]">Items:</span>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-[#E5E5E5]">
                    {rewards.items.map((itemId, idx) => (
                      <li key={idx}>
                        {getItemName(itemId)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onRestart || resetGame}
              className="px-6 py-4 bg-[#2A2A2A] text-[#E5E5E5] border-2 border-[#8BC6FF] hover:bg-[#3A3A3A] transition-colors font-pixel text-xs"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


import { useGame } from '../state/gameContext';

export default function StartScreen() {
  const { setCurrentScreen } = useGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000]">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-5xl font-pixel text-[#E5E5E5] mb-4">NARRATIVERPG</h1>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => setCurrentScreen('character')}
            className="px-8 py-4 bg-[#2A2A2A] text-[#E5E5E5] border-2 border-[#8BC6FF] hover:bg-[#3A3A3A] transition-colors text-sm font-pixel"
          >
            PLAY DEMO
          </button>
        </div>
        
        <p className="text-sm text-[#7A7A7A] font-sans mt-8">v0 Prototype</p>
      </div>
    </div>
  );
}


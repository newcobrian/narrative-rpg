import { GameProvider, useGame } from './state/gameContext';
import StartScreen from './screens/StartScreen';
import CharacterCreationScreen from './screens/CharacterCreationScreen';
import LocationSelectScreen from './screens/LocationSelectScreen';
import GameScreen from './screens/GameScreen';
import CompletionScreen from './screens/CompletionScreen';

function AppContent() {
  const {
    currentScreen,
    finalPlayerState,
    finalLocationState,
    restartGame,
    onLocationSelected,
    onBack
  } = useGame();

  switch (currentScreen) {
    case 'start':
      return <StartScreen />;
    case 'character':
      return <CharacterCreationScreen />;
    case 'locationSelect':
      return (
        <LocationSelectScreen
          onLocationSelected={onLocationSelected}
          onBack={onBack}
        />
      );
    case 'game':
      return <GameScreen />;
    case 'completion':
      return (
        <CompletionScreen
          playerState={finalPlayerState}
          locationState={finalLocationState}
          onRestart={restartGame}
        />
      );
    default:
      return <StartScreen />;
  }
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;


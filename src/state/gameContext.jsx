import { createContext, useContext, useState } from 'react';
import { createPlayerState, updatePlayerState } from './playerState';
import { initializeEncounterState, mergeEncounterState } from './encounterState';
import { initializeLocationState, getCurrentEncounter, getNextEncounterId, advanceToNextEncounter } from './locationState';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [playerState, setPlayerState] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationState, setLocationState] = useState(null);
  const [encounterState, setEncounterState] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [finalPlayerState, setFinalPlayerState] = useState(null);
  const [finalLocationState, setFinalLocationState] = useState(null);

  const createCharacter = (characterData) => {
    const newPlayerState = createPlayerState(characterData);
    setPlayerState(newPlayerState);
    setCurrentScreen('game');
  };

  const completeLocation = (finalPlayer, finalLocation) => {
    setFinalPlayerState(finalPlayer);
    setFinalLocationState(finalLocation);
    setCurrentScreen('completion');
  };

  const restartGame = () => {
    resetGame();
  };

  const loadLocation = async (locationData) => {
    setLocation(locationData);
    const newLocationState = initializeLocationState(locationData);
    setLocationState(newLocationState);
    
    const currentEncounter = getCurrentEncounter(locationData, newLocationState);
    if (currentEncounter) {
      const newEncounterState = initializeEncounterState(currentEncounter);
      setEncounterState(newEncounterState);
      
      // Add initial encounter description to message history
      setMessageHistory([{
        speaker: 'GM',
        text: currentEncounter.description,
        diceRolls: null,
        lastPlayerActionText: null
      }]);
    }
  };

  const mergeState = (prev, updates) => {
    if (!updates) return prev;
    const merged = { ...prev };
    Object.entries(updates).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        merged[key] = mergeState(prev?.[key] || {}, value);
      } else {
        merged[key] = value;
      }
    });
    return merged;
  };

  const updateGameState = (gmResponse, currentEncounterId, lastPlayerActionText = null) => {
    console.log('[GMResponse]', gmResponse);
    let nextPlayerState = playerState;
    if (gmResponse.player_state_updates) {
      setPlayerState(prev => {
        const merged = updatePlayerState(prev, gmResponse.player_state_updates);
        nextPlayerState = merged;
        return merged;
      });
    }

    let nextLocationState = locationState;
    setLocationState(prev => {
      const merged = gmResponse.location_state_updates ? mergeState(prev, gmResponse.location_state_updates) : prev;
      nextLocationState = merged;
      return merged;
    });

    let visitedEncounterToAdd = null;
    setEncounterState(prev => {
      const updated = mergeEncounterState(prev, gmResponse.encounter_state_updates);
      const introTriggered = !prev.has_intro_been_shown;
      if (introTriggered) {
        updated.has_intro_been_shown = true;
        visitedEncounterToAdd = updated.encounter_id;
      }
      if (!gmResponse.encounter_complete) {
        updated.turn_number = (prev.turn_number || 1) + 1;
      }
      return updated;
    });

    if (visitedEncounterToAdd && nextLocationState) {
      setLocationState(prev => ({
        ...prev,
        visited_encounters: [...new Set([...prev.visited_encounters, visitedEncounterToAdd])]
      }));
    }

    if (gmResponse.narration) {
      setMessageHistory(prev => [...prev, {
        speaker: 'GM',
        text: gmResponse.narration,
        diceRolls: gmResponse.dice_rolls || null,
        lastPlayerActionText: lastPlayerActionText || null
      }]);
    } else {
      console.warn('⚠️ GM response received but no narration field:', gmResponse);
      setMessageHistory(prev => [...prev, {
        speaker: 'GM',
        text: '...',
        diceRolls: null,
        lastPlayerActionText: null
      }]);
    }

    const isBossEncounter =
      location &&
      currentEncounterId === location.boss_encounter_id;

    const shouldForceLocationComplete =
      gmResponse.encounter_complete && isBossEncounter;

    if ((gmResponse.location_complete || shouldForceLocationComplete) && typeof completeLocation === 'function') {
      completeLocation(
        nextPlayerState ?? playerState,
        nextLocationState ?? locationState
      );
      return;
    }

    if (gmResponse.encounter_complete) {
      setLocationState(prev => {
        const baseState = nextLocationState || prev;
        const nextEncounterId = getNextEncounterId(location, baseState.current_encounter_id);

        if (nextEncounterId) {
          const updatedState = advanceToNextEncounter(baseState, nextEncounterId);
          const nextEncounter = location.encounters.find(e => e.encounter_id === nextEncounterId);
          if (nextEncounter) {
            setEncounterState(initializeEncounterState(nextEncounter));
            setMessageHistory(prevHistory => [...prevHistory, {
              speaker: 'GM',
              text: nextEncounter.description,
              diceRolls: null,
              lastPlayerActionText: null
            }]);
          }
          nextLocationState = updatedState;
          return updatedState;
        }

        return baseState;
      });
    }
  };

  const addPlayerMessage = (text) => {
    setMessageHistory(prev => [...prev, {
      speaker: 'Player',
      text
    }]);
  };

  const resetGame = () => {
    setCurrentScreen('start');
    setPlayerState(null);
    setLocation(null);
    setLocationState(null);
    setEncounterState(null);
    setMessageHistory([]);
    setFinalPlayerState(null);
    setFinalLocationState(null);
  };

  return (
    <GameContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      playerState,
      finalPlayerState,
      location,
      locationState,
      finalLocationState,
      encounterState,
      messageHistory,
      createCharacter,
      loadLocation,
      updateGameState,
      addPlayerMessage,
      resetGame,
      completeLocation,
      restartGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}


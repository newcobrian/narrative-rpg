import { useState } from 'react';
import { useGame } from '../state/gameContext';
import { getCurrentEncounter } from '../state/locationState';
import { callAIGM, buildGMInput } from '../llm/aiGMCall';
import ChatWindow from '../components/ChatWindow';
import ActionInput from '../components/ActionInput';
import AbilityBar from '../components/AbilityBar';
import SuggestedActions from '../components/SuggestedActions';
import PlayerPanel from '../components/PlayerPanel';
import EnemyPanel from '../components/EnemyPanel';
import ObjectivePanel from '../components/ObjectivePanel';
import InventoryPanel from '../components/InventoryPanel';

export default function GameScreen() {
  const {
    playerState,
    location,
    locationState,
    encounterState,
    messageHistory,
    updateGameState,
    addPlayerMessage
  } = useGame();

  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState([]);

  const currentEncounter = location && locationState 
    ? getCurrentEncounter(location, locationState)
    : null;

  const handleAction = async (actionText, actionMeta = {}) => {
    if (isProcessing || !playerState || !location || !currentEncounter || !encounterState) {
      return;
    }

    setIsProcessing(true);
    addPlayerMessage(actionText);

    try {
      const input = buildGMInput({
        location,
        currentEncounter,
        playerState,
        encounterState,
        locationState,
        messageHistory,
        playerAction: {
          raw_text: actionText,
          meta: actionMeta
        }
      });

      const gmResponse = await callAIGM(input);
      if (!gmResponse) {
        console.error('❌ Empty response from AI GM');
        addPlayerMessage('The Game Master did not respond. Please try again.');
        return;
      }

      setSuggestedActions(gmResponse.suggested_actions || []);
      updateGameState(gmResponse, currentEncounter.encounter_id, actionText);
    } catch (error) {
      console.error('Error calling AI GM:', error);
      addPlayerMessage('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!playerState || !location || !currentEncounter || !encounterState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000]">
        <div className="text-center">
          <p className="text-[#E5E5E5] font-sans">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#000000]">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Window - Left Column */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatWindow messages={messageHistory} />
        </div>

        {/* Status Panels - Right Column */}
        <div className="w-64 flex flex-col gap-4 p-4 overflow-y-auto bg-[#000000]">
          <PlayerPanel playerState={playerState} />
          <EnemyPanel encounter={currentEncounter} encounterState={encounterState} />
          {/* ObjectivePanel hidden for NES theme */}
          {/* <ObjectivePanel encounter={currentEncounter} encounterState={encounterState} /> */}
          <InventoryPanel inventory={playerState.inventory} />
        </div>
      </div>

      {/* Action Input Area - Bottom */}
      <div className="border-t-2 border-[#3A3A3A] bg-[#0A0A0A] p-4 space-y-2">
        <SuggestedActions actions={suggestedActions} onActionClick={(action) => handleAction(action, { suggested_action_id: action })} />
        <AbilityBar 
          abilities={playerState.abilities} 
          onAbilityClick={(ability) => handleAction(`Use ${ability.name}`, { ability_id: ability.id })}
        />
        <ActionInput onSubmit={handleAction} disabled={isProcessing} />
        {isProcessing && (
          <p className="text-sm text-[#E5E5E5] text-center font-sans">Processing...</p>
        )}
      </div>
    </div>
  );
}


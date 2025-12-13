import { useState, useEffect, useRef } from 'react';
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
    addPlayerMessage,
    markBriefAsShown
  } = useGame();

  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState([]);
  const [isStatusDrawerOpen, setIsStatusDrawerOpen] = useState(false);
  const [isAbilitiesExpanded, setIsAbilitiesExpanded] = useState(false);

  const currentEncounter = location && locationState 
    ? getCurrentEncounter(location, locationState)
    : null;

  // Track which encounter we've already auto-started, to avoid double-firing in StrictMode
  const introFiredRef = useRef(null);

  const handleAction = async (actionText, actionMeta = {}) => {
    if (isProcessing || !playerState || !location || !currentEncounter || !encounterState) {
      return;
    }

    setIsProcessing(true);
    addPlayerMessage(actionText, actionMeta);

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

  // Auto-fire the first GM turn when a new encounter starts
  useEffect(() => {
    if (!currentEncounter || !encounterState) return;

    const encounterKey = currentEncounter.encounter_id;

    // If we've already fired for this encounter, do nothing
    if (introFiredRef.current === encounterKey) return;

    const firstTurn =
      (!encounterState.turn_number ||
        encounterState.turn_number === 0 ||
        encounterState.turn_number === 1) &&
      !encounterState.has_intro_been_shown;

    if (!firstTurn) return;

    // Mark this encounter as started so StrictMode double-run doesn't duplicate it
    introFiredRef.current = encounterKey;

    // Synthetic first action to let the GM do character intro + scene
    handleAction(
      "step into the area and take in your surroundings",
      { system_init: true }
    );
    // We rely on the GM prompt + encounter_state_updates.has_intro_been_shown
    // to prevent repeating this intro.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentEncounter?.encounter_id,
    encounterState?.turn_number,
    encounterState?.has_intro_been_shown
  ]);

  if (!playerState || !location || !currentEncounter || !encounterState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000]">
        <div className="text-center">
          <p className="text-[#E5E5E5] font-sans">Loading game...</p>
        </div>
      </div>
    );
  }

  // Check if we should show the encounter brief
  const shouldShowBrief = 
    location?.intro_brief && 
    locationState?.has_brief_been_shown === false;

  const handleDismissBrief = () => {
    markBriefAsShown();
  };

  const handleCloseStatusDrawer = () => {
    setIsStatusDrawerOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-[#000000]">
      {/* Encounter Brief Modal */}
      {shouldShowBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-[#0A0A0A] border-2 border-[#3A3A3A] max-w-2xl w-full mx-4 p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold uppercase text-[#8BC6FF] font-pixel mb-4">
                {location.intro_brief.title}
              </h2>
              <div className="text-[#E5E5E5] font-sans whitespace-pre-line leading-relaxed">
                {location.intro_brief.narrative}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleDismissBrief}
                className="px-6 py-2 bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#E5E5E5] font-sans border-2 border-[#3A3A3A] uppercase font-semibold transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Button - Mobile Only */}
      <div className="md:hidden fixed top-4 right-4 z-40">
        <button
          onClick={() => setIsStatusDrawerOpen(true)}
          className="px-4 py-2 bg-[#0A0A0A] border-2 border-[#3A3A3A] text-[#E5E5E5] font-sans uppercase font-semibold text-sm"
        >
          Status
        </button>
      </div>

      {/* Status Drawer - Mobile Only */}
      {isStatusDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60"
            onClick={handleCloseStatusDrawer}
          />
          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#000000] border-l-2 border-[#3A3A3A] overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Close button */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-pixel uppercase text-[#8BC6FF]">Status</h3>
                <button
                  onClick={handleCloseStatusDrawer}
                  className="px-3 py-1 bg-[#3A3A3A] text-[#E5E5E5] font-sans text-sm uppercase"
                >
                  Close
                </button>
              </div>
              {/* Status Panels */}
              <PlayerPanel playerState={playerState} />
              <EnemyPanel encounter={currentEncounter} encounterState={encounterState} />
              <InventoryPanel inventory={playerState.inventory} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Chat Window - Full width on mobile, flex-1 on desktop */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatWindow messages={messageHistory} />
        </div>

        {/* Status Panels - Right Column - Desktop Only */}
        <div className="hidden md:flex w-64 flex-col gap-4 p-4 overflow-y-auto bg-[#000000]">
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
        
        {/* Abilities - Desktop: always visible, Mobile: collapsible */}
        {/* Mobile: Toggle button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsAbilitiesExpanded(!isAbilitiesExpanded)}
            className="w-full px-4 py-2 bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#E5E5E5] font-sans border-2 border-[#3A3A3A] uppercase font-semibold text-sm transition-colors flex items-center justify-between"
          >
            <span>Abilities</span>
            <span className="text-xs">{isAbilitiesExpanded ? '▼' : '▶'}</span>
          </button>
        </div>
        {/* Abilities content - visible on desktop, conditionally on mobile */}
        {isAbilitiesExpanded && (
          <div className="md:hidden mt-2">
            <AbilityBar 
              abilities={playerState.abilities} 
              onAbilityClick={(ability) => handleAction(`Use ${ability.name}`, { ability_id: ability.id })}
            />
          </div>
        )}
        {/* Desktop: always show */}
        <div className="hidden md:block">
          <AbilityBar 
            abilities={playerState.abilities} 
            onAbilityClick={(ability) => handleAction(`Use ${ability.name}`, { ability_id: ability.id })}
          />
        </div>

        <ActionInput onSubmit={handleAction} disabled={isProcessing} />
        {isProcessing && (
          <p className="text-sm text-[#E5E5E5] text-center font-sans">Processing...</p>
        )}
      </div>
    </div>
  );
}


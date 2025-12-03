/**
 * LocationState utilities
 * Handles location flow and progression
 */

export function initializeLocationState(location) {
  return {
    location_id: location.location_id,
    current_encounter_id: location.entry_encounter_id,
    completed_encounters: [],
    rewards_collected: false,
    visited_encounters: [location.entry_encounter_id],
    location_flags: {}
  };
}

export function getCurrentEncounter(location, locationState) {
  return location.encounters.find(
    enc => enc.encounter_id === locationState.current_encounter_id
  );
}

export function getNextEncounterId(location, currentEncounterId) {
  const flowEntry = location.flow.find(f => f.from === currentEncounterId);
  return flowEntry ? flowEntry.to : null;
}

export function advanceToNextEncounter(locationState, nextEncounterId) {
  return {
    ...locationState,
    current_encounter_id: nextEncounterId,
    completed_encounters: [...locationState.completed_encounters, locationState.current_encounter_id],
    visited_encounters: [...new Set([...locationState.visited_encounters, nextEncounterId])]
  };
}


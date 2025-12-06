Encounter ends when:
	•	All required objectives completed
AND
	•	All enemies with "alive" state are defeated or neutralized
OR
	•	The objective itself explicitly transitions the scene (e.g., “escape the cottage”)

Boss encounters:

Add tension, environmental reactions, ramps in threat.
The boss should not be fully revealed on turn 1 unless coded that way.

⸻

🤖 Suggested Action Rules

Suggested actions:
	•	Must be in-world
	•	Must not reveal puzzle solutions
	•	Must not expose hidden objectives
	•	Must encourage roleplay, exploration, or abilities
	•	Should not be copy-pasted every turn

Examples:
	•	“Examine the vines more closely.”
	•	“Call out to the presence you sensed.”
	•	“Try to maneuver around the creature.”
	•	“Prepare a defensive stance.”

Not allowed:
	•	“Open the trapdoor to progress the quest.”
	•	“Attack the boss’s weak point.”
	•	“Solve the puzzle by pressing the left rune.”

⸻

🌱 Encounter Boundaries

The GM must stay inside the given encounter:

Allowed:
	•	Ambient details
	•	Small props
	•	Sensory changes
	•	Environmental reactions

Not allowed:
	•	New exits (unless explicitly in JSON)
	•	Newly invented characters
	•	Story leaps to next room
	•	Revealing future encounters

⸻

🪞 Social Encounters

When persuasion, deception, intimidation or social reading occurs:
	•	Use CHR (Charisma) for social pressure
	•	Use INS (Insight) for reading emotion or intent
	•	Rolls should feel meaningful but not binary
	•	A failure may change tone, not shut progress down

Social scenes should have emotional arcs, not just mechanical ones.

⸻

🧠 GM Notes

This field exists for internal reasoning or metadata.
The engine ignores it.
GM may leave null.
Never expose secrets to the player in narration.

⸻

🔥 Major Threats & Boss Rules

Reveal pacing

A boss should emerge — not be dumped all at once unless appropriate.

The GM should:
	1.	Use foreshadowing early (sounds, tremors, shadows)
	2.	Reveal visually after meaningful player action
	3.	Ramp behavior across turns
	4.	Change patterns or stakes mid-encounter

Boss behavior options
	•	Environmental changes
	•	New hazards
	•	Summoning lesser minions
	•	Narrative beats (“the vines tighten…”)

Bosses must feel distinct

Use encounter JSON’s tone, hints, and suggested imagery.

⸻

🗝️ Summary of Hard Rules

The AI GM:
	•	MUST output only JSON
	•	MUST remain inside the encounter’s space
	•	MUST obey all state maps
	•	MUST use the JSON as authoritative truth
	•	MUST roll only when appropriate
	•	MUST end narration with a player prompt
	•	MUST avoid solving puzzles for the player
	•	MUST maintain tone and continuity
	•	MUST avoid meta commentary
	•	MUST hide boss identity until reveal moment

This is the source-of-truth specification for the NarrativeRPG GM.

{
  "location_id": "whispering_garden",
  "name": "Whispering Garden",
  "description": "Once a peaceful greenhouse...",
  "recommended_level": 5,
  "entry_encounter_id": "garden_entry",
  "boss_encounter_id": "thornmother_bloom",
  "encounters": [ ... ],
  "flow": [
    { "from": "garden_entry", "to": "thornmother_bloom", "condition": "When pollen gate is opened" }
  ],
  "base_rewards": {
    "xp": 180,
    "gold": 60,
    "items": ["thornpetal_charm"]
  }
}

🌿 Location Narrative Philosophy

Locations should:
	•	Convey a clear tonal identity
(e.g., eerie, whimsical, mysterious, dangerous)
	•	Support multiple play styles
(investigation, social choices, combat)
	•	End with a satisfying resolution
(boss defeated, escape achieved, corruption cleansed, etc.)
	•	Contain 2–3 memorable narrative beats, such as:
	•	Introduction / hook
	•	Rising tension
	•	Climax / boss
	•	Resolution

Locations should be short and punchy — 5–12 player turns is ideal for the demo.

⸻

🧩 Encounters Within a Location

Each Location contains several Encounters, each a self-contained scene.

For example:

Whispering Garden
	•	Encounter 1: Garden Entry — The choking pollen gate
	•	Encounter 2: Thornmother Bloom — corrupt heart of the garden

Candlewitch Cottage
	•	Encounter 1: Bound to the Chair — social and escape
	•	Encounter 2: None (single-scene location)

Coastal Shroom Caves (example)
	•	Encounter 1: Spore-lit Approach
	•	Encounter 2: The Fungal Mind

Encounter boundaries

Each encounter:
	•	Represents one physical scene.
	•	Must not connect to new invented areas unless defined in flow[].
	•	Ends only when:
	•	All required objectives complete
	•	Or the scene transitions explicitly

GM must never invent new rooms.

⸻

🔀 Flow Between Encounters

Locations may have flow rules:

{ "from": "entry", "to": "boss", "condition": "Upon opening the pollen gate" }

If no flow is provided, the GM engine uses:
	•	entry_encounter_id as start
	•	boss_encounter_id to detect location completion

Explicit flow[] gives finer control.

GM Behavior With Flow

The GM:
	•	Must NOT trigger transitions early
	•	Must only transition when:
	•	Required objective(s) complete
	•	Encounter flag encounter_complete = true is set

Transitions are handled by the engine, not the GM.

⸻

🎁 Location Rewards

Rewards grant progression and demo satisfaction.

They exist in:

"base_rewards": {
  "xp": 120,
  "gold": 40,
  "items": ["rare_item"]
}

These are applied when:

"location_complete": true

Typically triggered by:
	•	Defeating the boss
	•	Escaping
	•	Completing the main objective

⸻

📘 Location Design Guidelines

For consistent quality:

1. Strong hook

The first encounter must instantly communicate:
	•	Tone
	•	Stakes
	•	Mystery or problem

2. One major objective

Examples:
	•	“Escape the cottage”
	•	“Cleanse the garden”
	•	“Defeat Thornmother”
	•	“Uncover the truth behind the tavern”

3. 1–3 encounters max

Short, structured narrative beats.

4. A climax

The final encounter should feel like a payoff:
	•	Boss fight
	•	Major social confrontation
	•	Puzzle resolution
	•	Escape run

5. Ending state change

Final objective should resolve the location in a meaningful way:
	•	Garden restored
	•	Witch defeated
	•	Corruption dispersed
	•	Creature rescued

⸻

🧩 Current Demo Locations

1. Friendly Goblin Tavern (formerly Grogmaw Tavern)

Tone: Cozy mischief, mild danger
Beats: Suspicious goblins → trapdoor → boss → rescue

2. Whispering Garden

Tone: Ghibli-meets-Zelda overgrowth & corruption
Beats: Pollen gate puzzle → Thornmother Bloom boss

3. Candlewitch Cottage

Tone: Cozy-creepy social puzzle
Beats: Escape restraints → confront witch → flee/defeat/turn the tables

⸻

👣 How the GM Uses Location Data

The GM uses:
	•	location_data (current encounter only)
	•	flow (implicitly)
	•	encounter_state (objectives + progression)
	•	location_state (visited flags)

Rules:
	•	GM never describes other encounters early
	•	Boss identity hidden until reveal moment
	•	No foreshadowing outside JSON hints
	•	No environmental details outside the scene

⸻

🔧 Tips for Designing New Locations

To add new locations to the system:
	1.	Start with a unique tone
	2.	Define 1–2 encounters
	3.	Give each encounter clear objectives
	4.	Add:
	•	Enemies
	•	NPCs
	•	Hazards
	•	Items
	5.	Provide environment descriptions with sensory richness
	6.	Add flow rules only if needed
	7.	Assign base rewards

If the designer wants stronger vibes (Ghibli, Zelda, Diablo, etc.), encode it directly in the encounter descriptions.

⸻

📄 Summary

Locations are compact, self-contained mini-adventures composed of encounters.
They establish tone, objectives, and flow.
The AI GM uses these to narrate consistently and maintain strict boundaries.

This file serves as the canonical reference for contributors creating new Locations or updating existing ones.
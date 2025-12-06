Encounter & Location JSON Format

NarrativeRPG uses a structured JSON format to define all playable content.
Each Location consists of one or more Encounters, with a defined flow between them.

This document explains:
	•	How Locations are structured
	•	How Encounters are structured
	•	What fields the AI GM relies on
	•	Best practices for writing new encounters

Use this as the reference when creating new content.

⸻

📍 Location JSON Structure

A Location is a container for multiple Encounters and the flow between them.

Example high-level structure:
{
  "location_id": "whispering_garden",
  "name": "Whispering Garden",
  "region": "Moonshade Valley",
  "biome": "enchanted_garden",
  "recommended_level": 5,
  "max_players": 1,
  "scaling_mode": "fixed",
  "description": "A moonlit garden overtaken by bioluminescent vines and drifting pollen.",
  
  "narration_profile": { ... },

  "entry_encounter_id": "garden_gate",
  "boss_encounter_id": "thornmother_heart",
  
  "encounters": [ ... ],

  "flow": [
    { "from": "garden_gate", "to": "thornmother_heart", "condition": "Objective completed" },
    { "from": "thornmother_heart", "to": "end", "condition": "Boss defeated" }
  ],

  "base_rewards": {
    "xp": 150,
    "gold": 50,
    "items": [ "thornmother_petalmask" ]
  }
}


⸻

🎭 Narration Profile (Optional but Recommended)

This gently steers the GM’s tone in this location.

"narration_profile": {
  "tone_tags": ["ghibli", "whimsical", "soft eeriness"],
  "energy": "calm, atmospheric, gradual tension build",
  "focus": "nature imagery, light, whispers, emotional nuance",
  "avoid": ["slapstick humor", "high fantasy bombast"]
}

The AI uses this to apply location-specific personality without breaking global rules.

⸻

⚔️ Encounter Format

Each encounter is one scene in the game.

A Location may contain 1–3 encounters.

⸻

Encounter Schema

{
  "encounter_id": "garden_gate",
  "title": "The Moonlit Threshold",
  "type": "exploration", 
  "difficulty": "normal",
  "description": "Pollen drifts like gold dust across a winding garden path...",

  "narration_profile": { ... }, // Optional override

  "environment": {
    "location_hint": "overgrown garden path",
    "lighting": "bioluminescent glow",
    "terrain": "twisting roots, drifting pollen"
  },

  "objectives": [
    {
      "id": "breach_gate",
      "description": "Open or bypass the vine-woven gate.",
      "required": true
    }
  ],

  "enemies": [
    {
      "enemy_id": "vinebound_guardian",
      "name": "Vinebound Guardian",
      "description": "A humanoid shape formed entirely of vines.",
      "is_boss": false,
      "stats": { "hp": 12, "pow": 2, "agi": 1, "mag": 1, "ins": 1, "chr": 0 },
      "abilities": ["Root Slam", "Entangle"],
      "behavior": "Defends the gate; reacts when the player forces passage."
    }
  ],

  "npcs": [
    {
      "npc_id": "flutterbloom",
      "name": "Flutterbloom Sprite",
      "role": "hint_giver",
      "description": "A tiny sprite made of petals and light."
    }
  ],

  "hazards": [
    "pollen_choke",
    "stranglevines"
  ],

  "items": [
    {
      "item_id": "lumendust",
      "name": "Lumendust",
      "description": "A faintly glowing powder shed from flowers.",
      "type": "consumable",
      "effect": "Slight boost to visibility."
    }
  ]
}


⸻

🧩 Encounter Fields Explained

encounter_id

Unique string.
Used in location flow and state.

title

Narrative label for UI and GM introduction.

type

One of:
	•	exploration
	•	social
	•	combat
	•	puzzle
	•	mixed

This teaches the GM what tone to expect.

difficulty

Used by the GM to pick DCs.
	•	easy
	•	normal
	•	challenging
	•	boss

description

The intro text for the first time the encounter loads.
Should set the scene vividly but not spoil solutions.

environment

Atmospheric cues the GM uses to flavor narration.

objectives[]

Each has:
	•	id — unique key
	•	description
	•	required: true/false

The encounter ends when all required objectives are completed AND all living enemies are neutralized (unless the encounter is non-combat).

enemies[]

Defines enemies with:
	•	Stats
	•	Abilities
	•	Behavior notes
	•	Optional is_boss: true

npcs[]

Use sparingly.
Attributes:
	•	npc_id
	•	name
	•	role
	•	description

hazards[]

Environmental dangers the GM may use to create tension.

items[]

Things found in the environment — not loot drops (those belong in base_rewards or enemy drops).

⸻

🔁 Location Flow

The flow array determines progression:

"flow": [
  { "from": "gate", "to": "inner_grove", "condition": "Objective completed" },
  { "from": "inner_grove", "to": "boss_heart", "condition": "When GM flags encounter_complete" }
]

The GM cannot progress encounters without the engine switching them.

⸻

📐 Best Practices for Writing Encounters

1. One encounter = one confined space

The GM is not allowed to invent new rooms, tunnels, or floors.

Keep it tightly scoped.

⸻

2. Avoid solution reveal

Do not write:
	•	“Find the switch under the rock”
	•	“You must free the spirit to open the gate”

Give flavor, not answers.

⸻

3. Tone belongs in narration_profile

Let JSON teach the GM the vibe instead of embedding it into the description.

⸻

4. Keep enemy abilities simple

Abilities should be narrative-driven, not numerical.

Examples:
	•	“Root Slam — knocks the player back”
	•	“Fungal Burst — blinds vision temporarily”

⸻

5. Include at least one interactive element

Things the player can:
	•	Break
	•	Lift
	•	Investigate
	•	Speak to
	•	Bargain with
	•	Disarm
	•	Channel magic through

This is key for freeform play.

⸻

6. Keep objectives minimal

1–2 required objectives work best.

⸻

🧪 A Minimal Encounter Template

Here’s a bare template you can copy:

{
  "encounter_id": "...",
  "title": "...",
  "type": "exploration",
  "difficulty": "normal",
  "description": "...",
  "environment": { "location_hint": "...", "lighting": "...", "terrain": "..." },
  "objectives": [
    { "id": "main_goal", "description": "...", "required": true }
  ],
  "enemies": [],
  "npcs": [],
  "hazards": [],
  "items": []
}


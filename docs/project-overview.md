# NarrativeRPG — Project Overview



NarrativeRPG is a lightweight, AI-driven fantasy RPG prototype designed to test whether AI-as-GM can deliver a fun, replayable, choice-driven experience inside a simple turn-based structure.



Players create a character, choose an encounter, and then play freely using natural language while the AI GM handles narration, dice rolls, state updates, enemy logic, and encounter completion.



This document provides a high-level understanding of the system: what the demo includes, how it works, and where to modify or extend it.



---



## 🎯 Demo Goals



The purpose of this demo is to validate:



- Whether freeform play with a structured AI GM feels fun and responsive  

- Whether encounters can have distinct tones, mechanics, and personalities  

- Whether abilities + dice rolls + state-driven outcomes create meaningful gameplay  

- Whether onboarding (character creation, encounter selection) feels smooth  

- Whether the architecture supports extensibility for future features (co-op, campaigns)



The demo is intentionally small—three encounters, one character build flow, and a handful of core rules—but built on top of a scalable, rules-driven engine.



---



## 🧱 Core Concepts



### **1. AI GM**

The AI GM is a model instructed via a structured system prompt plus a GMInput JSON schema.  

It must output GMOutput, which includes narration, suggested actions, dice rolls, and state updates.



The GM:

- Does not invent new spaces or NPCs  

- Must stay within defined encounter/location data  

- Uses dice checks for risky actions  

- Follows tone & narration structure rules  

- Ends each narration with an action prompt



---



### **2. Encounters**

Each encounter is a self-contained location with:



- Premise & tone  

- Environmental details  

- Enemies / NPCs  

- Objectives  

- Optional narration flavor overrides  

- State-driven progression handled by the GM  



Demo encounters:



| Encounter | Description | Tone |

|----------|-------------|------|

| **Tavern Starter (renamed later)** | A goblin-filled tavern with secrets beneath the floorboards | Light, playful |

| **Whispering Garden** | A bioluminescent moonlit garden and the corrupted guardian "Thornmother" | Ghibli × Zelda mystical |

| **Candlewitch Cottage** | You wake up bound; escape or outwit the cozy, creepy witch "Nana Wick" | Fairytale-creepy |



---



## 🧬 Structured Game State



### **Player State**

- Race, class, stats  

- Level 5 ability kit  

- Signature + passive + magic item  

- Inventory  

- HP tracking  



### **Encounter State**

- Intro shown flag  

- Turn counter  

- Enemy/NPC state  

- Objective completion  

- Progression markers  



### **Location State**

- Encounter visitation  

- Environmental shifts  



The GM updates state via partial updates in GMOutput.



---



## 🎲 Dice Mechanics



Uncertain actions use a d20 check:



- `roll + modifier >= DC` → success  

- GM chooses the DC (easy 5–10, medium 11–14, hard 15–18, heroic 20+)  

- UI displays result with breakdown and reason  



---



## 🧠 Suggested Actions & Abilities



Suggested Actions:

- Short prompts to inspire player choice  

- Never reveal solutions  

- Change dynamically based on state



Abilities:

- Used through UI or typed actions  

- GM interprets them narratively  

- Designed to give each class a unique playstyle



---



## 🖥️ User Flow



1. **Start Screen → Character Creation**  

2. **Race Select → Class Select**  

3. **Encounter Select**  

4. **Gameplay**  

5. **Completion Screen**  



---



## 🗺️ Architecture Snapshot



- **Frontend:** React (Vite) + Tailwind  

- **State:** React Context  

- **Backend:** Vercel Serverless Function `/api/gm`  

- **AI:** OpenAI Responses API  

- **Data:** JSON files for encounters, classes, races, abilities  



Key files:



| File | Role |

|------|------|

| `src/llm/prompts.js` | Core GM rules |

| `src/llm/aiGMCall.js` | Calls GM + validates output |

| `api/gm.js` | Serverless OpenAI proxy |

| `src/state/playerState.js` | Level 5 player creation |

| `src/state/gameContext.jsx` | State merging, encounter progression |

| `src/screens/GameScreen.jsx` | Main gameplay UI |



---



## 🌱 Future Expansion



This architecture supports:



- Co-op characters  

- Campaigns & persistent worlds  

- Shops, inventory, crafting  

- Class builds & leveling  

- Encounter chains  

- Visual enhancements  



---



## 📂 Extending the System



If modifying or extending the game, start with these:



1. `prompts.js` → how the GM thinks  

2. Encounter JSONs → the playable content  

3. `updateGameState` → how GM output affects the world  



Once these are understood, you can safely build new features, encounters, abilities, and UX.

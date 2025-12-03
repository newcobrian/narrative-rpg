# NarrativeRPG v0 Prototype

An AI-driven fantasy RPG with an AI Game Master, built with React + Vite + Tailwind.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## Using the Real OpenAI API (Optional)

By default, the game uses smart mocked responses that work without an API key. To use the real OpenAI API:

1. **Get an OpenAI API key:**
   - Visit https://platform.openai.com/api-keys
   - Create a new API key

2. **Create a `.env` file in the project root:**
   ```env
   VITE_OPENAI_API_KEY=your_api_key_here
   VITE_OPENAI_MODEL=gpt-4o
   ```

3. **Restart the dev server:**
   The game will automatically use the OpenAI API if the key is set.

**⚠️ Security Note:** The OpenAI SDK requires `dangerouslyAllowBrowser: true` for browser usage. This means your API key will be exposed in the client-side bundle. Make sure:
- Your `.env` file is in `.gitignore` (already configured)
- Never commit your API key to version control
- Consider using API key restrictions in your OpenAI account settings
- For production, use a backend proxy instead of calling OpenAI directly from the browser

## Configuration Options

Environment variables (all optional):

- `VITE_OPENAI_API_KEY` - Your OpenAI API key
- `VITE_OPENAI_MODEL` - Model to use (default: `gpt-4o`)
- `VITE_USE_MOCK_GM` - Set to `'true'` to force mock mode even with API key

## Game Flow

1. **Start Screen** - Click "Play Demo"
2. **Character Creation** - Choose Race, Class, 2 Abilities, and Name
3. **Game Screen** - Play through encounters via chat interface
4. **Completion Screen** - View rewards and restart

## Testing the Full Flow

The mocked GM responses are context-aware and support the full encounter progression:

- **Encounter 1 (Tavern Floor):** Find the trapdoor to the cellar
  - Try: "I look for the trapdoor" or "I examine the rug"
  
- **Encounter 2 (Cellar):** Solve the puzzle to unlock the iron door
  - Try: "I solve the puzzle" or "I manipulate the valves"
  
- **Encounter 3 (Boss):** Defeat Grimble Gutsplitter
  - Try: "I attack Grimble" (multiple times to defeat)

## Project Structure

```
/src
  /components    - UI components (ChatWindow, PlayerPanel, etc.)
  /screens       - Main screens (Start, CharacterCreation, Game, Completion)
  /state         - State management (gameContext, playerState, etc.)
  /llm           - AI GM integration (aiGMCall.js, prompts.js)
  /data          - Game data (locations, classes, races, abilities)
```

## Development Notes

- Uses React Context for state management (no external state library)
- Mock responses are context-aware and handle encounter progression
- Real API calls fall back to mocks on error
- No persistence in v0 (all state is in-memory)


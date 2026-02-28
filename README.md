# 🎮 Tetris - Retro Edition

A classic Tetris game built with React and the Web Audio API for synthesized sound effects.

## Features

- **Classic Gameplay**: Standard 10x20 Tetris board with all 7 tetromino pieces
- **Hold Mechanic**: Press Shift to hold a piece for later use
- **Next Queue**: Preview the next 3 pieces
- **Scoring System**: Points for lines cleared, soft drops, and hard drops
- **Level Progression**: Speed increases every 10 lines cleared
- **Sound Effects**: Retro synthesized sounds for all game actions (no external audio files required)
- **Pause Functionality**: Press P to pause/resume the game

## Controls

| Key | Action |
|-----|--------|
| ← → | Move piece left/right |
| ↑ | Rotate piece |
| ↓ | Soft drop (move down faster) |
| Space | Hard drop (instantly place piece) |
| Shift | Hold current piece |
| P | Pause/Resume game |
| Enter | Start game / Restart after game over |

## How to Run

### Prerequisites

- Node.js 14 or higher
- npm 6 or higher

### Development Mode

```bash
cd my-app
npm start
```

The application will open in your default browser at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
cd my-app
npm run build
```

This creates an optimized production bundle in the `build` folder.

## Testing

```bash
cd my-app
npm test
```

Runs tests in watch mode. Press `q` to exit watch mode or `a` to run all tests.

## Project Structure

```
my-app/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── Board.js        # Main game board rendering
│   │   ├── Hold.js         # Hold piece display
│   │   ├── NextQueue.js    # Next pieces preview
│   │   ├── Score.js        # Score, lines, level display
│   │   └── GameOverlay.js  # Menu/pause/gameover overlays
│   ├── hooks/
│   │   └── useTetris.js    # Main game logic hook
│   ├── types/
│   │   └── game.js         # Tetromino definitions and colors
│   ├── utils/
│   │   ├── game.js         # Game utility functions
│   │   └── sounds.js       # Sound synthesis using Web Audio API
│   ├── App.js              # Main application component
│   └── index.js            # Entry point
├── package.json
└── README.md
```

## Technical Details

### Sound System

The game uses the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) to synthesize all sounds programmatically:

- **Move**: Short descending sine wave beep
- **Rotate**: Rising triangle wave tone
- **Soft Drop**: Subtle short tone
- **Hard Drop**: Descending square wave
- **Hold**: Rising sine tone
- **Line Clear**: Ascending arpeggio (based on lines cleared)
- **Game Over**: Descending sawtooth wave
- **Pause/Resume**: Sustained sine tone
- **Start Game**: Rising square wave

### Game Logic

The core game logic is encapsulated in the [`useTetris`](src/hooks/useTetris.js:16) custom hook, which manages:

- Board state and piece rendering
- Movement, rotation, and collision detection
- Line clearing and scoring
- Level progression
- Game states (menu, playing, paused, gameover)

## License

MIT

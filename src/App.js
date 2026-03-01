import React, { useEffect, useState } from 'react';
// Initialize socket client for live score updates
import { socket } from './socketClient';
import { useTetris } from './hooks/useTetris';
import { Board } from './components/Board';
import { NextQueue } from './components/NextQueue';
import { Hold } from './components/Hold';
import { Score } from './components/Score';
import { Leaderboard } from './components/Leaderboard';
import { GameOverlay } from './components/GameOverlay';

const NICKNAME_STORAGE_KEY = 'tetris_nickname';

function App() {
  const {
    board,
    currentPiece,
    nextPieces,
    heldPiece,
    canHold,
    score,
    lines,
    level,
    gameState,
    startGame,
    togglePause,
  } = useTetris();

  // Load nickname from localStorage on mount
  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem(NICKNAME_STORAGE_KEY) || '';
  });

  // Save nickname to localStorage whenever it changes
  useEffect(() => {
    if (nickname) {
      localStorage.setItem(NICKNAME_STORAGE_KEY, nickname);
    } else {
      localStorage.removeItem(NICKNAME_STORAGE_KEY);
    }
  }, [nickname]);

  // Auto-submit score when game ends (gameover state)
  useEffect(() => {
    if (gameState === 'gameover' && (score > 0 || lines > 0)) {
      const submitNickname = nickname.trim() || 'anonymous';
      socket.emit('submitScore', { home: score, away: lines, nickname: submitNickname });
      console.log('Auto-submitting score:', { home: score, away: lines, nickname: submitNickname });
    }
  }, [gameState, score, lines, nickname]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>🎮 BESTRIS</h1>
      </header>

      {/* Main game area */}
      <main style={styles.main}>
        {/* Left side: Hold & Score */}
        <aside style={styles.sidebarLeft}>
          <Hold heldPiece={heldPiece} canHold={canHold} />
          <Score score={score} lines={lines} level={level} />
          {/* Nickname input - moved to modal, but kept for reference if needed */}
        </aside>

        {/* Center: Game Board */}
        <section style={styles.gameArea}>
          <Board board={board} currentPiece={currentPiece} />
          <GameOverlay 
            gameState={gameState} 
            onStart={startGame} 
            onResume={togglePause}
            nickname={nickname}
            setNickname={setNickname}
          />
        </section>

        {/* Right side: Next Queue & Leaderboard */}
        <aside style={styles.sidebarRight}>
          <NextQueue nextPieces={nextPieces} />
          <Leaderboard />
        </aside>
      </main>

      {/* Footer with controls info */}
      <footer style={styles.footer}>
        <div style={styles.controlsInfo}>
          <span><kbd>← →</kbd> Move</span>
          <span><kbd>↑</kbd> Rotate</span>
          <span><kbd>↓</kbd> Soft Drop</span>
          <span><kbd>Space</kbd> Hard Drop</span>
          <span><kbd>Shift</kbd> Hold</span>
          <span><kbd>P</kbd> Pause</span>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f1a',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  header: {
    width: '100%',
    maxWidth: '800px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    color: '#fff',
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    fontSize: '36px',
    margin: 0,
    textShadow: '4px 4px 0 #a000f0, -2px -2px 0 #00f0f0',
    letterSpacing: '4px',
  },
  main: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
  },
  sidebarLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  gameArea: {
    position: 'relative',
  },
  sidebarRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  footer: {
    marginTop: '20px',
    padding: '15px 30px',
    backgroundColor: '#1a1a2e',
    border: '2px solid #4a4a6a',
    borderRadius: '8px',
  },
  controlsInfo: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    color: '#888',
    fontFamily: '"Courier New", monospace',
    fontSize: '12px',
  },
};

export default App;

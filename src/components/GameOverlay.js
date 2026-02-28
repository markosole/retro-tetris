import React from 'react';

export const GameOverlay = ({ gameState, onStart, onResume }) => {
  // Only show overlay when not playing
  if (gameState === 'playing') return null;

  const renderContent = () => {
    switch (gameState) {
      case 'menu':
        return (
          <div style={styles.overlay}>
            <h1 style={styles.title}>TETRIS</h1>
            <p style={styles.subtitle}>Retro Edition</p>
            <button onClick={onStart} style={styles.button}>
              PRESS ENTER TO START
            </button>
            <div style={styles.controls}>
              <div style={styles.controlsGrid}>
                <div style={styles.controlItem}>
                  <kbd>← →</kbd> Move
                </div>
                <div style={styles.controlItem}>
                  <kbd>↑</kbd> Rotate
                </div>
                <div style={styles.controlItem}>
                  <kbd>↓</kbd> Soft Drop
                </div>
                <div style={styles.controlItem}>
                  <kbd>Space</kbd> Hard Drop
                </div>
                <div style={styles.controlItem}>
                  <kbd>Shift</kbd> Hold
                </div>
                <div style={styles.controlItem}>
                  <kbd>P</kbd> Pause
                </div>
              </div>
            </div>
          </div>
        );

      case 'paused':
        return (
          <div style={styles.overlay}>
            <h1 style={styles.title}>PAUSED</h1>
            <button onClick={onResume} style={styles.button}>
              PRESS P TO RESUME
            </button>
          </div>
        );

      case 'gameover':
        return (
          <div style={styles.overlay}>
            <h1 style={styles.title}>GAME OVER</h1>
            <p style={styles.subtitle}>Press ENTER to play again</p>
            <button onClick={onStart} style={styles.button}>
              TRY AGAIN
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {renderContent()}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 100,
  },
  overlay: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#1a1a2e',
    border: '4px solid #5a5a7a',
    borderRadius: '16px',
    boxShadow: '0 0 30px rgba(90, 90, 120, 0.5)',
  },
  title: {
    color: '#fff',
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    fontSize: '48px',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    textShadow: '4px 4px 0 #a000f0, -2px -2px 0 #00f0f0',
  },
  subtitle: {
    color: '#aaa',
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    fontSize: '14px',
    marginBottom: '30px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  button: {
    backgroundColor: '#a000f0',
    color: '#fff',
    border: 'none',
    padding: '15px 30px',
    fontSize: '16px',
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    boxShadow: '4px 4px 0 #5a00aa',
    transition: 'transform 0.1s, box-shadow 0.1s',
  },
  controls: {
    marginTop: '30px',
    color: '#888',
    fontFamily: '"Courier New", monospace',
    fontSize: '12px',
  },
  controlsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    justifyContent: 'center',
  },
  controlItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '8px',
  },
};

import React, { useState } from 'react';

export const GameOverlay = ({ gameState, onStart, onResume, nickname, setNickname }) => {
  // Local state for the modal input (syncs with parent via props)
  const [inputValue, setInputValue] = useState(nickname || '');

  // Sync local state when parent nickname changes
  React.useEffect(() => {
    setInputValue(nickname || '');
  }, [nickname]);

  // Handle nickname submission
  const handleNicknameSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (/^[A-Za-z0-9]{1,15}$/.test(trimmed)) {
      setNickname(trimmed);
    } else if (trimmed === '') {
      // Allow empty nickname - will default to 'anonymous' on submit
      setNickname('');
    } else {
      alert('Nickname must be 1-15 letters or numbers.');
    }
  };

  const handleStart = () => {
    // If no nickname entered, allow starting with empty (defaults to anonymous)
    if (!nickname && inputValue.trim() === '') {
      setNickname('');
    }
    onStart();
  };

  // Only show overlay when not playing
  if (gameState === 'playing') return null;

  const renderContent = () => {
    switch (gameState) {
      case 'menu':
        return (
          <div style={styles.overlay}>
            
            {/* Main title and start button */}
            <h2 style={styles.title}>BESTRIS</h2>
            <p style={styles.subtitle}>Retro Edition</p>
            {/* Nickname Modal */}
            <form onSubmit={handleNicknameSubmit} style={styles.nicknameForm}>
              <label htmlFor="nickname" style={styles.nicknameLabel}>Enter Nickname:</label>
              <input
                id="nickname"
                type="text"
                placeholder="Name (optional)"
                maxLength={15}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.replace(/[^A-Za-z0-9]/g, ''))}
                style={styles.nicknameInput}
              />
              <button type="submit" style={styles.submitNicknameButton}>
                {nickname ? 'Update' : 'Set'} Nickname
              </button>
            </form>

            {nickname && (
              <p style={styles.currentNickname}>Current: {nickname}</p>
            )}
            <button onClick={handleStart} style={styles.button}>
              PRESS ENTER TO START
            </button>

            {/* Controls info */}
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  nicknameForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  nicknameLabel: {
    color: '#fff',
    fontFamily: '"Courier New", monospace',
    fontSize: '14px',
  },
  nicknameInput: {
    padding: '10px 15px',
    fontSize: '16px',
    border: '2px solid #5a5a7a',
    borderRadius: '8px',
    backgroundColor: '#2a2a4a',
    color: '#fff',
    fontFamily: '"Courier New", monospace',
    width: '200px',
    textAlign: 'center',
  },
  submitNicknameButton: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#5a5a7a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: '"Courier New", monospace',
  },
  currentNickname: {
    color: '#00f0f0',
    fontFamily: '"Courier New", monospace',
    fontSize: '14px',
    marginTop: '-5px',
  },
  title: {
    color: '#fff',
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    fontSize: '48px',
    marginBottom: '-14px',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    textShadow: '4px 4px 0 #a000f0, -2px -2px 0 #00f0f0',
  },
  subtitle: {
    color: '#aaa',
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    fontSize: '14px',
    marginBottom: '0px',
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

import React from 'react';

export const Score = ({ score, lines, level }) => {
  return (
    <div style={styles.container}>
      <div style={styles.statBox}>
        <h3 style={styles.label}>SCORE</h3>
        <p style={styles.value}>{score.toLocaleString()}</p>
      </div>
      
      <div style={styles.statBox}>
        <h3 style={styles.label}>LINES</h3>
        <p style={styles.value}>{lines}</p>
      </div>
      
      <div style={styles.statBox}>
        <h3 style={styles.label}>LEVEL</h3>
        <p style={styles.value}>{level}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    margin: '20px',
  },
  statBox: {
    backgroundColor: '#2a2a4a',
    border: '2px solid #5a5a7a',
    padding: '15px',
    borderRadius: '8px',
    minWidth: '120px',
    textAlign: 'center',
  },
  label: {
    color: '#aaa',
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    fontSize: '10px',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  value: {
    color: '#fff',
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    fontSize: '16px',
    margin: 0,
  },
};

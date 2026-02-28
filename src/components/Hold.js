import React from 'react';
import { TETROMINOS } from '../types/game';

export const Hold = ({ heldPiece, canHold }) => {
  const CELL_SIZE = 24;
  
  const renderPiece = (type) => {
    const shape = TETROMINOS[type].shape;
    
    return shape.map((row, y) =>
      row.map((cell, x) => {
        if (!cell) return null;
        
        // Center the piece in the 4x4 grid
        const offsetX = type === 'I' || type === 'O' ? 8 : 10;
        const offsetY = type === 'I' ? 6 : 8;
        
        const boardX = offsetX + x * CELL_SIZE;
        const boardY = offsetY + y * CELL_SIZE;
        
        return (
          <g key={`${type}-${x}-${y}`}>
            <rect
              x={boardX + 1}
              y={boardY + 1}
              width={CELL_SIZE - 2}
              height={CELL_SIZE - 2}
              fill={TETROMINOS[type].color}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
            <rect
              x={boardX + 4}
              y={boardY + 4}
              width={CELL_SIZE - 8}
              height={CELL_SIZE - 8}
              fill="rgba(255,255,255,0.3)"
            />
          </g>
        );
      })
    );
  };

  return (
    <div style={styles.container}>
      <h3 style={{ ...styles.title, opacity: canHold ? 1 : 0.4 }}>HOLD</h3>
      <svg width="80" height="120" style={styles.svg}>
        {/* Background */}
        <rect 
          x="0" y="0" 
          width="80" 
          height="120" 
          fill="#2a2a4a" 
          stroke="#5a5a7a" 
          strokeWidth="2"
        />
        
        {/* Render held piece */}
        {heldPiece && renderPiece(heldPiece)}
      </svg>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px',
  },
  title: {
    color: '#fff',
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    fontSize: '14px',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  svg: {
    backgroundColor: '#1a1a2e',
    border: '2px solid #5a5a7a',
  },
};

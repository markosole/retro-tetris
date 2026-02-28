import React from 'react';
import { TETROMINOS } from '../types/game';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;

export const Board = ({ board, currentPiece }) => {
  // Create a merged view of board + current piece for rendering
  const renderGrid = () => {
    const grid = board.map(row => [...row]);
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              grid[boardY][boardX] = currentPiece.type;
            }
          }
        }
      }
    }
    
    return grid;
  };

  const grid = renderGrid();

  return (
    <div style={styles.boardContainer}>
      <svg width={BOARD_WIDTH * CELL_SIZE} height={BOARD_HEIGHT * CELL_SIZE} style={styles.board}>
        {/* Grid background */}
        <rect 
          x="0" y="0" 
          width={BOARD_WIDTH * CELL_SIZE} 
          height={BOARD_HEIGHT * CELL_SIZE} 
          fill="#1a1a2e" 
          stroke="#4a4a6a" 
          strokeWidth="2"
        />
        
        {/* Grid lines */}
        {Array.from({ length: BOARD_HEIGHT + 1 }, (_, y) => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={y * CELL_SIZE}
            x2={BOARD_WIDTH * CELL_SIZE}
            y2={y * CELL_SIZE}
            stroke="#2a2a4a"
            strokeWidth="1"
          />
        ))}
        
        {Array.from({ length: BOARD_WIDTH + 1 }, (_, x) => (
          <line
            key={`v-${x}`}
            x1={x * CELL_SIZE}
            y1="0"
            x2={x * CELL_SIZE}
            y2={BOARD_HEIGHT * CELL_SIZE}
            stroke="#2a2a4a"
            strokeWidth="1"
          />
        ))}
        
        {/* Render cells */}
        {grid.map((row, y) =>
          row.map((cellType, x) => (
            <g key={`${y}-${x}`}>
              {cellType && (
                <>
                  <rect
                    x={x * CELL_SIZE + 1}
                    y={y * CELL_SIZE + 1}
                    width={CELL_SIZE - 2}
                    height={CELL_SIZE - 2}
                    fill={TETROMINOS[cellType].color}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="1"
                  />
                  {/* Inner highlight for 3D effect */}
                  <rect
                    x={x * CELL_SIZE + 4}
                    y={y * CELL_SIZE + 4}
                    width={CELL_SIZE - 10}
                    height={CELL_SIZE - 10}
                    fill="rgba(255,255,255,0.3)"
                  />
                </>
              )}
            </g>
          ))
        )}
      </svg>
    </div>
  );
};

const styles = {
  boardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px',
  },
  board: {
    backgroundColor: '#1a1a2e',
    border: '4px solid #4a4a6a',
    boxShadow: '0 0 20px rgba(74, 74, 106, 0.5)',
  },
};

const TETROMINO_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// Create a new empty board (10x20)
export function createBoard() {
  return Array.from({ length: 20 }, () => Array(10).fill(null));
}

// Get random tetromino type using random bag system
let bag = [];
export function getRandomTetromino() {
  if (bag.length === 0) {
    bag = [...TETROMINO_TYPES];
    // Fisher-Yates shuffle
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }
  return bag.pop();
}

// Get initial piece position
export function getInitialPosition(type) {
  // Center the piece at the top
  const x = Math.floor((10 - 4) / 2);
  let y = 0;
  
  if (type === 'O') {
    return { x: 3, y: 0 };
  }
  return { x, y };
}

// Rotate a matrix 90 degrees clockwise
export function rotateMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array.from({ length: cols }, () => Array(rows).fill(0));
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      result[x][rows - 1 - y] = matrix[y][x];
    }
  }
  
  return result;
}

// Check if a position is valid (no collision)
export function isValidPosition(board, shape, position) {
  const rows = shape.length;
  const cols = shape[0].length;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (shape[y][x] !== 0) {
        const newX = position.x + x;
        const newY = position.y + y;
        
        // Check bounds
        if (newX < 0 || newX >= 10 || newY >= 20) {
          return false;
        }
        
        // Check collision with locked pieces (only if on board)
        if (newY >= 0 && board[newY][newX] !== null) {
          return false;
        }
      }
    }
  }
  
  return true;
}

// Lock piece to the board
export function lockPiece(board, piece) {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        
        if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
          newBoard[boardY][boardX] = piece.type;
        }
      }
    }
  }
  
  return newBoard;
}

// Check for completed lines and clear them
export function clearLines(board) {
  const newBoard = [];
  let linesCleared = 0;
  
  // Count complete lines from bottom to top
  for (let y = 19; y >= 0; y--) {
    if (board[y].every(cell => cell !== null)) {
      linesCleared++;
    } else {
      newBoard.unshift([...board[y]]);
    }
  }
  
  // Add empty rows at the top
  while (newBoard.length < 20) {
    newBoard.unshift(Array(10).fill(null));
  }
  
  return { newBoard, linesCleared };
}

// Calculate score based on lines cleared and level
export function calculateScore(linesCleared, level) {
  const baseScores = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4 lines
  return baseScores[linesCleared] * (level + 1);
}

// Get drop interval based on level (faster as level increases)
export function getDropInterval(level) {
  const intervals = [
    800, // Level 0
    720, // Level 1
    640, // Level 2
    560, // Level 3
    480, // Level 4
    400, // Level 5
    320, // Level 6
    240, // Level 7
    160, // Level 8
    80,  // Level 9+
  ];
  return intervals[Math.min(level, intervals.length - 1)];
}

// Check if game is over (piece locked at top)
export function isGameOver(board) {
  // Check if any cell in the top row is filled
  for (let x = 0; x < 10; x++) {
    if (board[0][x] !== null) {
      return true;
    }
  }
  return false;
}

import { useState, useCallback, useEffect, useRef } from 'react';
import { TETROMINOS } from '../types/game';
import {
  createBoard,
  getRandomTetromino,
  getInitialPosition,
  rotateMatrix,
  isValidPosition,
  lockPiece,
  clearLines,
  calculateScore,
  getDropInterval,
  isGameOver,
} from '../utils/game';
import { soundManager } from '../utils/sounds';

export function useTetris() {
  const [board, setBoard] = useState(createBoard);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPieces, setNextPieces] = useState([]);
  const [heldPiece, setHeldPiece] = useState(null);
  const [canHold, setCanHold] = useState(true);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(0);
  
  const gameLoopRef = useRef(null);
  const lastDropTimeRef = useRef(0);
  const dropIntervalRef = useRef(800);

  // Initialize next pieces
  useEffect(() => {
    const initialNext = [];
    for (let i = 0; i < 3; i++) {
      initialNext.push(getRandomTetromino());
    }
    setNextPieces(initialNext);
  }, []);

  // Spawn a new piece
  const spawnPiece = useCallback(() => {
    if (nextPieces.length === 0) return;
    
    const type = nextPieces[0];
    const newNext = [...nextPieces.slice(1), getRandomTetromino()];
    
    const piece = {
      type,
      shape: TETROMINOS[type].shape,
      position: getInitialPosition(type),
    };
    
    // Check if game over on spawn
    if (!isValidPosition(board, piece.shape, piece.position)) {
      setGameState('gameover');
      soundManager.playGameOverSound();
      return;
    }
    
    setCurrentPiece(piece);
    setNextPieces(newNext);
    setCanHold(true);
  }, [board, nextPieces]);

  // Start game
  const startGame = useCallback(() => {
    soundManager.init();
    soundManager.playStartSound();
    
    setBoard(createBoard());
    setScore(0);
    setLines(0);
    setLevel(0);
    setHeldPiece(null);
    setCanHold(true);
    
    const initialNext = [];
    for (let i = 0; i < 3; i++) {
      initialNext.push(getRandomTetromino());
    }
    setNextPieces(initialNext);
    
    setCurrentPiece(null);
    setGameState('playing');
    
    // Spawn the first piece after state updates
    setTimeout(() => {
      if (initialNext.length > 0) {
        const type = initialNext[0];
        const newNext = [...initialNext.slice(1), getRandomTetromino()];
        
        const piece = {
          type,
          shape: TETROMINOS[type].shape,
          position: getInitialPosition(type),
        };
        
        setCurrentPiece(piece);
        setNextPieces(newNext);
      }
    }, 0);
  }, []);

  // Pause/Resume game
  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      soundManager.playPauseSound();
    } else if (gameState === 'paused') {
      setGameState('playing');
      soundManager.playPauseSound();
    }
  }, [gameState]);

  // Move piece
  const movePiece = useCallback((dx, dy) => {
    if (!currentPiece || gameState !== 'playing') return;
    
    const newPosition = {
      x: currentPiece.position.x + dx,
      y: currentPiece.position.y + dy,
    };
    
    if (isValidPosition(board, currentPiece.shape, newPosition)) {
      setCurrentPiece({ ...currentPiece, position: newPosition });
      
      // Play sound based on movement type
      if (dy === 1) {
        soundManager.playSoftDropSound();
      } else {
        soundManager.playMoveSound();
      }
      
      return true;
    }
    return false;
  }, [board, currentPiece, gameState]);

  // Rotate piece
  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameState !== 'playing') return;
    
    const rotatedShape = rotateMatrix(currentPiece.shape);
    
    // Try normal rotation
    if (isValidPosition(board, rotatedShape, currentPiece.position)) {
      setCurrentPiece({ ...currentPiece, shape: rotatedShape });
      soundManager.playRotateSound();
      return;
    }
    
    // Wall kick attempts (simple implementation)
    const kicks = [
      { x: 1, y: 0 },   // Kick right
      { x: -1, y: 0 },  // Kick left
      { x: 2, y: 0 },   // Kick far right
      { x: -2, y: 0 },  // Kick far left
      { x: 0, y: -1 },  // Kick up
    ];
    
    for (const kick of kicks) {
      const newPosition = {
        x: currentPiece.position.x + kick.x,
        y: currentPiece.position.y + kick.y,
      };
      
      if (isValidPosition(board, rotatedShape, newPosition)) {
        setCurrentPiece({ 
          ...currentPiece, 
          shape: rotatedShape,
          position: newPosition,
        });
        soundManager.playRotateSound();
        return;
      }
    }
  }, [board, currentPiece, gameState]);

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameState !== 'playing') return;
    
    let newY = currentPiece.position.y;
    while (isValidPosition(board, currentPiece.shape, { x: currentPiece.position.x, y: newY + 1 })) {
      newY++;
    }
    
    setCurrentPiece({ ...currentPiece, position: { x: currentPiece.position.x, y: newY } });
    
    // Play hard drop sound
    soundManager.playHardDropSound();
    
    // Lock immediately after hard drop
    setTimeout(() => {
      const lockedBoard = lockPiece(board, { ...currentPiece, position: { x: currentPiece.position.x, y: newY } });
      
      const { newBoard, linesCleared } = clearLines(lockedBoard);
      setBoard(newBoard);
      
      if (linesCleared > 0) {
        const newScore = calculateScore(linesCleared, level);
        const newLines = lines + linesCleared;
        const newLevel = Math.floor(newLines / 10);
        
        setScore(prev => prev + newScore);
        setLines(newLines);
        setLevel(newLevel);
        
        // Play line clear sound based on number of lines
        soundManager.playLineClearSound(linesCleared);
      }
      
      spawnPiece();
    }, 0);
  }, [board, currentPiece, gameState, level, lines, spawnPiece]);

  // Hold piece
  const holdPiece = useCallback(() => {
    if (!currentPiece || !canHold || gameState !== 'playing') return;
    
    soundManager.playHoldSound();
    
    if (heldPiece === null) {
      setHeldPiece(currentPiece.type);
      spawnPiece();
    } else {
      const tempType = currentPiece.type;
      setCurrentPiece({
        type: heldPiece,
        shape: TETROMINOS[heldPiece].shape,
        position: getInitialPosition(heldPiece),
      });
      setHeldPiece(tempType);
    }
    
    setCanHold(false);
  }, [currentPiece, canHold, gameState, heldPiece, spawnPiece]);

  // Game loop for piece descent
  const gameLoop = useCallback((timestamp) => {
    if (gameState !== 'playing' || !currentPiece) {
      lastDropTimeRef.current = timestamp;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    const deltaTime = timestamp - lastDropTimeRef.current;
    
    if (deltaTime >= dropIntervalRef.current) {
      if (!movePiece(0, 1)) {
        // Play lock sound when piece locks
        soundManager.playHardDropSound();
        
        // Lock piece
        const lockedBoard = lockPiece(board, currentPiece);
        
        const { newBoard, linesCleared } = clearLines(lockedBoard);
        setBoard(newBoard);
        
        if (linesCleared > 0) {
          const newScore = calculateScore(linesCleared, level);
          const newLines = lines + linesCleared;
          const newLevel = Math.floor(newLines / 10);
          
          setScore(prev => prev + newScore);
          setLines(newLines);
          setLevel(newLevel);
          
          // Play line clear sound based on number of lines
          soundManager.playLineClearSound(linesCleared);
        }
        
        spawnPiece();
      }
      
      lastDropTimeRef.current = timestamp;
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [board, currentPiece, gameState, level, lines, movePiece, spawnPiece]);

  // Update drop interval when level changes
  useEffect(() => {
    dropIntervalRef.current = getDropInterval(level);
  }, [level]);

  // Start/stop game loop
  useEffect(() => {
    if (gameState === 'playing') {
      lastDropTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'menu' && e.key === 'Enter') {
        startGame();
        return;
      }
      
      if (e.key === 'p' || e.key === 'P') {
        togglePause();
        return;
      }
      
      if (gameState !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          movePiece(0, 1);
          setScore(prev => prev + 1); // Soft drop bonus
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'Shift':
        case 'ShiftLeft':
        case 'ShiftRight':
          holdPiece();
          break;
        default:
          // No action for other keys
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, movePiece, rotatePiece, hardDrop, holdPiece, startGame, togglePause]);

  // Check for game over after board update
  useEffect(() => {
    if (gameState === 'playing' && isGameOver(board)) {
      setGameState('gameover');
    }
  }, [board, gameState]);

  return {
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
    movePiece,
    rotatePiece,
    hardDrop,
    holdPiece,
  };
}

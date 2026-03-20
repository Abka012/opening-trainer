'use client';

import { Chessboard } from 'react-chessboard';
import type { Square } from 'chess.js';
import type { BoardOrientation } from '@/lib/types';
import { useState, useCallback, memo, useEffect, useRef } from 'react';

interface ChessboardDisplayProps {
  position: string;
  orientation?: BoardOrientation;
  onMove?: (from: Square, to: Square) => boolean;
  interactive?: boolean;
  showHint?: Square | null;
  lastMove?: { from: Square; to: Square } | null;
  boardWidth?: number;
  enableKeyboardNav?: boolean;
  onNavigateMove?: (direction: 'prev' | 'next') => void;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const SQUARES: Square[] = FILES.flatMap((file) =>
  [8, 7, 6, 5, 4, 3, 2, 1].map((rank) => (`${file}${rank}` as Square))
);

function ChessboardDisplayComponent({
  position,
  orientation = 'white',
  onMove,
  interactive = true,
  showHint,
  lastMove,
  boardWidth,
  enableKeyboardNav = false,
  onNavigateMove,
}: ChessboardDisplayProps) {
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const customSquareStyles = useCallback(() => {
    const styles: Record<string, React.CSSProperties> = {};

    if (lastMove) {
      styles[lastMove.from] = {
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
      };
      styles[lastMove.to] = {
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
      };
    }

    if (showHint) {
      styles[showHint] = {
        backgroundColor: 'rgba(0, 255, 0, 0.4)',
        boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.5)',
      };
    }

    if (moveFrom) {
      styles[moveFrom] = {
        backgroundColor: 'rgba(100, 180, 255, 0.5)',
      };
    }

    return styles;
  }, [lastMove, showHint, moveFrom]);

  const handlePieceDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      setMoveFrom(null);
      setSelectedSquare(null);
      if (onMove) {
        return onMove(sourceSquare, targetSquare);
      }
      return false;
    },
    [onMove]
  );

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (!interactive || !onMove) return;

      if (moveFrom) {
        const success = onMove(moveFrom, square);
        setMoveFrom(null);
        setSelectedSquare(null);
        if (!success && moveFrom !== square) {
          setMoveFrom(square);
          setSelectedSquare(square);
        }
      } else {
        setMoveFrom(square);
        setSelectedSquare(square);
      }
    },
    [interactive, onMove, moveFrom]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enableKeyboardNav || !onNavigateMove) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onNavigateMove('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNavigateMove('next');
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();
          if (selectedSquare) {
            const fileIndex = FILES.indexOf(selectedSquare[0] as typeof FILES[number]);
            const rank = parseInt(selectedSquare[1]);
            let newFileIndex = fileIndex;
            let newRank = rank;

            if (e.key === 'ArrowUp') {
              newRank = Math.min(8, rank + 1);
            } else {
              newRank = Math.max(1, rank - 1);
            }

            const newSquare: Square = (`${FILES[newFileIndex]}${newRank}` as Square);
            if (SQUARES.includes(newSquare)) {
              setSelectedSquare(newSquare);
              setMoveFrom(newSquare);
            }
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (selectedSquare && onMove) {
            // Try to move to best square (similar to selected)
            const fileIndex = FILES.indexOf(selectedSquare[0] as typeof FILES[number]);
            const targetFile = orientation === 'white' ? 3 : 4;
            const targetRank = orientation === 'white' ? 4 : 5;
            const targetSquare: Square = (`${FILES[Math.min(7, fileIndex + (targetFile - 4))]}${targetRank}` as Square);
            handleSquareClick(targetSquare);
          }
          break;
        case 'Escape':
          setMoveFrom(null);
          setSelectedSquare(null);
          break;
        case 'Home':
          e.preventDefault();
          onNavigateMove('prev');
          break;
        case 'End':
          e.preventDefault();
          onNavigateMove('next');
          break;
      }
    },
    [enableKeyboardNav, onNavigateMove, selectedSquare, orientation, handleSquareClick]
  );

  useEffect(() => {
    const boardElement = boardRef.current;
    if (boardElement && enableKeyboardNav) {
      boardElement.addEventListener('keydown', handleKeyDown as EventListener);
      return () => {
        boardElement.removeEventListener('keydown', handleKeyDown as EventListener);
      };
    }
  }, [enableKeyboardNav, handleKeyDown]);

  return (
    <div 
      ref={boardRef}
      className="relative"
      tabIndex={enableKeyboardNav ? 0 : -1}
      role="application"
      aria-label="Chess board"
    >
      <Chessboard
        id="chess-board"
        position={position}
        boardOrientation={orientation}
        onPieceDrop={handlePieceDrop}
        onSquareClick={handleSquareClick}
        arePiecesDraggable={interactive}
        customSquareStyles={customSquareStyles()}
        boardWidth={boardWidth}
        customBoardStyle={{
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
        customDarkSquareStyle={{
          backgroundColor: '#739552',
        }}
        customLightSquareStyle={{
          backgroundColor: '#ebecd0',
        }}
      />
      {enableKeyboardNav && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          Use arrow keys to navigate moves
        </div>
      )}
    </div>
  );
}

export const ChessboardDisplay = memo(ChessboardDisplayComponent, (prev, next) => {
  return (
    prev.position === next.position &&
    prev.orientation === next.orientation &&
    prev.interactive === next.interactive &&
    prev.showHint === next.showHint &&
    prev.boardWidth === next.boardWidth &&
    JSON.stringify(prev.lastMove) === JSON.stringify(next.lastMove)
  );
});

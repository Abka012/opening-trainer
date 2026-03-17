'use client';

import { Chessboard } from 'react-chessboard';
import type { Square } from 'chess.js';
import type { BoardOrientation } from '@/lib/types';
import { useState, useCallback } from 'react';

interface ChessboardDisplayProps {
  position: string;
  orientation?: BoardOrientation;
  onMove?: (from: Square, to: Square) => boolean;
  interactive?: boolean;
  showHint?: Square | null;
  lastMove?: { from: Square; to: Square } | null;
  boardWidth?: number;
}

export function ChessboardDisplay({
  position,
  orientation = 'white',
  onMove,
  interactive = true,
  showHint,
  lastMove,
  boardWidth,
}: ChessboardDisplayProps) {
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);

  const customSquareStyles = useCallback(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Highlight last move
    if (lastMove) {
      styles[lastMove.from] = {
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
      };
      styles[lastMove.to] = {
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
      };
    }

    // Highlight hint square
    if (showHint) {
      styles[showHint] = {
        backgroundColor: 'rgba(0, 255, 0, 0.4)',
        boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.5)',
      };
    }

    // Highlight selected square
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
        if (!success && moveFrom !== square) {
          // If move failed and clicked different square, try selecting new piece
          setMoveFrom(square);
        }
      } else {
        setMoveFrom(square);
      }
    },
    [interactive, onMove, moveFrom]
  );

  return (
    <div className="relative">
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
    </div>
  );
}

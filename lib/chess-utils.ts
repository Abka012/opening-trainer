import { Chess, type Square, type Move } from 'chess.js';
import type { ChessMove } from './types';

// Starting position FEN
export const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Create a new Chess instance
export function createChessInstance(fen?: string): Chess {
  return new Chess(fen || STARTING_FEN);
}

// Validate if a move is legal
export function isLegalMove(
  fen: string,
  from: Square,
  to: Square
): { valid: boolean; san?: string; newFen?: string } {
  const chess = new Chess(fen);
  
  try {
    const move = chess.move({ from, to, promotion: 'q' });
    if (move) {
      return { valid: true, san: move.san, newFen: chess.fen() };
    }
  } catch {
    // Invalid move
  }
  
  return { valid: false };
}

// Get all legal moves from a position
export function getLegalMoves(fen: string): Move[] {
  const chess = new Chess(fen);
  return chess.moves({ verbose: true });
}

// Make a move and return the new FEN
export function makeMove(
  fen: string,
  move: string | { from: Square; to: Square; promotion?: string }
): { fen: string; san: string } | null {
  const chess = new Chess(fen);
  
  try {
    const result = chess.move(move);
    if (result) {
      return { fen: chess.fen(), san: result.san };
    }
  } catch {
    // Invalid move
  }
  
  return null;
}

// Convert a sequence of SAN moves to ChessMove array
export function movesToChessMoves(moves: string[]): ChessMove[] {
  const chess = new Chess();
  const result: ChessMove[] = [];
  
  for (const san of moves) {
    try {
      chess.move(san);
      result.push({
        san,
        fen: chess.fen(),
      });
    } catch {
      break;
    }
  }
  
  return result;
}

// Parse a PGN move list string (e.g., "1. e4 e5 2. Nf3 Nc6")
export function parsePgnMoves(pgn: string): string[] {
  // Remove move numbers and trim
  const cleaned = pgn
    .replace(/\d+\./g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned.split(' ').filter(move => move.length > 0);
}

// Convert ChessMove array to PGN string
export function movesToPgn(moves: ChessMove[]): string {
  let pgn = '';
  
  moves.forEach((move, index) => {
    const moveNumber = Math.floor(index / 2) + 1;
    if (index % 2 === 0) {
      pgn += `${moveNumber}. `;
    }
    pgn += move.san;
    if (move.annotation) {
      pgn += move.annotation;
    }
    pgn += ' ';
  });
  
  return pgn.trim();
}

// Get the current side to move
export function getSideToMove(fen: string): 'white' | 'black' {
  const parts = fen.split(' ');
  return parts[1] === 'w' ? 'white' : 'black';
}

// Check if the position is checkmate
export function isCheckmate(fen: string): boolean {
  const chess = new Chess(fen);
  return chess.isCheckmate();
}

// Check if the position is in check
export function isCheck(fen: string): boolean {
  const chess = new Chess(fen);
  return chess.isCheck();
}

// Check if the game is over
export function isGameOver(fen: string): boolean {
  const chess = new Chess(fen);
  return chess.isGameOver();
}

// Get position evaluation hint based on material count
export function getMaterialBalance(fen: string): number {
  const pieceValues: Record<string, number> = {
    p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
  };
  
  const board = fen.split(' ')[0];
  let balance = 0;
  
  for (const char of board) {
    const lower = char.toLowerCase();
    if (pieceValues[lower] !== undefined) {
      const value = pieceValues[lower];
      balance += char === lower ? -value : value;
    }
  }
  
  return balance;
}

// Format move with move number
export function formatMoveWithNumber(
  moveIndex: number,
  san: string,
  annotation?: string
): string {
  const moveNumber = Math.floor(moveIndex / 2) + 1;
  const isWhite = moveIndex % 2 === 0;
  
  let result = isWhite ? `${moveNumber}. ${san}` : `${moveNumber}... ${san}`;
  if (annotation) {
    result += annotation;
  }
  
  return result;
}

// Get square color
export function getSquareColor(square: Square): 'light' | 'dark' {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = parseInt(square[1]) - 1;
  return (file + rank) % 2 === 0 ? 'dark' : 'light';
}

// Convert FEN to board position for display
export function fenToBoard(fen: string): (string | null)[][] {
  const board: (string | null)[][] = [];
  const position = fen.split(' ')[0];
  const rows = position.split('/');
  
  for (const row of rows) {
    const boardRow: (string | null)[] = [];
    for (const char of row) {
      if (/\d/.test(char)) {
        for (let i = 0; i < parseInt(char); i++) {
          boardRow.push(null);
        }
      } else {
        boardRow.push(char);
      }
    }
    board.push(boardRow);
  }
  
  return board;
}

// Get move number from index
export function getMoveNumber(index: number): number {
  return Math.floor(index / 2) + 1;
}

// Check if it's white's move at given index
export function isWhiteMove(index: number): boolean {
  return index % 2 === 0;
}

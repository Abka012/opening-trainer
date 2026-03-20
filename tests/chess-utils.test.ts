import { describe, it, expect } from 'vitest';
import {
  STARTING_FEN,
  isLegalMove,
  getLegalMoves,
  makeMove,
  movesToChessMoves,
  parsePgnMoves,
  movesToPgn,
  getSideToMove,
  isCheckmate,
  isCheck,
  isGameOver,
  getMaterialBalance,
  formatMoveWithNumber,
  fenToBoard,
  getMoveNumber,
  isWhiteMove,
} from '@/lib/chess-utils';

describe('chess-utils', () => {
  describe('STARTING_FEN', () => {
    it('should be valid starting position', () => {
      expect(STARTING_FEN).toBe(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      );
    });
  });

  describe('isLegalMove', () => {
    it('should return valid for legal pawn move', () => {
      const result = isLegalMove(STARTING_FEN, 'e2', 'e4');
      expect(result.valid).toBe(true);
      expect(result.san).toBe('e4');
    });

    it('should return valid for knight move', () => {
      const result = isLegalMove(STARTING_FEN, 'b1', 'c3');
      expect(result.valid).toBe(true);
      expect(result.san).toBe('Nc3');
    });

    it('should return invalid for illegal move', () => {
      const result = isLegalMove(STARTING_FEN, 'e2', 'e8');
      expect(result.valid).toBe(false);
    });

    it('should return invalid for moving opponents piece', () => {
      const result = isLegalMove(STARTING_FEN, 'e7', 'e5');
      expect(result.valid).toBe(false);
    });
  });

  describe('getLegalMoves', () => {
    it('should return all legal moves from starting position', () => {
      const moves = getLegalMoves(STARTING_FEN);
      expect(moves.length).toBe(20);
    });

    it('should return empty array at checkmate', () => {
      const checkmateFen =
        'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5bn b - - 0 1';
      const moves = getLegalMoves(checkmateFen);
      expect(moves.length).toBe(0);
    });
  });

  describe('makeMove', () => {
    it('should make a valid move and return new FEN', () => {
      const result = makeMove(STARTING_FEN, { from: 'e2', to: 'e4' });
      expect(result).not.toBeNull();
      expect(result?.san).toBe('e4');
      expect(result?.fen).toContain('8/PPPP1PPP');
    });

    it('should return null for invalid move', () => {
      const result = makeMove(STARTING_FEN, { from: 'e2', to: 'e8' });
      expect(result).toBeNull();
    });

    it('should make move using SAN', () => {
      const result = makeMove(STARTING_FEN, 'e4');
      expect(result?.san).toBe('e4');
    });
  });

  describe('movesToChessMoves', () => {
    it('should convert SAN moves to ChessMove array', () => {
      const moves = movesToChessMoves(['e4', 'e5', 'Nf3']);
      expect(moves.length).toBe(3);
      expect(moves[0].san).toBe('e4');
      expect(moves[0].fen).toContain('8/PPPP1PPP');
    });

    it('should stop at invalid move', () => {
      const moves = movesToChessMoves(['e4', 'invalid', 'Nf3']);
      expect(moves.length).toBe(1);
    });

    it('should return empty array for empty input', () => {
      const moves = movesToChessMoves([]);
      expect(moves.length).toBe(0);
    });
  });

  describe('parsePgnMoves', () => {
    it('should parse standard PGN notation', () => {
      const moves = parsePgnMoves('1. e4 e5 2. Nf3 Nc6');
      expect(moves).toEqual(['e4', 'e5', 'Nf3', 'Nc6']);
    });

    it('should handle multiple spaces', () => {
      const moves = parsePgnMoves('1.  e4   e5');
      expect(moves).toEqual(['e4', 'e5']);
    });

    it('should handle moves without numbers', () => {
      const moves = parsePgnMoves('e4 e5 Nf3');
      expect(moves).toEqual(['e4', 'e5', 'Nf3']);
    });
  });

  describe('movesToPgn', () => {
    it('should convert ChessMove array to PGN', () => {
      const chessMoves = [
        { san: 'e4', fen: '' },
        { san: 'e5', fen: '' },
      ];
      const pgn = movesToPgn(chessMoves);
      expect(pgn).toBe('1. e4 e5');
    });

    it('should include annotations', () => {
      const chessMoves = [
        { san: 'e4', fen: '', annotation: '!' as const },
        { san: 'e5', fen: '' },
      ];
      const pgn = movesToPgn(chessMoves);
      expect(pgn).toContain('e4!');
    });
  });

  describe('getSideToMove', () => {
    it('should return white for w FEN', () => {
      expect(getSideToMove(STARTING_FEN)).toBe('white');
    });

    it('should return black for b FEN', () => {
      const blackToMove = STARTING_FEN.replace('w', 'b');
      expect(getSideToMove(blackToMove)).toBe('black');
    });
  });

  describe('isCheckmate', () => {
    it('should return true for checkmate position', () => {
      const checkmateFen =
        'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5bn b - - 0 1';
      expect(isCheckmate(checkmateFen)).toBe(true);
    });

    it('should return false for starting position', () => {
      expect(isCheckmate(STARTING_FEN)).toBe(false);
    });
  });

  describe('isCheck', () => {
    it('should return false when not in check', () => {
      expect(isCheck(STARTING_FEN)).toBe(false);
    });

    it('should return true when in checkmate', () => {
      const checkmateFen =
        'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5bn b - - 0 1';
      expect(isCheck(checkmateFen)).toBe(true);
    });
  });

  describe('isGameOver', () => {
    it('should return false for starting position', () => {
      expect(isGameOver(STARTING_FEN)).toBe(false);
    });

    it('should return true for checkmate', () => {
      const checkmateFen =
        'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5bn b - - 0 1';
      expect(isGameOver(checkmateFen)).toBe(true);
    });
  });

  describe('getMaterialBalance', () => {
    it('should return 0 for starting position', () => {
      expect(getMaterialBalance(STARTING_FEN)).toBe(0);
    });

    it('should return positive for white advantage', () => {
      const balance = getMaterialBalance('8/8/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1');
      expect(balance).toBeGreaterThan(0);
    });

    it('should return negative for black advantage', () => {
      const balance = getMaterialBalance('rnbqkbnr/8/8/8/8/8/8/8 w - - 0 1');
      expect(balance).toBeLessThan(0);
    });
  });

  describe('formatMoveWithNumber', () => {
    it('should format white move with number', () => {
      expect(formatMoveWithNumber(0, 'e4')).toBe('1. e4');
    });

    it('should format black move with ellipsis', () => {
      expect(formatMoveWithNumber(1, 'e5')).toBe('1... e5');
    });

    it('should include annotation when provided', () => {
      expect(formatMoveWithNumber(0, 'e4', '!')).toBe('1. e4!');
    });
  });

  describe('fenToBoard', () => {
    it('should convert FEN to 2D array', () => {
      const board = fenToBoard(STARTING_FEN);
      expect(board.length).toBe(8);
      expect(board[0].length).toBe(8);
    });

    it('should place pieces correctly', () => {
      const board = fenToBoard(STARTING_FEN);
      expect(board[0][0]).toBe('r');
      expect(board[0][4]).toBe('k');
      expect(board[7][0]).toBe('R');
      expect(board[7][4]).toBe('K');
    });

    it('should handle empty squares', () => {
      const board = fenToBoard('8/8/8/8/8/8/8/8 w - - 0 1');
      board.forEach((row) => {
        row.forEach((square) => {
          expect(square).toBeNull();
        });
      });
    });
  });

  describe('getMoveNumber', () => {
    it('should return 1 for first move pair', () => {
      expect(getMoveNumber(0)).toBe(1);
      expect(getMoveNumber(1)).toBe(1);
    });

    it('should return 2 for second move pair', () => {
      expect(getMoveNumber(2)).toBe(2);
      expect(getMoveNumber(3)).toBe(2);
    });
  });

  describe('isWhiteMove', () => {
    it('should return true for even indices', () => {
      expect(isWhiteMove(0)).toBe(true);
      expect(isWhiteMove(2)).toBe(true);
    });

    it('should return false for odd indices', () => {
      expect(isWhiteMove(1)).toBe(false);
      expect(isWhiteMove(3)).toBe(false);
    });
  });
});

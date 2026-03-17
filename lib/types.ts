// Chess Opening Repertoire Types

export type MoveAnnotation = '!' | '?' | '!!' | '??' | '!?' | '?!';

export interface ChessMove {
  san: string;           // Standard Algebraic Notation (e.g., "e4")
  fen: string;           // Position after move
  annotation?: MoveAnnotation;
  comment?: string;
}

export interface Variation {
  id: string;
  parentMoveIndex: number;
  moves: ChessMove[];
  name?: string;
}

export interface PracticeStats {
  attempts: number;
  correct: number;
  lastAttempt: string | null;
  dueForReview: string | null;
}

export interface Opening {
  id: string;
  name: string;
  eco: string;
  color: 'white' | 'black';
  moves: ChessMove[];
  variations: Variation[];
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastStudied: string | null;
  practiceStats: PracticeStats;
}

export interface ECOOpening {
  eco: string;
  name: string;
  moves: string;
  fen?: string;
}

export interface RepertoireFilter {
  color: 'all' | 'white' | 'black';
  search: string;
  ecoRange: string;
  tags: string[];
}

export interface PracticeSettings {
  openingIds: string[];
  color: 'white' | 'black' | 'both';
  showHints: boolean;
  randomOrder: boolean;
}

export interface PracticeState {
  currentOpeningId: string | null;
  currentMoveIndex: number;
  isCorrect: boolean | null;
  attempts: number;
  correctMoves: number;
  wrongMoves: string[];
}

export type BoardOrientation = 'white' | 'black';

export interface AppSettings {
  boardTheme: 'green' | 'brown' | 'blue';
  pieceTheme: 'neo' | 'classic' | 'alpha';
  showCoordinates: boolean;
  animationSpeed: number;
}

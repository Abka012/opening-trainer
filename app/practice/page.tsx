'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '@/components/header';
import { ChessboardDisplay } from '@/components/chess/chessboard-display';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  loadOpenings,
  updatePracticeStats,
  getOpeningsDueForReview,
} from '@/lib/repertoire-store';
import { STARTING_FEN, isLegalMove, getSideToMove } from '@/lib/chess-utils';
import type { Opening } from '@/lib/types';
import type { Square } from 'chess.js';
import {
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  Trophy,
  BookOpen,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type PracticePhase = 'setup' | 'practicing' | 'complete';

interface PracticeResult {
  openingId: string;
  openingName: string;
  correct: boolean;
  movesTested: number;
}

export default function PracticePage() {
  const [allOpenings, setAllOpenings] = useState<Opening[]>([]);
  const [selectedOpeningIds, setSelectedOpeningIds] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<PracticePhase>('setup');

  // Practice state
  const [currentOpening, setCurrentOpening] = useState<Opening | null>(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(STARTING_FEN);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [practiceQueue, setPracticeQueue] = useState<Opening[]>([]);
  const [results, setResults] = useState<PracticeResult[]>([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Load openings on mount
  useEffect(() => {
    const openings = loadOpenings();
    setAllOpenings(openings);
  }, []);

  // Get openings due for review
  const dueForReview = useMemo(() => getOpeningsDueForReview(), [allOpenings]);

  const toggleOpeningSelection = (id: string) => {
    setSelectedOpeningIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedOpeningIds(new Set(allOpenings.map((o) => o.id)));
  };

  const selectDue = () => {
    setSelectedOpeningIds(new Set(dueForReview.map((o) => o.id)));
  };

  const clearSelection = () => {
    setSelectedOpeningIds(new Set());
  };

  const startPractice = useCallback(() => {
    const selected = allOpenings.filter((o) => selectedOpeningIds.has(o.id) && o.moves.length > 0);
    if (selected.length === 0) return;

    // Shuffle the openings
    const shuffled = [...selected].sort(() => Math.random() - 0.5);
    setPracticeQueue(shuffled);

    // Set up the first opening
    const first = shuffled[0];
    setCurrentOpening(first);
    setCurrentMoveIndex(0);
    setCurrentPosition(STARTING_FEN);
    setBoardOrientation(first.color);
    setIsCorrect(null);
    setShowHint(false);
    setResults([]);
    setTotalCorrect(0);
    setTotalAttempts(0);
    setPhase('practicing');

    // If the first move is for the opponent, make it automatically
    const sideToMove = getSideToMove(STARTING_FEN);
    if ((first.color === 'white' && sideToMove === 'black') ||
        (first.color === 'black' && sideToMove === 'white')) {
      // This shouldn't happen at the starting position, but handle it anyway
    }
  }, [allOpenings, selectedOpeningIds]);

  const handleMove = useCallback(
    (from: Square, to: Square): boolean => {
      if (!currentOpening || isCorrect !== null) return false;

      const result = isLegalMove(currentPosition, from, to);
      if (!result.valid || !result.san) return false;

      const expectedMove = currentOpening.moves[currentMoveIndex];
      if (!expectedMove) return false;

      const isCorrectMove = result.san === expectedMove.san;

      if (isCorrectMove) {
        setIsCorrect(true);
        setTotalCorrect((c) => c + 1);
        setTotalAttempts((a) => a + 1);
        setCurrentPosition(expectedMove.fen);
        setShowHint(false);

        // After a short delay, move to next position
        setTimeout(() => {
          moveToNextPosition();
        }, 500);
      } else {
        setIsCorrect(false);
        setTotalAttempts((a) => a + 1);
      }

      return isCorrectMove;
    },
    [currentOpening, currentMoveIndex, currentPosition, isCorrect]
  );

  const moveToNextPosition = useCallback(() => {
    if (!currentOpening) return;

    let nextIndex = currentMoveIndex + 1;

    // Skip opponent moves (auto-play them)
    while (nextIndex < currentOpening.moves.length) {
      const sideToMove = getSideToMove(currentOpening.moves[nextIndex - 1]?.fen || STARTING_FEN);
      const isOurTurn =
        (currentOpening.color === 'white' && sideToMove === 'white') ||
        (currentOpening.color === 'black' && sideToMove === 'black');

      if (isOurTurn) {
        // It's our turn - stop here for the user to play
        break;
      } else {
        // It's opponent's turn - auto-play their move
        nextIndex++;
      }
    }

    if (nextIndex >= currentOpening.moves.length) {
      // Finished this opening
      const result: PracticeResult = {
        openingId: currentOpening.id,
        openingName: currentOpening.name,
        correct: true, // They completed it
        movesTested: currentMoveIndex + 1,
      };
      setResults((r) => [...r, result]);
      updatePracticeStats(currentOpening.id, true);

      // Move to next opening in queue
      const currentQueueIndex = practiceQueue.findIndex((o) => o.id === currentOpening.id);
      const nextOpening = practiceQueue[currentQueueIndex + 1];

      if (nextOpening) {
        setCurrentOpening(nextOpening);
        setCurrentMoveIndex(0);
        setCurrentPosition(STARTING_FEN);
        setBoardOrientation(nextOpening.color);
        setIsCorrect(null);
        setShowHint(false);

        // Auto-play opponent's first move if needed
        const firstSideToMove = getSideToMove(STARTING_FEN);
        if ((nextOpening.color === 'white' && firstSideToMove === 'black') ||
            (nextOpening.color === 'black' && firstSideToMove === 'white')) {
          // The first move is opponent's, but that shouldn't happen with standard openings
        }
      } else {
        // All done!
        setPhase('complete');
      }
    } else {
      // Continue with this opening
      setCurrentMoveIndex(nextIndex);
      // Update position to show the move before the one they need to play
      const prevPosition = nextIndex > 0 ? currentOpening.moves[nextIndex - 1].fen : STARTING_FEN;
      setCurrentPosition(prevPosition);
      setIsCorrect(null);
      setShowHint(false);
    }
  }, [currentOpening, currentMoveIndex, practiceQueue]);

  const handleShowHint = () => {
    setShowHint(true);
  };

  const handleTryAgain = () => {
    setIsCorrect(null);
    setShowHint(false);
  };

  const handleSkip = () => {
    if (!currentOpening) return;

    // Record as incorrect
    updatePracticeStats(currentOpening.id, false);

    const result: PracticeResult = {
      openingId: currentOpening.id,
      openingName: currentOpening.name,
      correct: false,
      movesTested: currentMoveIndex,
    };
    setResults((r) => [...r, result]);

    // Move to next opening
    const currentQueueIndex = practiceQueue.findIndex((o) => o.id === currentOpening.id);
    const nextOpening = practiceQueue[currentQueueIndex + 1];

    if (nextOpening) {
      setCurrentOpening(nextOpening);
      setCurrentMoveIndex(0);
      setCurrentPosition(STARTING_FEN);
      setBoardOrientation(nextOpening.color);
      setIsCorrect(null);
      setShowHint(false);
    } else {
      setPhase('complete');
    }
  };

  const restartPractice = () => {
    setPhase('setup');
    setCurrentOpening(null);
    setResults([]);
  };

  // Calculate progress
  const currentQueueIndex = practiceQueue.findIndex((o) => o.id === currentOpening?.id);
  const progress = practiceQueue.length > 0 ? ((currentQueueIndex) / practiceQueue.length) * 100 : 0;

  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          {/* Setup Phase */}
          {phase === 'setup' && (
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold">Practice Mode</h1>
                <p className="mt-2 text-muted-foreground">
                  Test your knowledge of your opening repertoire
                </p>
              </div>

              {allOpenings.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No Openings Yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add some openings to your repertoire first, then come back to practice.
                    </p>
                    <Button className="mt-4" asChild>
                      <a href="/repertoire">Go to Repertoire</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Quick Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={selectAll}>
                      Select All ({allOpenings.filter(o => o.moves.length > 0).length})
                    </Button>
                    {dueForReview.length > 0 && (
                      <Button variant="outline" size="sm" onClick={selectDue}>
                        Due for Review ({dueForReview.length})
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={clearSelection}>
                      Clear Selection
                    </Button>
                  </div>

                  {/* Opening Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Select Openings to Practice</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-80">
                        <div className="space-y-2">
                          {allOpenings.map((opening) => {
                            const hasMoves = opening.moves.length > 0;
                            const isDue = dueForReview.some((o) => o.id === opening.id);
                            return (
                              <label
                                key={opening.id}
                                className={cn(
                                  'flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors',
                                  !hasMoves && 'opacity-50 cursor-not-allowed',
                                  selectedOpeningIds.has(opening.id) && hasMoves
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:bg-secondary/50'
                                )}
                              >
                                <Checkbox
                                  checked={selectedOpeningIds.has(opening.id)}
                                  onCheckedChange={() => hasMoves && toggleOpeningSelection(opening.id)}
                                  disabled={!hasMoves}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        'h-5 px-1.5 text-[10px] font-mono',
                                        opening.color === 'white'
                                          ? 'bg-foreground/10'
                                          : 'bg-foreground text-background'
                                      )}
                                    >
                                      {opening.color === 'white' ? 'W' : 'B'}
                                    </Badge>
                                    {opening.eco && (
                                      <Badge variant="secondary" className="h-5 text-[10px]">
                                        {opening.eco}
                                      </Badge>
                                    )}
                                    {isDue && (
                                      <Badge variant="default" className="h-5 text-[10px] bg-accent text-accent-foreground">
                                        Due
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="mt-1 font-medium">{opening.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {hasMoves
                                      ? `${opening.moves.length} moves`
                                      : 'No moves added yet'}
                                  </p>
                                </div>
                                {opening.practiceStats.attempts > 0 && (
                                  <div className="text-right text-xs text-muted-foreground">
                                    <p>
                                      {Math.round(
                                        (opening.practiceStats.correct /
                                          opening.practiceStats.attempts) *
                                          100
                                      )}
                                      % accuracy
                                    </p>
                                    <p>{opening.practiceStats.attempts} attempts</p>
                                  </div>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Start Button */}
                  <div className="text-center">
                    <Button
                      size="lg"
                      className="gap-2"
                      onClick={startPractice}
                      disabled={selectedOpeningIds.size === 0}
                    >
                      <Play className="h-5 w-5" />
                      Start Practice ({selectedOpeningIds.size} selected)
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Practicing Phase */}
          {phase === 'practicing' && currentOpening && (
            <div className="mx-auto max-w-4xl space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Opening {currentQueueIndex + 1} of {practiceQueue.length}
                  </span>
                  <span className="font-medium">
                    {totalCorrect}/{totalAttempts} correct
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Current Opening Info */}
              <div className="flex items-center justify-between rounded-lg bg-card p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {currentOpening.eco || 'N/A'}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        currentOpening.color === 'white'
                          ? 'bg-foreground/10'
                          : 'bg-foreground text-background'
                      }
                    >
                      {currentOpening.color === 'white' ? 'White' : 'Black'}
                    </Badge>
                  </div>
                  <h2 className="mt-1 text-xl font-bold">{currentOpening.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Move {currentMoveIndex + 1} of {currentOpening.moves.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSkip}>
                    Skip
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chessboard */}
              <div className="flex flex-col items-center gap-4">
                <div
                  className={cn(
                    'w-full max-w-md rounded-lg transition-all',
                    isCorrect === true && 'practice-correct',
                    isCorrect === false && 'practice-incorrect'
                  )}
                >
                  <ChessboardDisplay
                    position={currentPosition}
                    orientation={boardOrientation}
                    onMove={handleMove}
                    interactive={isCorrect === null}
                  />
                </div>

                {/* Feedback */}
                {isCorrect !== null && (
                  <div
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-4 py-2',
                      isCorrect ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                    )}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        <span className="font-medium">
                          Incorrect - the move was{' '}
                          <span className="font-mono">
                            {currentOpening.moves[currentMoveIndex]?.san}
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Actions */}
                {isCorrect === null && (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleShowHint} disabled={showHint}>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      {showHint ? 'Hint: ' + currentOpening.moves[currentMoveIndex]?.san : 'Show Hint'}
                    </Button>
                  </div>
                )}

                {isCorrect === false && (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleTryAgain}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                    <Button onClick={moveToNextPosition}>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Complete Phase */}
          {phase === 'complete' && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="text-center">
                <Trophy className="mx-auto h-16 w-16 text-accent" />
                <h1 className="mt-4 text-3xl font-bold">Practice Complete!</h1>
                <p className="mt-2 text-muted-foreground">
                  Great job reviewing your openings
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Target className="mx-auto h-8 w-8 text-primary" />
                    <p className="mt-2 text-3xl font-bold">{totalCorrect}</p>
                    <p className="text-sm text-muted-foreground">Correct Moves</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Eye className="mx-auto h-8 w-8 text-primary" />
                    <p className="mt-2 text-3xl font-bold">{totalAttempts}</p>
                    <p className="text-sm text-muted-foreground">Total Attempts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="mx-auto h-8 w-8 text-primary" />
                    <p className="mt-2 text-3xl font-bold">
                      {totalAttempts > 0
                        ? Math.round((totalCorrect / totalAttempts) * 100)
                        : 0}
                      %
                    </p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Results by Opening</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.map((result, idx) => (
                      <div
                        key={`${result.openingId}-${idx}`}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div>
                          <p className="font-medium">{result.openingName}</p>
                          <p className="text-xs text-muted-foreground">
                            {result.movesTested} moves practiced
                          </p>
                        </div>
                        {result.correct ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={restartPractice}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Practice Again
                </Button>
                <Button asChild>
                  <a href="/repertoire">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Review Repertoire
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

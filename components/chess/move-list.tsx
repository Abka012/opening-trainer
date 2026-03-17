'use client';

import { cn } from '@/lib/utils';
import type { ChessMove, MoveAnnotation } from '@/lib/types';
import { getMoveNumber, isWhiteMove } from '@/lib/chess-utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MoveListProps {
  moves: ChessMove[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
  onAnnotationChange?: (index: number, annotation: MoveAnnotation | undefined) => void;
  editable?: boolean;
}

const annotations: { symbol: MoveAnnotation; label: string; color: string }[] = [
  { symbol: '!', label: 'Good move', color: 'text-primary' },
  { symbol: '!!', label: 'Brilliant move', color: 'text-primary' },
  { symbol: '?', label: 'Mistake', color: 'text-destructive' },
  { symbol: '??', label: 'Blunder', color: 'text-destructive' },
  { symbol: '!?', label: 'Interesting move', color: 'text-accent' },
  { symbol: '?!', label: 'Dubious move', color: 'text-accent' },
];

function MoveAnnotationBadge({ annotation }: { annotation?: MoveAnnotation }) {
  if (!annotation) return null;

  const annotationInfo = annotations.find((a) => a.symbol === annotation);
  if (!annotationInfo) return null;

  return (
    <span className={cn('ml-0.5 font-bold', annotationInfo.color)}>
      {annotation}
    </span>
  );
}

export function MoveList({
  moves,
  currentMoveIndex,
  onMoveClick,
  onAnnotationChange,
  editable = false,
}: MoveListProps) {
  if (moves.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p className="text-sm">No moves yet. Make a move on the board.</p>
      </div>
    );
  }

  // Group moves into pairs (white, black)
  const movePairs: { number: number; white?: ChessMove; black?: ChessMove; whiteIndex?: number; blackIndex?: number }[] = [];
  
  moves.forEach((move, index) => {
    const pairIndex = Math.floor(index / 2);
    if (!movePairs[pairIndex]) {
      movePairs[pairIndex] = { number: pairIndex + 1 };
    }
    if (isWhiteMove(index)) {
      movePairs[pairIndex].white = move;
      movePairs[pairIndex].whiteIndex = index;
    } else {
      movePairs[pairIndex].black = move;
      movePairs[pairIndex].blackIndex = index;
    }
  });

  const renderMove = (move: ChessMove | undefined, index: number | undefined) => {
    if (!move || index === undefined) {
      return <span className="w-20" />;
    }

    const isActive = currentMoveIndex === index;
    const moveContent = (
      <span
        className={cn(
          'inline-flex cursor-pointer items-center rounded px-1.5 py-0.5 font-mono text-sm transition-colors',
          isActive
            ? 'bg-primary/20 text-primary'
            : 'hover:bg-secondary'
        )}
        onClick={() => onMoveClick(index)}
      >
        {move.san}
        <MoveAnnotationBadge annotation={move.annotation} />
      </span>
    );

    if (editable && onAnnotationChange) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {moveContent}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onAnnotationChange(index, undefined)}>
              No annotation
            </DropdownMenuItem>
            {annotations.map((ann) => (
              <DropdownMenuItem
                key={ann.symbol}
                onClick={() => onAnnotationChange(index, ann.symbol)}
                className={ann.color}
              >
                {ann.symbol} - {ann.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return moveContent;
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {movePairs.map((pair) => (
          <div key={pair.number} className="flex items-center gap-2">
            <span className="w-8 text-right text-sm text-muted-foreground">
              {pair.number}.
            </span>
            <div className="flex flex-1 gap-4">
              <div className="w-20">
                {renderMove(pair.white, pair.whiteIndex)}
              </div>
              <div className="w-20">
                {renderMove(pair.black, pair.blackIndex)}
              </div>
            </div>
          </div>
        ))}
        
        {/* Starting position option */}
        <div className="mt-2 border-t border-border pt-2">
          <button
            onClick={() => onMoveClick(-1)}
            className={cn(
              'text-xs text-muted-foreground hover:text-foreground transition-colors',
              currentMoveIndex === -1 && 'text-primary'
            )}
          >
            Go to starting position
          </button>
        </div>
      </div>
    </ScrollArea>
  );
}

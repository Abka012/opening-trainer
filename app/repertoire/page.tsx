'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/header';
import { ChessboardDisplay } from '@/components/chess/chessboard-display';
import { MoveList } from '@/components/chess/move-list';
import { RepertoireList } from '@/components/repertoire/repertoire-list';
import { RepertoireForm } from '@/components/repertoire/repertoire-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import type { Opening, ChessMove, MoveAnnotation } from '@/lib/types';
import {
  loadOpenings,
  saveOpenings,
  createOpening,
  generateId,
} from '@/lib/repertoire-store';
import { STARTING_FEN, isLegalMove } from '@/lib/chess-utils';
import type { Square } from 'chess.js';
import { toast } from 'sonner';
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Undo,
  FlipVertical,
} from 'lucide-react';

export default function RepertoirePage() {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [selectedOpening, setSelectedOpening] = useState<Opening | null>(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [currentPosition, setCurrentPosition] = useState(STARTING_FEN);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openingToDelete, setOpeningToDelete] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  // Load openings on mount
  useEffect(() => {
    const loaded = loadOpenings();
    setOpenings(loaded);
    if (loaded.length > 0) {
      setSelectedOpening(loaded[0]);
      setBoardOrientation(loaded[0].color);
    }
  }, []);

  // Update position when move index changes
  useEffect(() => {
    if (!selectedOpening) {
      setCurrentPosition(STARTING_FEN);
      setLastMove(null);
      return;
    }

    if (currentMoveIndex < 0) {
      setCurrentPosition(STARTING_FEN);
      setLastMove(null);
    } else if (currentMoveIndex < selectedOpening.moves.length) {
      setCurrentPosition(selectedOpening.moves[currentMoveIndex].fen);
      // Set last move for highlighting
      if (currentMoveIndex > 0) {
        // We don't store from/to in ChessMove, so we can't highlight accurately
        // This would require extending the data model
      }
    }
  }, [selectedOpening, currentMoveIndex]);

  const handleSelectOpening = useCallback((opening: Opening) => {
    setSelectedOpening(opening);
    setCurrentMoveIndex(opening.moves.length - 1);
    setBoardOrientation(opening.color);
  }, []);

  const handleCreateNew = useCallback(() => {
    const newOpening = createOpening({ name: 'New Opening' });
    const updated = [...openings, newOpening];
    setOpenings(updated);
    saveOpenings(updated);
    setSelectedOpening(newOpening);
    setCurrentMoveIndex(-1);
    toast.success('New opening created');
  }, [openings]);

  const handleDelete = useCallback((id: string) => {
    setOpeningToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!openingToDelete) return;
    const updated = openings.filter((o) => o.id !== openingToDelete);
    setOpenings(updated);
    saveOpenings(updated);
    if (selectedOpening?.id === openingToDelete) {
      setSelectedOpening(updated[0] || null);
      setCurrentMoveIndex(-1);
    }
    setDeleteDialogOpen(false);
    setOpeningToDelete(null);
    toast.success('Opening deleted');
  }, [openings, openingToDelete, selectedOpening]);

  const handleDuplicate = useCallback(
    (opening: Opening) => {
      const duplicate = createOpening({
        ...opening,
        id: generateId(),
        name: `${opening.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const updated = [...openings, duplicate];
      setOpenings(updated);
      saveOpenings(updated);
      setSelectedOpening(duplicate);
      toast.success('Opening duplicated');
    },
    [openings]
  );

  const handleUpdateOpening = useCallback(
    (updates: Partial<Opening>) => {
      if (!selectedOpening) return;
      const updated = openings.map((o) =>
        o.id === selectedOpening.id
          ? { ...o, ...updates, updatedAt: new Date().toISOString() }
          : o
      );
      setOpenings(updated);
      const updatedOpening = updated.find((o) => o.id === selectedOpening.id);
      if (updatedOpening) {
        setSelectedOpening(updatedOpening);
      }
    },
    [openings, selectedOpening]
  );

  const handleSave = useCallback(() => {
    saveOpenings(openings);
    toast.success('Changes saved');
  }, [openings]);

  const handleMove = useCallback(
    (from: Square, to: Square): boolean => {
      if (!selectedOpening) return false;

      const result = isLegalMove(currentPosition, from, to);
      if (!result.valid || !result.san || !result.newFen) return false;

      // Add the move to the opening
      const newMove: ChessMove = {
        san: result.san,
        fen: result.newFen,
      };

      // If we're not at the end, truncate future moves
      const newMoves =
        currentMoveIndex < selectedOpening.moves.length - 1
          ? [...selectedOpening.moves.slice(0, currentMoveIndex + 1), newMove]
          : [...selectedOpening.moves, newMove];

      handleUpdateOpening({ moves: newMoves });
      setCurrentMoveIndex(newMoves.length - 1);
      setCurrentPosition(result.newFen);

      return true;
    },
    [selectedOpening, currentPosition, currentMoveIndex, handleUpdateOpening]
  );

  const handleMoveClick = useCallback(
    (index: number) => {
      setCurrentMoveIndex(index);
    },
    []
  );

  const handleAnnotationChange = useCallback(
    (index: number, annotation: MoveAnnotation | undefined) => {
      if (!selectedOpening) return;
      const newMoves = [...selectedOpening.moves];
      newMoves[index] = { ...newMoves[index], annotation };
      handleUpdateOpening({ moves: newMoves });
    },
    [selectedOpening, handleUpdateOpening]
  );

  const handleUndo = useCallback(() => {
    if (!selectedOpening || selectedOpening.moves.length === 0) return;
    const newMoves = selectedOpening.moves.slice(0, -1);
    handleUpdateOpening({ moves: newMoves });
    setCurrentMoveIndex(newMoves.length - 1);
  }, [selectedOpening, handleUpdateOpening]);

  const handleReset = useCallback(() => {
    handleUpdateOpening({ moves: [] });
    setCurrentMoveIndex(-1);
  }, [handleUpdateOpening]);

  // Navigation functions
  const goToStart = () => setCurrentMoveIndex(-1);
  const goToEnd = () =>
    setCurrentMoveIndex(selectedOpening ? selectedOpening.moves.length - 1 : -1);
  const goBack = () => setCurrentMoveIndex((i) => Math.max(-1, i - 1));
  const goForward = () =>
    setCurrentMoveIndex((i) =>
      selectedOpening ? Math.min(selectedOpening.moves.length - 1, i + 1) : i
    );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
        return;

      switch (e.key) {
        case 'ArrowLeft':
          goBack();
          break;
        case 'ArrowRight':
          goForward();
          break;
        case 'Home':
          goToStart();
          break;
        case 'End':
          goToEnd();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOpening]);

  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="flex-1 overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden h-full md:block">
          <ResizablePanelGroup direction="horizontal">
            {/* Left Sidebar - Repertoire List */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <div className="h-full border-r border-border bg-card">
                <RepertoireList
                  openings={openings}
                  selectedId={selectedOpening?.id || null}
                  onSelect={handleSelectOpening}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onCreateNew={handleCreateNew}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Center - Chessboard */}
            <ResizablePanel defaultSize={45} minSize={35}>
              <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
                <div className="w-full max-w-[min(100%,calc(100vh-200px))]">
                  <ChessboardDisplay
                    position={currentPosition}
                    orientation={boardOrientation}
                    onMove={handleMove}
                    interactive={!!selectedOpening}
                    lastMove={lastMove}
                  />
                </div>

                {/* Board Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToStart}
                    disabled={currentMoveIndex < 0}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goBack}
                    disabled={currentMoveIndex < 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goForward}
                    disabled={
                      !selectedOpening ||
                      currentMoveIndex >= selectedOpening.moves.length - 1
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToEnd}
                    disabled={
                      !selectedOpening ||
                      currentMoveIndex >= selectedOpening.moves.length - 1
                    }
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>

                  <div className="mx-2 h-6 w-px bg-border" />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setBoardOrientation((o) => (o === 'white' ? 'black' : 'white'))
                    }
                  >
                    <FlipVertical className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleUndo}
                    disabled={!selectedOpening || selectedOpening.moves.length === 0}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    disabled={!selectedOpening || selectedOpening.moves.length === 0}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Info & Moves */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={45}>
              <div className="h-full bg-card">
                {selectedOpening ? (
                  <Tabs defaultValue="moves" className="flex h-full flex-col">
                    <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3">
                      <TabsTrigger value="moves">Moves</TabsTrigger>
                      <TabsTrigger value="info">Info</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="moves" className="flex-1 overflow-hidden m-0 p-0">
                      <MoveList
                        moves={selectedOpening.moves}
                        currentMoveIndex={currentMoveIndex}
                        onMoveClick={handleMoveClick}
                        onAnnotationChange={handleAnnotationChange}
                        editable
                      />
                    </TabsContent>

                    <TabsContent value="info" className="flex-1 overflow-auto m-0">
                      <RepertoireForm
                        opening={selectedOpening}
                        onUpdate={handleUpdateOpening}
                        onSave={handleSave}
                      />
                    </TabsContent>

                    <TabsContent value="notes" className="flex-1 overflow-auto m-0 p-4">
                      <textarea
                        value={selectedOpening.notes}
                        onChange={(e) => handleUpdateOpening({ notes: e.target.value })}
                        placeholder="Add notes, strategic ideas, key points..."
                        className="h-full w-full resize-none rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>Select or create an opening to get started</p>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile Layout */}
        <div className="flex h-full flex-col md:hidden">
          <Tabs defaultValue="board" className="flex h-full flex-col">
            <TabsList className="mx-4 mt-2 grid grid-cols-3">
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="flex-1 overflow-hidden m-0">
              <RepertoireList
                openings={openings}
                selectedId={selectedOpening?.id || null}
                onSelect={handleSelectOpening}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onCreateNew={handleCreateNew}
              />
            </TabsContent>

            <TabsContent value="board" className="flex-1 overflow-auto m-0 p-4">
              <div className="mx-auto max-w-md space-y-4">
                <ChessboardDisplay
                  position={currentPosition}
                  orientation={boardOrientation}
                  onMove={handleMove}
                  interactive={!!selectedOpening}
                />

                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="icon" onClick={goToStart}>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goBack}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goForward}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToEnd}>
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setBoardOrientation((o) => (o === 'white' ? 'black' : 'white'))
                    }
                  >
                    <FlipVertical className="h-4 w-4" />
                  </Button>
                </div>

                {selectedOpening && (
                  <MoveList
                    moves={selectedOpening.moves}
                    currentMoveIndex={currentMoveIndex}
                    onMoveClick={handleMoveClick}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="info" className="flex-1 overflow-auto m-0">
              {selectedOpening ? (
                <RepertoireForm
                  opening={selectedOpening}
                  onUpdate={handleUpdateOpening}
                  onSave={handleSave}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground p-4">
                  <p>Select an opening first</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Opening</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this opening? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

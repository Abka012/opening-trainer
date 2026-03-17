'use client';

import { useState, useMemo, useCallback } from 'react';
import { Header } from '@/components/header';
import { ChessboardDisplay } from '@/components/chess/chessboard-display';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  ecoOpenings,
  ecoCategoryDescriptions,
  searchOpenings,
} from '@/lib/eco-data';
import { movesToChessMoves, parsePgnMoves, STARTING_FEN } from '@/lib/chess-utils';
import { loadOpenings, saveOpenings, createOpening } from '@/lib/repertoire-store';
import type { ECOOpening } from '@/lib/types';
import { Search, Plus, BookOpen, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function OpeningsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ecoFilter, setEcoFilter] = useState<string>('all');
  const [selectedOpening, setSelectedOpening] = useState<ECOOpening | null>(null);
  const [previewPosition, setPreviewPosition] = useState(STARTING_FEN);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [colorChoice, setColorChoice] = useState<'white' | 'black'>('white');

  // Filter openings based on search and ECO category
  const filteredOpenings = useMemo(() => {
    let result = ecoOpenings;

    // Filter by ECO category
    if (ecoFilter !== 'all') {
      result = result.filter((o) => o.eco.startsWith(ecoFilter));
    }

    // Filter by search query
    if (searchQuery) {
      result = searchOpenings(searchQuery).filter((o) =>
        ecoFilter === 'all' ? true : o.eco.startsWith(ecoFilter)
      );
    }

    return result;
  }, [searchQuery, ecoFilter]);

  // Group openings by ECO code prefix (first 2 characters)
  const groupedOpenings = useMemo(() => {
    const groups: Record<string, ECOOpening[]> = {};
    filteredOpenings.forEach((opening) => {
      const prefix = opening.eco.substring(0, 2);
      if (!groups[prefix]) {
        groups[prefix] = [];
      }
      groups[prefix].push(opening);
    });
    return groups;
  }, [filteredOpenings]);

  const handleOpeningSelect = useCallback((opening: ECOOpening) => {
    setSelectedOpening(opening);
    // Calculate the position after the moves
    const moves = parsePgnMoves(opening.moves);
    const chessMoves = movesToChessMoves(moves);
    if (chessMoves.length > 0) {
      setPreviewPosition(chessMoves[chessMoves.length - 1].fen);
    } else {
      setPreviewPosition(STARTING_FEN);
    }
  }, []);

  const handleAddToRepertoire = useCallback(() => {
    if (!selectedOpening) return;

    const moves = parsePgnMoves(selectedOpening.moves);
    const chessMoves = movesToChessMoves(moves);

    const newOpening = createOpening({
      name: selectedOpening.name,
      eco: selectedOpening.eco,
      color: colorChoice,
      moves: chessMoves,
    });

    const openings = loadOpenings();
    openings.push(newOpening);
    saveOpenings(openings);

    setAddDialogOpen(false);
    toast.success(`Added "${selectedOpening.name}" to your repertoire`);
  }, [selectedOpening, colorChoice]);

  const ecoCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'A', label: 'A - Flank Openings' },
    { value: 'B', label: 'B - Semi-Open Games' },
    { value: 'C', label: 'C - Open Games' },
    { value: 'D', label: 'D - Closed Games' },
    { value: 'E', label: 'E - Indian Defenses' },
  ];

  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto flex h-full flex-col gap-4 p-4 lg:flex-row">
          {/* Left Side - Opening List */}
          <div className="flex h-full flex-1 flex-col lg:max-w-2xl">
            {/* Search and Filter */}
            <div className="space-y-3 pb-4">
              <h1 className="text-2xl font-bold">Opening Database</h1>
              <p className="text-sm text-muted-foreground">
                Browse {ecoOpenings.length} chess openings organized by ECO code
              </p>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ECO code, or moves..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={ecoFilter} onValueChange={setEcoFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {ecoCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-muted-foreground">
                Showing {filteredOpenings.length} openings
              </p>
            </div>

            {/* Opening List */}
            <ScrollArea className="flex-1 rounded-lg border border-border">
              <div className="p-2">
                {Object.keys(groupedOpenings).length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <BookOpen className="mx-auto h-12 w-12 opacity-50" />
                    <p className="mt-2">No openings found</p>
                    <p className="text-sm">Try adjusting your search</p>
                  </div>
                ) : (
                  Object.entries(groupedOpenings)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([prefix, openings]) => (
                      <div key={prefix} className="mb-4">
                        <h3 className="sticky top-0 bg-background/95 py-1 text-sm font-semibold text-muted-foreground backdrop-blur">
                          {prefix} - {ecoCategoryDescriptions[prefix[0]] || 'Chess Openings'}
                        </h3>
                        <div className="space-y-1">
                          {openings.map((opening, idx) => (
                            <button
                              key={`${opening.eco}-${idx}`}
                              onClick={() => handleOpeningSelect(opening)}
                              className={`flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors ${
                                selectedOpening?.eco === opening.eco &&
                                selectedOpening?.name === opening.name
                                  ? 'bg-primary/10 text-primary'
                                  : 'hover:bg-secondary'
                              }`}
                            >
                              <Badge
                                variant="outline"
                                className="shrink-0 font-mono text-xs"
                              >
                                {opening.eco}
                              </Badge>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                  {opening.name}
                                </p>
                                <p className="truncate font-mono text-xs text-muted-foreground">
                                  {opening.moves}
                                </p>
                              </div>
                              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Side - Opening Preview */}
          <div className="flex h-full w-full flex-col lg:w-96">
            {selectedOpening ? (
              <Card className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col p-4">
                  {/* Opening Info */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono">
                        {selectedOpening.eco}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-bold">{selectedOpening.name}</h2>
                    <p className="font-mono text-sm text-muted-foreground">
                      {selectedOpening.moves}
                    </p>
                  </div>

                  {/* Chessboard Preview */}
                  <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-80">
                      <ChessboardDisplay
                        position={previewPosition}
                        interactive={false}
                      />
                    </div>
                  </div>

                  {/* Add to Repertoire Button */}
                  <Button
                    className="mt-4 w-full gap-2"
                    onClick={() => setAddDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add to Repertoire
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex h-full items-center justify-center">
                <CardContent className="text-center">
                  <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Select an Opening</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Click on an opening from the list to preview it
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Add to Repertoire Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Repertoire</DialogTitle>
            <DialogDescription>
              Choose which color you want to play this opening as.
            </DialogDescription>
          </DialogHeader>

          {selectedOpening && (
            <div className="py-4">
              <div className="mb-4 rounded-md bg-secondary p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {selectedOpening.eco}
                  </Badge>
                  <span className="font-medium">{selectedOpening.name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Playing As</label>
                <div className="flex gap-2">
                  <Button
                    variant={colorChoice === 'white' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setColorChoice('white')}
                  >
                    <div className="mr-2 h-4 w-4 rounded-full bg-foreground" />
                    White
                  </Button>
                  <Button
                    variant={colorChoice === 'black' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setColorChoice('black')}
                  >
                    <div className="mr-2 h-4 w-4 rounded-full bg-background border border-foreground" />
                    Black
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToRepertoire}>Add to Repertoire</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

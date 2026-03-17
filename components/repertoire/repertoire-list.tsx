'use client';

import { cn } from '@/lib/utils';
import type { Opening, RepertoireFilter } from '@/lib/types';
import { filterOpenings, getAllTags } from '@/lib/repertoire-store';
import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Trash2, Copy } from 'lucide-react';

interface RepertoireListProps {
  openings: Opening[];
  selectedId: string | null;
  onSelect: (opening: Opening) => void;
  onDelete: (id: string) => void;
  onDuplicate: (opening: Opening) => void;
  onCreateNew: () => void;
}

export function RepertoireList({
  openings,
  selectedId,
  onSelect,
  onDelete,
  onDuplicate,
  onCreateNew,
}: RepertoireListProps) {
  const [filter, setFilter] = useState<RepertoireFilter>({
    color: 'all',
    search: '',
    ecoRange: '',
    tags: [],
  });

  const allTags = useMemo(() => getAllTags(), [openings]);

  const filteredOpenings = useMemo(() => {
    let result = openings;

    // Filter by color
    if (filter.color !== 'all') {
      result = result.filter((o) => o.color === filter.color);
    }

    // Filter by search term
    if (filter.search) {
      const search = filter.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.name.toLowerCase().includes(search) ||
          o.eco.toLowerCase().includes(search)
      );
    }

    // Filter by ECO range
    if (filter.ecoRange) {
      result = result.filter((o) => o.eco.startsWith(filter.ecoRange));
    }

    return result;
  }, [openings, filter]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">My Repertoire</h2>
          <Button size="sm" onClick={onCreateNew} className="h-7 gap-1">
            <Plus className="h-3 w-3" />
            New
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2 border-b border-border p-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search openings..."
            value={filter.search}
            onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
            className="h-8 pl-8 text-sm"
          />
        </div>

        {/* Color Filter */}
        <div className="flex gap-2">
          <Select
            value={filter.color}
            onValueChange={(value) =>
              setFilter((f) => ({ ...f, color: value as 'all' | 'white' | 'black' }))
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="black">Black</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filter.ecoRange}
            onValueChange={(value) =>
              setFilter((f) => ({ ...f, ecoRange: value === 'all' ? '' : value }))
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="ECO" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ECO</SelectItem>
              <SelectItem value="A">A - Flank</SelectItem>
              <SelectItem value="B">B - Semi-Open</SelectItem>
              <SelectItem value="C">C - Open</SelectItem>
              <SelectItem value="D">D - Closed</SelectItem>
              <SelectItem value="E">E - Indian</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Opening List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredOpenings.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {openings.length === 0
                ? 'No openings yet. Create your first one!'
                : 'No openings match your filters.'}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredOpenings.map((opening) => (
                <div
                  key={opening.id}
                  className={cn(
                    'group relative cursor-pointer rounded-md border border-transparent p-2 transition-colors',
                    selectedId === opening.id
                      ? 'border-primary bg-primary/10'
                      : 'hover:bg-secondary'
                  )}
                  onClick={() => onSelect(opening)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            'h-5 px-1.5 text-[10px] font-mono',
                            opening.color === 'white'
                              ? 'border-foreground/30 bg-foreground/10'
                              : 'border-foreground/30 bg-foreground text-background'
                          )}
                        >
                          {opening.color === 'white' ? 'W' : 'B'}
                        </Badge>
                        {opening.eco && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-mono">
                            {opening.eco}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 truncate text-sm font-medium">
                        {opening.name}
                      </p>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {opening.moves.length > 0
                          ? opening.moves.slice(0, 4).map((m) => m.san).join(' ')
                          : 'No moves'}
                        {opening.moves.length > 4 && '...'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicate(opening);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(opening.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

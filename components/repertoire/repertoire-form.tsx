'use client';

import { useState, useEffect } from 'react';
import type { Opening } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X, Plus, Save } from 'lucide-react';

interface RepertoireFormProps {
  opening: Opening;
  onUpdate: (updates: Partial<Opening>) => void;
  onSave: () => void;
}

export function RepertoireForm({ opening, onUpdate, onSave }: RepertoireFormProps) {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim() && !opening.tags.includes(newTag.trim())) {
      onUpdate({ tags: [...opening.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    onUpdate({ tags: opening.tags.filter((t) => t !== tag) });
  };

  return (
    <div className="space-y-4 p-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs">Opening Name</Label>
        <Input
          id="name"
          value={opening.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="e.g., Sicilian Najdorf"
          className="h-8 text-sm"
        />
      </div>

      {/* ECO Code & Color */}
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <Label htmlFor="eco" className="text-xs">ECO Code</Label>
          <Input
            id="eco"
            value={opening.eco}
            onChange={(e) => onUpdate({ eco: e.target.value.toUpperCase() })}
            placeholder="e.g., B90"
            maxLength={3}
            className="h-8 font-mono text-sm uppercase"
          />
        </div>

        <div className="flex-1 space-y-2">
          <Label htmlFor="color" className="text-xs">Playing As</Label>
          <Select
            value={opening.color}
            onValueChange={(value) => onUpdate({ color: value as 'white' | 'black' })}
          >
            <SelectTrigger id="color" className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="black">Black</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-xs">Tags</Label>
        <div className="flex flex-wrap gap-1">
          {opening.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="h-6 gap-1 pr-1">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full hover:bg-foreground/10"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag..."
            className="h-7 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2"
            onClick={addTag}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-xs">Notes</Label>
        <Textarea
          id="notes"
          value={opening.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Add strategic notes, key ideas, or things to remember..."
          className="min-h-[120px] text-sm"
        />
      </div>

      {/* Stats */}
      {opening.practiceStats.attempts > 0 && (
        <div className="rounded-md bg-secondary/50 p-3">
          <h4 className="text-xs font-medium text-muted-foreground">Practice Stats</h4>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-semibold">{opening.practiceStats.attempts}</p>
              <p className="text-[10px] text-muted-foreground">Attempts</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{opening.practiceStats.correct}</p>
              <p className="text-[10px] text-muted-foreground">Correct</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {opening.practiceStats.attempts > 0
                  ? Math.round((opening.practiceStats.correct / opening.practiceStats.attempts) * 100)
                  : 0}%
              </p>
              <p className="text-[10px] text-muted-foreground">Accuracy</p>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <Button onClick={onSave} className="w-full gap-2">
        <Save className="h-4 w-4" />
        Save Changes
      </Button>
    </div>
  );
}

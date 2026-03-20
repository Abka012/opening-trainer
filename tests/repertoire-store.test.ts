import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateId,
  createDefaultPracticeStats,
  createOpening,
  loadOpenings,
  saveOpenings,
  addOpening,
  updateOpening,
  deleteOpening,
  getOpeningById,
  filterOpenings,
  getAllTags,
  updatePracticeStats,
  getOpeningsDueForReview,
  exportOpenings,
  importOpenings,
  getRepertoireStats,
} from '@/lib/repertoire-store';

const mockOpenings = [
  {
    id: 'test-1',
    name: 'Sicilian Defense',
    eco: 'B21',
    color: 'black' as const,
    moves: [],
    variations: [],
    notes: '',
    tags: ['aggressive', 'opening'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    lastStudied: null,
    practiceStats: {
      attempts: 5,
      correct: 4,
      lastAttempt: null,
      dueForReview: null,
    },
  },
  {
    id: 'test-2',
    name: 'Italian Game',
    eco: 'C50',
    color: 'white' as const,
    moves: [],
    variations: [],
    notes: 'Classic opening',
    tags: ['classical', 'opening'],
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    lastStudied: '2024-01-10T00:00:00.000Z',
    practiceStats: {
      attempts: 10,
      correct: 8,
      lastAttempt: '2024-01-10T00:00:00.000Z',
      dueForReview: '2024-01-15T00:00:00.000Z',
    },
  },
];

describe('repertoire-store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should include timestamp', () => {
      const id = generateId();
      expect(id).toMatch(/^\d+-/);
    });
  });

  describe('createDefaultPracticeStats', () => {
    it('should return default practice stats', () => {
      const stats = createDefaultPracticeStats();
      expect(stats).toEqual({
        attempts: 0,
        correct: 0,
        lastAttempt: null,
        dueForReview: null,
      });
    });
  });

  describe('createOpening', () => {
    it('should create opening with defaults', () => {
      const opening = createOpening({ name: 'Test Opening' });
      expect(opening.name).toBe('Test Opening');
      expect(opening.eco).toBe('');
      expect(opening.color).toBe('white');
      expect(opening.moves).toEqual([]);
      expect(opening.tags).toEqual([]);
      expect(opening.id).toBeDefined();
    });

    it('should preserve provided values', () => {
      const opening = createOpening({
        name: 'Test',
        eco: 'A00',
        color: 'black',
        tags: ['test'],
      });
      expect(opening.eco).toBe('A00');
      expect(opening.color).toBe('black');
      expect(opening.tags).toEqual(['test']);
    });
  });

  describe('loadOpenings', () => {
    it('should return empty array when no data', () => {
      const openings = loadOpenings();
      expect(openings).toEqual([]);
    });

    it('should parse and return stored data', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify(mockOpenings));
      const openings = loadOpenings();
      expect(openings).toEqual(mockOpenings);
    });

    it('should return empty array on parse error', () => {
      localStorage.setItem('chess-repertoire', 'invalid json');
      const openings = loadOpenings();
      expect(openings).toEqual([]);
    });
  });

  describe('saveOpenings', () => {
    it('should save openings to localStorage', () => {
      saveOpenings(mockOpenings);
      const stored = localStorage.getItem('chess-repertoire');
      expect(JSON.parse(stored!)).toEqual(mockOpenings);
    });
  });

  describe('addOpening', () => {
    it('should add opening to existing list', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify([mockOpenings[0]]));
      const newOpening = createOpening({ name: 'New' });
      const openings = addOpening(newOpening);
      expect(openings.length).toBe(2);
      expect(openings[1].name).toBe('New');
    });
  });

  describe('updateOpening', () => {
    it('should update existing opening', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify([mockOpenings[0]]));
      const openings = updateOpening('test-1', { name: 'Updated' });
      expect(openings[0].name).toBe('Updated');
    });

    it('should not modify if not found', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify([mockOpenings[0]]));
      const openings = updateOpening('non-existent', { name: 'Updated' });
      expect(openings[0].name).toBe('Sicilian Defense');
    });
  });

  describe('deleteOpening', () => {
    it('should remove opening by id', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify(mockOpenings));
      const openings = deleteOpening('test-1');
      expect(openings.length).toBe(1);
      expect(openings[0].id).toBe('test-2');
    });
  });

  describe('getOpeningById', () => {
    it('should return opening by id', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify(mockOpenings));
      const opening = getOpeningById('test-1');
      expect(opening?.name).toBe('Sicilian Defense');
    });

    it('should return undefined for non-existent id', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify(mockOpenings));
      const opening = getOpeningById('non-existent');
      expect(opening).toBeUndefined();
    });
  });

  describe('filterOpenings', () => {
    beforeEach(() => {
      localStorage.setItem('chess-repertoire', JSON.stringify(mockOpenings));
    });

    it('should filter by white color', () => {
      const openings = filterOpenings({ color: 'white', search: '', ecoRange: '', tags: [] });
      expect(openings.length).toBe(1);
      expect(openings[0].color).toBe('white');
    });

    it('should filter by black color', () => {
      const openings = filterOpenings({ color: 'black', search: '', ecoRange: '', tags: [] });
      expect(openings.length).toBe(1);
      expect(openings[0].color).toBe('black');
    });

    it('should filter by search term', () => {
      const openings = filterOpenings({ color: 'all', search: 'Italian', ecoRange: '', tags: [] });
      expect(openings.length).toBe(1);
      expect(openings[0].name).toBe('Italian Game');
    });

    it('should filter by tags', () => {
      const openings = filterOpenings({ color: 'all', search: '', ecoRange: '', tags: ['aggressive'] });
      expect(openings.length).toBe(1);
      expect(openings[0].name).toBe('Sicilian Defense');
    });

    it('should filter by ECO range', () => {
      const openings = filterOpenings({ color: 'all', search: '', ecoRange: 'B', tags: [] });
      expect(openings.length).toBe(1);
      expect(openings[0].eco).toBe('B21');
    });
  });

  describe('getAllTags', () => {
    it('should return sorted unique tags', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify(mockOpenings));
      const tags = getAllTags();
      expect(tags).toEqual(['aggressive', 'classical', 'opening']);
    });
  });

  describe('updatePracticeStats', () => {
    it('should increment attempts on correct answer', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify([mockOpenings[0]]));
      updatePracticeStats('test-1', true);
      const openings = loadOpenings();
      expect(openings[0].practiceStats.attempts).toBe(6);
      expect(openings[0].practiceStats.correct).toBe(5);
    });

    it('should not increment correct on wrong answer', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify([mockOpenings[0]]));
      updatePracticeStats('test-1', false);
      const openings = loadOpenings();
      expect(openings[0].practiceStats.attempts).toBe(6);
      expect(openings[0].practiceStats.correct).toBe(4);
    });

    it('should set dueForReview date', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify([mockOpenings[0]]));
      updatePracticeStats('test-1', true);
      const openings = loadOpenings();
      expect(openings[0].practiceStats.dueForReview).not.toBeNull();
    });
  });

  describe('getOpeningsDueForReview', () => {
    it('should return openings due for review', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify(mockOpenings));
      const openings = getOpeningsDueForReview();
      expect(openings.length).toBe(2);
    });

    it('should filter out openings not due', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const modified = [
        {
          ...mockOpenings[0],
          practiceStats: { ...mockOpenings[0].practiceStats, dueForReview: futureDate.toISOString() },
        },
        mockOpenings[1],
      ];
      localStorage.setItem('chess-repertoire', JSON.stringify(modified));
      const openings = getOpeningsDueForReview();
      expect(openings.length).toBe(1);
    });
  });

  describe('exportOpenings', () => {
    it('should export openings as JSON', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify(mockOpenings));
      const json = exportOpenings();
      expect(JSON.parse(json)).toEqual(mockOpenings);
    });
  });

  describe('importOpenings', () => {
    it('should import and merge openings', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify([mockOpenings[0]]));
      const newOpenings = [{ ...mockOpenings[1] }];
      const imported = importOpenings(JSON.stringify(newOpenings));
      expect(imported.length).toBe(2);
    });

    it('should not duplicate existing openings', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify([mockOpenings[0]]));
      const imported = importOpenings(JSON.stringify([mockOpenings[0]]));
      expect(imported.length).toBe(1);
    });

    it('should throw on invalid JSON', () => {
      expect(() => importOpenings('invalid')).toThrow('Invalid JSON format');
    });
  });

  describe('getRepertoireStats', () => {
    it('should calculate correct statistics', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify(mockOpenings));
      const stats = getRepertoireStats();
      expect(stats.total).toBe(2);
      expect(stats.white).toBe(1);
      expect(stats.black).toBe(1);
      expect(stats.practiced).toBe(2);
      expect(stats.accuracy).toBe(80);
    });

    it('should return 0 accuracy with no attempts', () => {
      localStorage.setItem('chess-repertoire', JSON.stringify([
        { ...mockOpenings[0], practiceStats: createDefaultPracticeStats() },
      ]));
      const stats = getRepertoireStats();
      expect(stats.accuracy).toBe(0);
    });
  });
});

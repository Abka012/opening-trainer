import type { Opening, RepertoireFilter, PracticeStats } from './types';

const STORAGE_KEY = 'chess-repertoire';

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Default practice stats
export function createDefaultPracticeStats(): PracticeStats {
  return {
    attempts: 0,
    correct: 0,
    lastAttempt: null,
    dueForReview: null,
  };
}

// Create a new opening with defaults
export function createOpening(partial: Partial<Opening>): Opening {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name: partial.name || 'New Opening',
    eco: partial.eco || '',
    color: partial.color || 'white',
    moves: partial.moves || [],
    variations: partial.variations || [],
    notes: partial.notes || '',
    tags: partial.tags || [],
    createdAt: now,
    updatedAt: now,
    lastStudied: null,
    practiceStats: createDefaultPracticeStats(),
    ...partial,
  };
}

// Load all openings from localStorage
export function loadOpenings(): Opening[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Opening[];
  } catch (error) {
    console.error('Failed to load openings:', error);
    return [];
  }
}

// Save all openings to localStorage
export function saveOpenings(openings: Opening[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(openings));
  } catch (error) {
    console.error('Failed to save openings:', error);
  }
}

// Add a new opening
export function addOpening(opening: Opening): Opening[] {
  const openings = loadOpenings();
  openings.push(opening);
  saveOpenings(openings);
  return openings;
}

// Update an existing opening
export function updateOpening(id: string, updates: Partial<Opening>): Opening[] {
  const openings = loadOpenings();
  const index = openings.findIndex(o => o.id === id);
  
  if (index !== -1) {
    openings[index] = {
      ...openings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveOpenings(openings);
  }
  
  return openings;
}

// Delete an opening
export function deleteOpening(id: string): Opening[] {
  const openings = loadOpenings().filter(o => o.id !== id);
  saveOpenings(openings);
  return openings;
}

// Get a single opening by ID
export function getOpeningById(id: string): Opening | undefined {
  return loadOpenings().find(o => o.id === id);
}

// Filter openings
export function filterOpenings(filter: RepertoireFilter): Opening[] {
  let openings = loadOpenings();
  
  // Filter by color
  if (filter.color !== 'all') {
    openings = openings.filter(o => o.color === filter.color);
  }
  
  // Filter by search term
  if (filter.search) {
    const search = filter.search.toLowerCase();
    openings = openings.filter(
      o =>
        o.name.toLowerCase().includes(search) ||
        o.eco.toLowerCase().includes(search) ||
        o.tags.some(t => t.toLowerCase().includes(search))
    );
  }
  
  // Filter by ECO range
  if (filter.ecoRange) {
    openings = openings.filter(o => o.eco.startsWith(filter.ecoRange));
  }
  
  // Filter by tags
  if (filter.tags.length > 0) {
    openings = openings.filter(o =>
      filter.tags.some(tag => o.tags.includes(tag))
    );
  }
  
  return openings;
}

// Get all unique tags
export function getAllTags(): string[] {
  const openings = loadOpenings();
  const tagSet = new Set<string>();
  
  openings.forEach(o => {
    o.tags.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

// Update practice stats after a practice session
export function updatePracticeStats(
  id: string,
  correct: boolean
): Opening[] {
  const openings = loadOpenings();
  const index = openings.findIndex(o => o.id === id);
  
  if (index !== -1) {
    const opening = openings[index];
    const stats = opening.practiceStats;
    
    stats.attempts += 1;
    if (correct) {
      stats.correct += 1;
    }
    stats.lastAttempt = new Date().toISOString();
    
    // Simple spaced repetition: if correct, review later; if wrong, review sooner
    const daysUntilReview = correct
      ? Math.min(30, Math.pow(2, stats.correct))
      : 1;
    
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysUntilReview);
    stats.dueForReview = nextReview.toISOString();
    
    opening.lastStudied = new Date().toISOString();
    
    saveOpenings(openings);
  }
  
  return openings;
}

// Get openings due for review
export function getOpeningsDueForReview(): Opening[] {
  const openings = loadOpenings();
  const now = new Date();
  
  return openings.filter(o => {
    if (!o.practiceStats.dueForReview) return true;
    return new Date(o.practiceStats.dueForReview) <= now;
  });
}

// Export openings as JSON
export function exportOpenings(): string {
  const openings = loadOpenings();
  return JSON.stringify(openings, null, 2);
}

// Import openings from JSON
export function importOpenings(json: string): Opening[] {
  try {
    const imported = JSON.parse(json) as Opening[];
    const existing = loadOpenings();
    
    // Merge imported openings, avoiding duplicates by ID
    const existingIds = new Set(existing.map(o => o.id));
    const newOpenings = imported.filter(o => !existingIds.has(o.id));
    
    const merged = [...existing, ...newOpenings];
    saveOpenings(merged);
    return merged;
  } catch (error) {
    console.error('Failed to import openings:', error);
    throw new Error('Invalid JSON format');
  }
}

// Get repertoire statistics
export function getRepertoireStats(): {
  total: number;
  white: number;
  black: number;
  practiced: number;
  accuracy: number;
} {
  const openings = loadOpenings();
  
  const stats = {
    total: openings.length,
    white: openings.filter(o => o.color === 'white').length,
    black: openings.filter(o => o.color === 'black').length,
    practiced: openings.filter(o => o.practiceStats.attempts > 0).length,
    accuracy: 0,
  };
  
  const totalAttempts = openings.reduce(
    (sum, o) => sum + o.practiceStats.attempts,
    0
  );
  const totalCorrect = openings.reduce(
    (sum, o) => sum + o.practiceStats.correct,
    0
  );
  
  if (totalAttempts > 0) {
    stats.accuracy = Math.round((totalCorrect / totalAttempts) * 100);
  }
  
  return stats;
}

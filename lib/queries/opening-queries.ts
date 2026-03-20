import { createClient } from '@/lib/supabase/client';
import type { Opening } from '@/lib/types';

export const openingQueries = {
  getOpenings: async (): Promise<Opening[]> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
      .from('openings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(transformOpening);
  },

  getOpening: async (id: string): Promise<Opening | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('openings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return transformOpening(data);
  },

  createOpening: async (opening: Omit<Opening, 'id' | 'created_at' | 'updated_at'>): Promise<Opening> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('openings')
      .insert({
        ...opening,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return transformOpening(data);
  },

  updateOpening: async (id: string, updates: Partial<Opening>): Promise<Opening> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('openings')
      .update(transformOpeningToDb(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return transformOpening(data);
  },

  deleteOpening: async (id: string): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
      .from('openings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  syncOpenings: async (openings: Opening[]): Promise<Opening[]> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');

    const unsyncedOpenings = openings.filter(o => !o.practiceStats);
    
    if (unsyncedOpenings.length === 0) return openings;

    const { data, error } = await supabase
      .from('openings')
      .upsert(unsyncedOpenings.map(o => ({
        ...transformOpeningToDb(o),
        user_id: user.id,
      })))
      .select();

    if (error) throw error;
    return data.map(transformOpening);
  },
};

function transformOpening(dbOpening: Record<string, unknown>): Opening {
  return {
    id: dbOpening.id as string,
    name: dbOpening.name as string,
    eco: dbOpening.eco as string || '',
    color: dbOpening.color as 'white' | 'black',
    moves: dbOpening.moves as Opening['moves'] || [],
    variations: dbOpening.variations as Opening['variations'] || [],
    notes: dbOpening.notes as string || '',
    tags: dbOpening.tags as string[] || [],
    practiceStats: dbOpening.practice_stats as Opening['practiceStats'] || {
      attempts: 0,
      correct: 0,
      lastAttempt: null,
      dueForReview: null,
    },
    createdAt: dbOpening.created_at as string,
    updatedAt: dbOpening.updated_at as string,
    lastStudied: dbOpening.last_studied as string | null,
  };
}

function transformOpeningToDb(opening: Partial<Opening>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  if (opening.name !== undefined) result.name = opening.name;
  if (opening.eco !== undefined) result.eco = opening.eco;
  if (opening.color !== undefined) result.color = opening.color;
  if (opening.moves !== undefined) result.moves = opening.moves;
  if (opening.variations !== undefined) result.variations = opening.variations;
  if (opening.notes !== undefined) result.notes = opening.notes;
  if (opening.tags !== undefined) result.tags = opening.tags;
  if (opening.practiceStats !== undefined) result.practice_stats = opening.practiceStats;
  if (opening.lastStudied !== undefined) result.last_studied = opening.lastStudied;
  
  return result;
}

import { loadOpenings } from '@/lib/repertoire-store';
import { openingQueries } from '@/lib/queries/opening-queries';
import type { Opening } from '@/lib/types';

export async function migrateLocalToSupabase(): Promise<{
  success: boolean;
  migrated: number;
  error?: string;
}> {
  try {
    const localOpenings = loadOpenings();

    if (localOpenings.length === 0) {
      return { success: true, migrated: 0 };
    }

    const migratedOpenings = await openingQueries.syncOpenings(localOpenings);

    return {
      success: true,
      migrated: migratedOpenings.length,
    };
  } catch (error) {
    return {
      success: false,
      migrated: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function exportToSupabaseFormat(openings: Opening[]): string {
  return JSON.stringify(openings, null, 2);
}

export function parseSupabaseExport(json: string): Opening[] {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) {
      throw new Error('Expected an array of openings');
    }
    return data;
  } catch {
    throw new Error('Invalid JSON format');
  }
}

export function getLocalStorageSize(): number {
  if (typeof window === 'undefined') return 0;
  
  const data = localStorage.getItem('chess-repertoire');
  if (!data) return 0;
  
  return new Blob([data]).size;
}

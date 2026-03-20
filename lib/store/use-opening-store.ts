import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Opening, RepertoireFilter } from '@/lib/types';
import { createOpening, createDefaultPracticeStats } from '@/lib/repertoire-store';

interface OpeningState {
  openings: Opening[];
  currentOpeningId: string | null;
  filter: RepertoireFilter;
  isLoading: boolean;
  isSynced: boolean;
  
  setOpenings: (openings: Opening[]) => void;
  addOpening: (opening?: Partial<Opening>) => Opening;
  updateOpening: (id: string, updates: Partial<Opening>) => void;
  deleteOpening: (id: string) => void;
  setCurrentOpening: (id: string | null) => void;
  setFilter: (filter: Partial<RepertoireFilter>) => void;
  setLoading: (loading: boolean) => void;
  setSynced: (synced: boolean) => void;
  getFilteredOpenings: () => Opening[];
  getOpeningById: (id: string) => Opening | undefined;
  getAllTags: () => string[];
  updatePracticeStats: (id: string, correct: boolean) => void;
}

export const useOpeningStore = create<OpeningState>()(
  persist(
    (set, get) => ({
      openings: [],
      currentOpeningId: null,
      filter: {
        color: 'all',
        search: '',
        ecoRange: '',
        tags: [],
      },
      isLoading: false,
      isSynced: false,

      setOpenings: (openings) => set({ openings }),

      addOpening: (partial = {}) => {
        const opening = createOpening(partial);
        set((state) => ({
          openings: [...state.openings, opening],
          currentOpeningId: opening.id,
          isSynced: false,
        }));
        return opening;
      },

      updateOpening: (id, updates) => {
        set((state) => ({
          openings: state.openings.map((o) =>
            o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
          ),
          isSynced: false,
        }));
      },

      deleteOpening: (id) => {
        set((state) => ({
          openings: state.openings.filter((o) => o.id !== id),
          currentOpeningId:
            state.currentOpeningId === id ? null : state.currentOpeningId,
          isSynced: false,
        }));
      },

      setCurrentOpening: (id) => set({ currentOpeningId: id }),

      setFilter: (filter) => {
        set((state) => ({
          filter: { ...state.filter, ...filter },
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setSynced: (synced) => set({ isSynced: synced }),

      getFilteredOpenings: () => {
        const { openings, filter } = get();
        let filtered = [...openings];

        if (filter.color !== 'all') {
          filtered = filtered.filter((o) => o.color === filter.color);
        }

        if (filter.search) {
          const search = filter.search.toLowerCase();
          filtered = filtered.filter(
            (o) =>
              o.name.toLowerCase().includes(search) ||
              o.eco.toLowerCase().includes(search) ||
              o.tags.some((t) => t.toLowerCase().includes(search))
          );
        }

        if (filter.ecoRange) {
          filtered = filtered.filter((o) => o.eco.startsWith(filter.ecoRange));
        }

        if (filter.tags.length > 0) {
          filtered = filtered.filter((o) =>
            filter.tags.some((tag) => o.tags.includes(tag))
          );
        }

        return filtered;
      },

      getOpeningById: (id) => {
        return get().openings.find((o) => o.id === id);
      },

      getAllTags: () => {
        const tags = new Set<string>();
        get().openings.forEach((o) => o.tags.forEach((t) => tags.add(t)));
        return Array.from(tags).sort();
      },

      updatePracticeStats: (id, correct) => {
        set((state) => ({
          openings: state.openings.map((o) => {
            if (o.id !== id) return o;
            const stats = { ...o.practiceStats };
            stats.attempts += 1;
            if (correct) stats.correct += 1;
            stats.lastAttempt = new Date().toISOString();

            const daysUntilReview = correct
              ? Math.min(30, Math.pow(2, stats.correct))
              : 1;

            const nextReview = new Date();
            nextReview.setDate(nextReview.getDate() + daysUntilReview);
            stats.dueForReview = nextReview.toISOString();

            return {
              ...o,
              practiceStats: stats,
              lastStudied: new Date().toISOString(),
            };
          }),
          isSynced: false,
        }));
      },
    }),
    {
      name: 'opening-store',
      partialize: (state) => ({
        openings: state.openings,
        isSynced: state.isSynced,
      }),
    }
  )
);

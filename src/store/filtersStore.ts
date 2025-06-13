import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types simplifiés pour l'affichage uniquement
export interface SimpleBrulageFilters {
  commune?: string;
  statut?: string;
  campagne?: string;
  dateStart?: string;
  dateEnd?: string;
  type?: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface DateFilters {
  dateStart?: string;
  dateEnd?: string;
}

interface SimpleFiltersState {
  // Filtres brûlages
  filters: SimpleBrulageFilters;
  sort: SortConfig;
  view: 'table' | 'cards' | 'map';
  pageSize: number;
  
  // Filtres rapides
  quickFilter: 'all' | 'recent' | 'active' | 'completed' | null;
  
  // UI State
  filtersVisible: boolean;
  searchQuery: string;
  
  // ✅ Cache pour les filtres de dates
  _cachedDateFilters?: DateFilters;
  
  // Actions simples
  setFilters: (filters: Partial<SimpleBrulageFilters>) => void;
  resetFilters: () => void;
  setSort: (sort: SortConfig) => void;
  setView: (view: 'table' | 'cards' | 'map') => void;
  setPageSize: (size: number) => void;
  setQuickFilter: (filter: 'all' | 'recent' | 'active' | 'completed' | null) => void;
  setSearchQuery: (query: string) => void;
  toggleFiltersVisible: () => void;
  
  // Utilitaires
  hasActiveFilters: () => boolean;
  getFilterCount: () => number;
  
  // ✅ FONCTION CORRIGÉE avec cache
  getDateFilters: () => DateFilters;
}

const defaultFilters: SimpleBrulageFilters = {};

const defaultSort: SortConfig = {
  field: 'date_realisation',
  direction: 'desc'
};

export const useFiltersStore = create<SimpleFiltersState>()(
  persist(
    (set, get) => ({
      // État initial
      filters: defaultFilters,
      sort: defaultSort,
      view: 'cards', // Par défaut sur cards pour mobile
      pageSize: 12,
      quickFilter: 'all',
      filtersVisible: false, // Masqué par défaut sur mobile
      searchQuery: '',
      _cachedDateFilters: undefined,

      // Actions
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters },
        // ✅ Invalidate cache when filters change
        _cachedDateFilters: undefined
      })),

      resetFilters: () => set({
        filters: defaultFilters,
        quickFilter: 'all',
        searchQuery: '',
        // ✅ Invalidate cache
        _cachedDateFilters: undefined
      }),

      setSort: (sort) => set({ sort }),

      setView: (view) => set({ view }),

      setPageSize: (pageSize) => set({ pageSize }),

      setQuickFilter: (quickFilter) => {
        // Appliquer les filtres rapides
        let filters: SimpleBrulageFilters = {};
        
        switch (quickFilter) {
          case 'recent':
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            filters.dateStart = thirtyDaysAgo.toISOString().split('T')[0];
            break;
          case 'active':
            filters.statut = 'EN_COURS';
            break;
          case 'completed':
            filters.statut = 'TERMINE';
            break;
          case 'all':
          default:
            filters = {};
            break;
        }

        set({ 
          quickFilter, 
          filters, 
          // ✅ Invalidate cache
          _cachedDateFilters: undefined 
        });
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      toggleFiltersVisible: () => set((state) => ({
        filtersVisible: !state.filtersVisible
      })),

      // Utilitaires
      hasActiveFilters: () => {
        const { filters, searchQuery, quickFilter } = get();
        
        const hasFilters = Object.values(filters).some(value => 
          value !== undefined && value !== null && value !== ''
        );

        return hasFilters || searchQuery !== '' || quickFilter !== 'all';
      },

      getFilterCount: () => {
        const { filters, searchQuery } = get();
        
        let count = 0;
        
        // Compter les filtres actifs
        count += Object.values(filters).filter(value => 
          value !== undefined && value !== null && value !== ''
        ).length;
        
        // Compter la recherche
        if (searchQuery !== '') count += 1;
        
        return count;
      },

      // ✅ FONCTION CORRIGÉE avec mémorisation
      getDateFilters: (): DateFilters => {
        const state = get();
        const { filters, _cachedDateFilters } = state;
        
        // Créer la nouvelle valeur
        const newDateFilters: DateFilters = {
          dateStart: filters.dateStart,
          dateEnd: filters.dateEnd
        };
        
        // Si on a un cache et que les valeurs sont identiques, retourner le cache
        if (_cachedDateFilters && 
            _cachedDateFilters.dateStart === newDateFilters.dateStart && 
            _cachedDateFilters.dateEnd === newDateFilters.dateEnd) {
          return _cachedDateFilters;
        }
        
        // Sinon, mettre à jour le cache et retourner la nouvelle valeur
        set({ _cachedDateFilters: newDateFilters });
        return newDateFilters;
      }
    }),
    {
      name: 'simple-filters-store',
      // Persister seulement l'essentiel
      partialize: (state) => ({
        view: state.view,
        pageSize: state.pageSize
      })
    }
  )
);
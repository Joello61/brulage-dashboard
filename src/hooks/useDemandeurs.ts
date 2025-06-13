import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { DemandeursApi } from '@/api/demandeurs';
import { useFiltersStore } from '@/store/filtersStore';

// Hook principal pour la liste des demandeurs (INCHANGÉ - pas besoin de filtres globaux)
export function useDemandeurs(params?: {
  type?: string;
  search?: string;
  limit?: number;
  page?: number;
  enabled?: boolean;
}) {
  const { type, search, limit = 50, page = 1, enabled = true } = params || {};

  return useQuery({
    queryKey: ['demandeurs', type, search, limit, page],
    queryFn: () => DemandeursApi.getList({ type, search, limit, page }),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// Hook pour un demandeur spécifique (INCHANGÉ)
export function useDemandeur(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['demandeur', id],
    queryFn: () => DemandeursApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });
}

// ✅ Hook pour les statistiques des demandeurs avec filtres
export function useDemandeursStats() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd
  }), [dateStart, dateEnd]);
  
  return useQuery({
    queryKey: ['demandeurs', 'stats', filters],
    queryFn: () => DemandeursApi.getStats(filters),
    staleTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
  });
}

// ✅ Hook pour l'analyse de performance des demandeurs avec filtres
export function useDemandeursPerformance(params?: {
  limit?: number;
  sortBy?: 'taux_moyen' | 'total_brulages' | 'surface_totale';
}) {
  const { limit = 20, sortBy = 'taux_moyen' } = params || {};
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd
  }), [dateStart, dateEnd]);

  return useQuery({
    queryKey: ['demandeurs', 'performance', limit, sortBy, filters],
    queryFn: () => DemandeursApi.getPerformance({ limit, sortBy, filters }),
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });
}

// ✅ Hook pour les statistiques par type de demandeur avec filtres
export function useDemandeursTypes() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd
  }), [dateStart, dateEnd]);
  
  return useQuery({
    queryKey: ['demandeurs', 'types', filters],
    queryFn: () => DemandeursApi.getTypes(filters),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

// Hook pour les demandeurs actifs (INCHANGÉ - a déjà son propre filtre temporel)
export function useDemandeursActive(months: number = 12) {
  return useQuery({
    queryKey: ['demandeurs', 'active', months],
    queryFn: () => DemandeursApi.getActive(months),
    staleTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
  });
}

// Hook pour l'analyse de fidélité (INCHANGÉ - analyse globale)
export function useDemandeursLoyalty() {
  return useQuery({
    queryKey: ['demandeurs', 'loyalty'],
    queryFn: () => DemandeursApi.getLoyalty(),
    staleTime: 60 * 60 * 1000, // 1 heure
    retry: 2,
  });
}

// Hook pour la recherche avancée de demandeurs (INCHANGÉ - a déjà ses propres filtres)
export function useDemandeursSearchAdvanced(params?: {
  type?: string;
  region?: string;
  dateStart?: string;
  dateEnd?: string;
  minBrulages?: number;
  minSuccessRate?: number;
  enabled?: boolean;
}) {
  const { enabled = true, ...searchParams } = params || {};

  return useQuery({
    queryKey: ['demandeurs', 'search', 'advanced', searchParams],
    queryFn: () => DemandeursApi.searchAdvanced(searchParams),
    enabled: enabled && Object.values(searchParams).some(v => v !== undefined && v !== ''),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Hook pour les tendances d'activité des demandeurs (INCHANGÉ - a déjà son propre paramètre temporel)
export function useDemandeursTrends(years: number = 3) {
  return useQuery({
    queryKey: ['demandeurs', 'trends', years],
    queryFn: () => DemandeursApi.getTrends(years),
    staleTime: 60 * 60 * 1000, // 1 heure
    retry: 2,
  });
}
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { CommunesApi } from '@/api/communes';
import { useFiltersStore } from '@/store/filtersStore';

// ✅ Hook principal pour la liste des communes avec filtres
export function useCommunes(params?: {
  search?: string;
  withBrulages?: boolean;
  limit?: number;
  enabled?: boolean;
}) {
  const { search, withBrulages = false, limit = 50, enabled = true } = params || {};
  
  // ✅ Accès direct aux propriétés individuelles
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  
  // ✅ Mémorisation de l'objet filters
  const filters = useMemo(() => ({
    dateStart,
    dateEnd
  }), [dateStart, dateEnd]);

  return useQuery({
    queryKey: ['communes', search, withBrulages, limit, filters],
    queryFn: () => CommunesApi.getList({ search, withBrulages, limit, filters }),
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });
}

// Hook pour une commune spécifique (INCHANGÉ)
export function useCommune(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['commune', id],
    queryFn: () => CommunesApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
  });
}

// ✅ Hook pour les données GeoJSON des communes avec filtres
export function useCommunesGeoJson(withDetails: boolean = false) {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd
  }), [dateStart, dateEnd]);
  
  return useQuery({
    queryKey: ['communes', 'geojson', withDetails, filters],
    queryFn: () => CommunesApi.getGeoJson({ withDetails, filters }),
    staleTime: 60 * 60 * 1000, // 1 heure (données géo stables)
    retry: 2,
  });
}

// ✅ Hook pour les statistiques des communes avec filtres
export function useCommunesStats() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd
  }), [dateStart, dateEnd]);
  
  return useQuery({
    queryKey: ['communes', 'stats', filters],
    queryFn: () => CommunesApi.getStats(filters),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

// Hook pour la recherche de communes (INCHANGÉ - pas besoin de filtres)
export function useCommunesSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['communes', 'search', query],
    queryFn: () => CommunesApi.search(query),
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Hook pour la recherche avancée de communes (INCHANGÉ - a déjà ses propres filtres)
export function useCommunesSearchAdvanced(params?: {
  region?: string;
  departement?: string;
  minPopulation?: number;
  maxPopulation?: number;
  hasActiveBrulages?: boolean;
  enabled?: boolean;
}) {
  const { enabled = true, ...searchParams } = params || {};

  return useQuery({
    queryKey: ['communes', 'search', 'advanced', searchParams],
    queryFn: () => CommunesApi.searchAdvanced(searchParams),
    enabled: enabled && Object.values(searchParams).some(v => v !== undefined && v !== ''),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// ✅ Hook pour les données par région avec filtres
export function useCommunesRegions() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd
  }), [dateStart, dateEnd]);
  
  return useQuery({
    queryKey: ['communes', 'regions', filters],
    queryFn: () => CommunesApi.getRegions(filters),
    staleTime: 60 * 60 * 1000, // 1 heure
    retry: 2,
  });
}

// ✅ Hook pour l'analyse de couverture géographique avec filtres
export function useCommunesCoverage() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd
  }), [dateStart, dateEnd]);
  
  return useQuery({
    queryKey: ['communes', 'coverage', filters],
    queryFn: () => CommunesApi.getCoverage(filters),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}
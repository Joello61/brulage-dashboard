import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { AnalyticsApi } from '@/api/analytics';
import { useFiltersStore } from '@/store/filtersStore';

//Hook simplifié pour les données du dashboard
export function useAnalyticsDashboard() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune); 
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd,
    commune
  }), [dateStart, dateEnd, commune]);
  
  return useQuery({
    queryKey: ['analytics', 'dashboard', filters],
    queryFn: () => AnalyticsApi.getDashboard(filters),
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });
}

//Hook pour les métriques de performance
export function usePerformanceMetrics() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune); 
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd,
    commune
  }), [dateStart, dateEnd, commune]);
  
  return useQuery({
    queryKey: ['analytics', 'performance', filters],
    queryFn: () => AnalyticsApi.getPerformance(filters),
    staleTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
  });
}

//Hook pour les données cartographiques
export function useMapAnalytics() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune); 
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd,
    commune
  }), [dateStart, dateEnd, commune]);
  
  return useQuery({
    queryKey: ['analytics', 'maps', filters],
    queryFn: () => AnalyticsApi.getMapData(filters),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

//Hook pour l'analyse des conditions météorologiques (INCHANGÉ)
export function useAnalyticsConditions(period: string = 'year') {
  return useQuery({
    queryKey: ['analytics', 'conditions', period],
    queryFn: () => AnalyticsApi.getConditions(period),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

//Hook pour les tendances avec prédictions
export function useAnalyticsTrends(years: number = 3) {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune); 
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd,
    commune
  }), [dateStart, dateEnd, commune]);
  
  return useQuery({
    queryKey: ['analytics', 'trends', years, filters],
    queryFn: () => AnalyticsApi.getTrends({ years, filters }),
    staleTime: 60 * 60 * 1000, // 1 heure
    retry: 2,
  });
}

//Hook pour les prédictions et recommandations (INCHANGÉ)
export function useAnalyticsPredictions() {
  return useQuery({
    queryKey: ['analytics', 'predictions'],
    queryFn: () => AnalyticsApi.getPredictions(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

//Hook pour le résumé exécutif complet
export function useAnalyticsSummary() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune)
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd,
    commune
  }), [dateStart, dateEnd, commune]);
  
  return useQuery({
    queryKey: ['analytics', 'summary', filters],
    queryFn: () => AnalyticsApi.getSummary(filters),
    staleTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
  });
}
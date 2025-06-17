import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { apiClient } from '@/api/client';
import { transformBrulageFromApi, type Brulage } from '@/types/brulage';
import type { SimpleBrulageFilters } from '@/store/filtersStore';
import { useFiltersStore } from '@/store/filtersStore';
import { BrulagesApi } from '@/api/brulages';

// Types pour les réponses API
interface BrulagesResponse {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Hook principal pour la liste des brûlages (lecture seule)
export function useBrulages(params?: {
  page?: number;
  limit?: number;
  filters?: SimpleBrulageFilters;
  search?: string;
  enabled?: boolean;
}) {
  const { page = 1, limit = 12, filters = {}, search = '', enabled = true } = params || {};

  return useQuery({
    queryKey: ['brulages', page, limit, filters, search],
    queryFn: async (): Promise<{ brulages: Brulage[]; pagination: any }> => {
      try {
        // Construire les paramètres de requête
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());

        // Ajouter les filtres
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });

        // Ajouter la recherche
        if (search.trim()) {
          queryParams.append('search', search.trim());
        }

        const response = await apiClient.get<BrulagesResponse>(`/brulages?${queryParams}`);
        
        // Vérifier que response.data existe
        if (!response.data || !response.data.data) {
          return {
            brulages: [],
            pagination: {
              page: 1,
              limit: 12,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrevious: false
            }
          };
        }

        // Transformer seulement les brûlages valides
        const brulages = response.data.data
          .filter(item => item && item.id) // Filtrer les éléments null/undefined
          .map(item => {
            try {
              return transformBrulageFromApi(item);
            } catch (error) {
              console.warn('Erreur transformation brûlage:', item.id, error);
              return null;
            }
          })
          .filter(Boolean) as Brulage[]; // Enlever les transformations échouées
        
        return {
          brulages,
          pagination: response.data.pagination || {
            page: 1,
            limit: 12,
            total: brulages.length,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false
          }
        };
      } catch (error) {
        console.error('Erreur lors du chargement des brûlages:', error);
        throw error;
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Hook pour un brûlage spécifique (lecture seule)
export function useBrulage(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['brulage', id],
    queryFn: async (): Promise<Brulage> => {
      try {
        const response = await apiClient.get<any>(`/brulages/${id}`);
        
        // CORRECTION : L'API retourne { brulage: {...}, metadata: {...} }
        // Pas { data: {...} }
        const brulageData = response.data.brulage || response.data.data || response.data;
        
        if (!brulageData) {
          throw new Error('Brûlage non trouvé dans la réponse API');
        }
        
        return transformBrulageFromApi(brulageData);
      } catch (error) {
        console.error(`Erreur lors du chargement du brûlage ${id}:`, error);
        throw error;
      }
    },
    enabled: enabled && !!id && id > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

//Hook pour les statistiques du dashboard avec filtres
export function useBrulagesStats() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune);
  const statut = useFiltersStore((state) => state.filters.statut);
  const campagne = useFiltersStore((state) => state.filters.campagne);
  const type = useFiltersStore((state) => state.filters.type);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd,
    commune,
    statut,
    campagne,
    type
  }), [dateStart, dateEnd, commune, statut, campagne, type]);
  
  return useQuery({
    queryKey: ['brulages', 'stats', filters],
    queryFn: () => BrulagesApi.getStats(filters),
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    throwOnError: false
  });
}

// Hook pour la recherche simple (INCHANGÉ)
export function useBrulagesSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['brulages', 'search', query],
    queryFn: async (): Promise<Brulage[]> => {
      if (query.length < 3) return [];
      
      const response = await apiClient.get(`/brulages/search?q=${encodeURIComponent(query)}`);
      return response.data.data.map(transformBrulageFromApi);
    },
    enabled: enabled && query.length >= 3,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}

//Hook pour les brûlages récents avec filtres
export function useRecentBrulages(limit: number = 10) {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune);
  const statut = useFiltersStore((state) => state.filters.statut);
  const campagne = useFiltersStore((state) => state.filters.campagne);
  const type = useFiltersStore((state) => state.filters.type);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd,
    commune,
    statut,
    campagne,
    type
  }), [dateStart, dateEnd, commune, statut, campagne, type]);
  
  return useQuery({
    queryKey: ['brulages', 'recent', limit, filters],
    queryFn: () => BrulagesApi.getRecent({ limit, filters }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}

//Hook pour les métriques de performance avec filtres
export function useBrulagesPerformance() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune);
  const statut = useFiltersStore((state) => state.filters.statut);
  const campagne = useFiltersStore((state) => state.filters.campagne);
  const type = useFiltersStore((state) => state.filters.type);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd,
    commune,
    statut,
    campagne,
    type
  }), [dateStart, dateEnd, commune, statut, campagne, type]);
  
  return useQuery({
    queryKey: ['brulages', 'performance', filters],
    queryFn: () => BrulagesApi.getPerformance(filters),
    staleTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
  });
}

//Hook pour les tendances temporelles avec filtres
export function useBrulagesTrends(years: number = 3) {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune);
  const statut = useFiltersStore((state) => state.filters.statut);
  const campagne = useFiltersStore((state) => state.filters.campagne);
  const type = useFiltersStore((state) => state.filters.type);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd,
    commune,
    statut,
    campagne,
    type
  }), [dateStart, dateEnd, commune, statut, campagne, type]);
  
  return useQuery({
    queryKey: ['brulages', 'trends', years, filters],
    queryFn: () => BrulagesApi.getTrends({ years, filters }),
    staleTime: 60 * 60 * 1000, // 1 heure
    retry: 2,
  });
}

// Hook pour les conditions météorologiques d'un brûlage (INCHANGÉ)
export function useBrulageConditions(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['brulage', 'conditions', id],
    queryFn: () => BrulagesApi.getConditions(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

//Hook pour l'export CSV avec filtres automatiques
export function useBrulagesExportCsv() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune);
  const statut = useFiltersStore((state) => state.filters.statut);
  const campagne = useFiltersStore((state) => state.filters.campagne);
  const type = useFiltersStore((state) => state.filters.type);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd,
    commune,
    statut,
    campagne,
    type
  }), [dateStart, dateEnd, commune, statut, campagne, type]);
  
  return useMutation({
    mutationFn: (customFilters?: SimpleBrulageFilters) => 
      BrulagesApi.exportCsv(customFilters || filters),
    onSuccess: (response) => {
      // Déclencher le téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `brulages_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}

//Hook pour l'export JSON avec filtres automatiques
export function useBrulagesExportJson() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune);
  const statut = useFiltersStore((state) => state.filters.statut);
  const campagne = useFiltersStore((state) => state.filters.campagne);
  const type = useFiltersStore((state) => state.filters.type);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd,
    commune,
    statut,
    campagne,
    type
  }), [dateStart, dateEnd, commune, statut, campagne, type]);
  
  return useMutation({
    mutationFn: (customFilters?: SimpleBrulageFilters) => 
      BrulagesApi.exportJson(customFilters || filters),
    onSuccess: (data) => {
      // Déclencher le téléchargement JSON
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = `brulages_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
}

//Hook pour l'export PDF avec filtres automatiques
export function useBrulagesExportPdf() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune);
  const statut = useFiltersStore((state) => state.filters.statut);
  const campagne = useFiltersStore((state) => state.filters.campagne);
  const type = useFiltersStore((state) => state.filters.type);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd,
    commune,
    statut,
    campagne,
    type
  }), [dateStart, dateEnd, commune, statut, campagne, type]);
  
  return useMutation({
    mutationFn: (customFilters?: SimpleBrulageFilters) => 
      BrulagesApi.exportPdf(customFilters || filters),
    onSuccess: (response) => {
      // Déclencher le téléchargement PDF
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_brulages_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}
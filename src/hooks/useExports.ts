import { useQuery, useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ExportApi } from '@/api/exports';
import { useFiltersStore } from '@/store/filtersStore';
import type { SimpleBrulageFilters } from '@/store/filtersStore';

// Hook pour récupérer les formats d'export disponibles
export function useExportFormats() {
  return useQuery({
    queryKey: ['export', 'formats'],
    queryFn: () => ExportApi.getFormats(),
    staleTime: 60 * 60 * 1000, // 1 heure
    retry: 2,
  });
}

// Hook pour l'aperçu avant export
export function useExportPreview(params?: {
  format?: 'csv' | 'json' | 'excel';
  previewLimit?: number;
  filters?: SimpleBrulageFilters;
  enabled?: boolean;
}) {
  const { enabled = true, ...previewParams } = params || {};

  return useQuery({
    queryKey: ['export', 'preview', previewParams],
    queryFn: () => ExportApi.getPreview(previewParams),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}

//Hook pour l'export CSV avec filtres automatiques
export function useExportCsv() {
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
      ExportApi.exportCsv(customFilters || filters),
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
    onError: (error) => {
      console.error('Erreur export CSV:', error);
    },
  });
}

//Hook pour l'export JSON avec filtres automatiques
export function useExportJson() {
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
      ExportApi.exportJson(customFilters || filters),
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
    onError: (error) => {
      console.error('Erreur export JSON:', error);
    },
  });
}

//Hook pour l'export Excel avec filtres automatiques
export function useExportExcel() {
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
      ExportApi.exportExcel(customFilters || filters),
    onSuccess: (response) => {
      // Déclencher le téléchargement Excel
      const url = window.URL.createObjectURL(new Blob([response.data], { 
        type: 'application/vnd.ms-excel' 
      }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `brulages_export_${new Date().toISOString().split('T')[0]}.xls`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Erreur export Excel:', error);
    },
  });
}

//Hook pour l'export rapport PDF avec filtres automatiques
export function useExportPdfReport() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd
  }), [dateStart, dateEnd]);

  return useMutation({
    mutationFn: (params?: {
      type?: 'dashboard' | 'analytics' | 'complete';
      customFilters?: { dateStart?: string; dateEnd?: string };
    }) => {
      const { type = 'complete', customFilters } = params || {};
      return ExportApi.exportPdfReport({ 
        type, 
        filters: customFilters || filters 
      });
    },
    onSuccess: (response) => {
      // Déclencher le téléchargement PDF
      const url = window.URL.createObjectURL(new Blob([response.data], { 
        type: 'application/pdf' 
      }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_brulages_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Erreur export PDF rapport:', error);
    },
  });
}

//Hook pour l'export PDF statistiques avec filtres automatiques
export function useExportPdfStats() {
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  
  const filters = useMemo(() => ({
    dateStart,
    dateEnd
  }), [dateStart, dateEnd]);

  return useMutation({
    mutationFn: (customFilters?: { dateStart?: string; dateEnd?: string }) => 
      ExportApi.exportPdfStats(customFilters || filters),
    onSuccess: (response) => {
      // Déclencher le téléchargement PDF stats
      const url = window.URL.createObjectURL(new Blob([response.data], { 
        type: 'application/pdf' 
      }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_statistiques_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Erreur export PDF stats:', error);
    },
  });
}

// Hook pour l'export PDF commune
export function useExportPdfCommune() {
  return useMutation({
    mutationFn: (id: number) => ExportApi.exportPdfCommune(id),
    onSuccess: (response, variables) => {
      // Déclencher le téléchargement PDF commune
      const url = window.URL.createObjectURL(new Blob([response.data], { 
        type: 'application/pdf' 
      }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_commune_${variables}_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Erreur export PDF commune:', error);
    },
  });
}
import { useState, useMemo, useCallback } from 'react';

interface UseSearchProps<T> {
  data: T[];
  searchFields?: (keyof T)[];
  defaultSort?: keyof T;
  defaultOrder?: 'asc' | 'desc';
}

interface SearchFilters {
  searchTerm: string;
  statusFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  dateStart?: string;
  dateEnd?: string;
  communeFilter?: string;
  typeFilter?: string;
}

export function useSearch<T extends Record<string, any>>({ 
  data,
  searchFields = [],
  defaultSort = 'id' as keyof T,
  defaultOrder = 'desc'
}: UseSearchProps<T>) {
  // ✅ Initialisation stable des filtres par défaut
  const defaultFilters = useMemo(() => ({
    searchTerm: '',
    statusFilter: 'TOUS',
    sortBy: String(defaultSort),
    sortOrder: defaultOrder,
  } as SearchFilters), [defaultSort, defaultOrder]);

  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  // 🔍 Fonction de recherche optimisée avec mémorisation stable
  const searchInFields = useCallback((item: T, term: string): boolean => {
    if (!term) return true;
    
    const lowerTerm = term.toLowerCase();
    
    return searchFields.some(field => {
      const value = item[field];
      if (value == null) return false;
      
      // Gestion de différents types de données
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerTerm);
      }
      if (typeof value === 'number') {
        return value.toString().includes(lowerTerm);
      }
      // Vérification pour les chaînes de date
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        try {
          const date = new Date(value);
          return date.toLocaleDateString().includes(lowerTerm);
        } catch {
          return false;
        }
      }
      
      return false;
    });
  }, [searchFields]);

  // ✅ Fonction de filtrage séparée pour une meilleure lisibilité
  const filterItem = useCallback((item: T): boolean => {
    // Recherche textuelle
    const matchesSearch = searchInFields(item, filters.searchTerm);
    
    // Filtre statut
    const matchesStatus = filters.statusFilter === 'TOUS' || 
      item.statut === filters.statusFilter;
    
    // Filtre commune
    const matchesCommune = !filters.communeFilter || 
      (item.commune && String(item.commune).toLowerCase().includes(filters.communeFilter.toLowerCase()));
    
    // Filtre type
    const matchesType = !filters.typeFilter || 
      item.type === filters.typeFilter;
    
    // Filtres de date
    let matchesDateRange = true;
    if (filters.dateStart || filters.dateEnd) {
      const itemDateValue = item.dateRealisation;
      let itemDate: Date | null = null;
      
      // Conversion sécurisée en Date
      if (itemDateValue) {
        if (typeof itemDateValue === 'object' && itemDateValue instanceof Date) {
          itemDate = itemDateValue;
        } else if (typeof itemDateValue === 'string') {
          try {
            itemDate = new Date(itemDateValue);
            // Vérifier si la date est valide
            if (isNaN(itemDate.getTime())) {
              itemDate = null;
            }
          } catch {
            itemDate = null;
          }
        }
      }
      
      if (itemDate) {
        if (filters.dateStart) {
          const startDate = new Date(filters.dateStart);
          matchesDateRange = matchesDateRange && itemDate >= startDate;
        }
        if (filters.dateEnd) {
          const endDate = new Date(filters.dateEnd);
          matchesDateRange = matchesDateRange && itemDate <= endDate;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesCommune && matchesType && matchesDateRange;
  }, [filters, searchInFields]);

  // ✅ Fonction de tri séparée et optimisée
  const sortData = useCallback((filteredItems: T[]): T[] => {
    const { sortBy, sortOrder } = filters;
    
    return [...filteredItems].sort((a, b) => {
      let valueA: any = a[sortBy as keyof T];
      let valueB: any = b[sortBy as keyof T];
      
      // Gestion des valeurs nulles/undefined
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return sortOrder === 'asc' ? -1 : 1;
      if (valueB == null) return sortOrder === 'asc' ? 1 : -1;
      
      // Conversion des dates avec vérification de type
      if (sortBy.includes('date') || sortBy.includes('Date')) {
        // Conversion sécurisée pour valueA
        if (typeof valueA === 'object' && valueA instanceof Date) {
          // Déjà une Date
        } else if (typeof valueA === 'string') {
          try {
            valueA = new Date(valueA);
            if (isNaN(valueA.getTime())) valueA = new Date(0);
          } catch {
            valueA = new Date(0);
          }
        } else {
          valueA = new Date(0);
        }
        
        // Conversion sécurisée pour valueB
        if (typeof valueB === 'object' && valueB instanceof Date) {
          // Déjà une Date
        } else if (typeof valueB === 'string') {
          try {
            valueB = new Date(valueB);
            if (isNaN(valueB.getTime())) valueB = new Date(0);
          } catch {
            valueB = new Date(0);
          }
        } else {
          valueB = new Date(0);
        }
      }
      
      // Tri numérique
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      // Tri alphabétique
      const comparison = String(valueA).localeCompare(String(valueB));
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filters]);

  // 📊 Données filtrées et triées avec optimisation
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Étape 1: Filtrage
    const filtered = data.filter(filterItem);
    
    // Étape 2: Tri
    return sortData(filtered);
  }, [data, filterItem, sortData]);

  // 🛠️ Actions pour modifier les filtres avec callbacks stables
  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K, 
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  // ✅ Actions spécialisées avec callbacks stables
  const setSearchTerm = useCallback((term: string) => updateFilter('searchTerm', term), [updateFilter]);
  const setStatusFilter = useCallback((status: string) => updateFilter('statusFilter', status), [updateFilter]);
  const setCommuneFilter = useCallback((commune: string) => updateFilter('communeFilter', commune), [updateFilter]);
  const setTypeFilter = useCallback((type: string) => updateFilter('typeFilter', type), [updateFilter]);
  const setSortBy = useCallback((field: string) => updateFilter('sortBy', field), [updateFilter]);
  const setSortOrder = useCallback((order: 'asc' | 'desc') => updateFilter('sortOrder', order), [updateFilter]);
  
  const setDateRange = useCallback((start?: string, end?: string) => {
    setFilters(prev => ({ ...prev, dateStart: start, dateEnd: end }));
  }, []);

  // 📊 Statistiques avec mémorisation
  const stats = useMemo(() => {
    return {
      total: data.length,
      filtered: filteredData.length,
      percentage: data.length > 0 ? Math.round((filteredData.length / data.length) * 100) : 0
    };
  }, [data.length, filteredData.length]);

  // ✅ Objet de retour stable
  return useMemo(() => ({
    // État des filtres
    filters,
    
    // Actions
    setSearchTerm,
    setStatusFilter,
    setCommuneFilter,
    setTypeFilter,
    setDateRange,
    setSortBy,
    setSortOrder,
    
    // Utilitaires
    updateFilter,
    resetFilters,
    
    // Résultats
    filteredData,
    stats,
    
    // Compatibilité avec l'ancien API
    searchTerm: filters.searchTerm,
    statusFilter: filters.statusFilter,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    totalResults: filteredData.length,
  }), [
    filters,
    setSearchTerm,
    setStatusFilter,
    setCommuneFilter,
    setTypeFilter,
    setDateRange,
    setSortBy,
    setSortOrder,
    updateFilter,
    resetFilters,
    filteredData,
    stats
  ]);
}

// 🎯 Hook spécialisé pour les brûlages
export function useBrulageSearch(brulages: any[]) {
  return useSearch({
    data: brulages,
    searchFields: ['commune', 'responsable', 'departement', 'numBrulage', 'observations'],
    defaultSort: 'dateRealisation',
    defaultOrder: 'desc'
  });
}

// 🏢 Hook spécialisé pour les communes
export function useCommuneSearch(communes: any[]) {
  return useSearch({
    data: communes,
    searchFields: ['nomCommune', 'codeInsee', 'departement', 'region'],
    defaultSort: 'nomCommune',
    defaultOrder: 'asc'
  });
}

// 👤 Hook spécialisé pour les demandeurs
export function useDemandeurSearch(demandeurs: any[]) {
  return useSearch({
    data: demandeurs,
    searchFields: ['nom', 'prenom', 'exploitation', 'typeDemandeur'],
    defaultSort: 'nom',
    defaultOrder: 'asc'
  });
}
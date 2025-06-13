import type { CommuneApi } from './api';

export interface Commune {
  id: number;
  codeInsee: string;
  nom: string;
  departement: string;
  region: string;
  coordonnees?: {
    latitude: number;
    longitude: number;
  };
  parcelles?: {
  id: number;
  coordonnees: string;
  surface_totale: string;
    }[];
  surface?: number; // en km²
  population?: number;
  brulagesCount?: number;
  totalSurface?: number; // surface totale des brûlages
  dernierBrulage?: string; // date ISO
  tauxReussiteMoyen?: number;
  createdAt: string;
  updatedAt: string;
}

// Statistiques par commune
export interface CommuneStats {
  commune: Commune;
  statistics: {
    total_brulages: number;
    surface_totale: number;
    derniere_activite: string | null;
    taux_reussite_moyen: number;
  };
}

// Statistiques générales des communes
export interface CommunesGlobalStats {
  general: {
    total_communes: number;
    communes_actives: number;
    regions_count: number;
  };
  geographic: {
    by_region: Array<{
      region: string;
      count: number;
      surface: number;
    }>;
    coverage: {
      total_communes: number;
      communes_actives: number;
    };
  };
  top_performers: Array<{
    nom_commune: string;
    departement: string;
    population: number;
    total_brulages: number;
    surface_totale: number;
    taux_moyen: number;
    dernier_brulage: string;
  }>;
  departments: Array<{
    departement: string;
    nb_communes: number;
    total_brulages: number;
    surface_totale: number;
  }>;
}

// Analyse de couverture géographique
export interface CoveragAnalysis {
  coverage_analysis: {
    total_communes: number;
    communes_with_brulages: number;
    coverage_rate: number;
    inactive_communes: number;
  };
  regional_coverage: Array<{
    region: string;
    communes_with_brulages: string;
    total_brulages: number;
    surface_totale: number;
  }>;
  opportunities: Array<{
    type: 'expansion' | 'growth' | 'optimization';
    priority: 'high' | 'medium' | 'low';
    message: string;
  }>;
}

// Données GeoJSON spécifiques aux communes
export interface CommuneGeoData {
  id: number;
  nom: string;
  departement: string;
  population?: number;
  coordinates: [number, number]; // [longitude, latitude]
  brulagesCount: number;
  activityLevel: 'high' | 'medium' | 'low' | 'none';
  lastActivity?: string;
}

// Recherche avancée de communes
export interface CommuneAdvancedSearch {
  filters: {
    region?: string;
    departement?: string;
    minPopulation?: number;
    maxPopulation?: number;
    hasActiveBrulages?: boolean;
  };
  results: Commune[];
  summary: {
    total_found: number;
    regions_represented: number;
    departments_represented: number;
    average_population: number;
  };
}

// Performance par région
export interface RegionPerformance {
  region: string;
  communes_count: number;
  total_brulages: number;
  average_success_rate: number;
  total_surface: number;
  most_active_commune: {
    nom: string;
    brulages_count: number;
  };
  efficiency_rating: 'excellent' | 'good' | 'average' | 'poor';
}

// Utilitaires de transformation
export const transformCommuneFromApi = (apiCommune: CommuneApi & { brulages_count?: number }): Commune => {
  // Parser les coordonnées PostGIS si disponibles
  let coordonnees: { latitude: number; longitude: number } | undefined;
  
  if (apiCommune.coordonnees_centre) {
    const match = apiCommune.coordonnees_centre.match(/POINT\(([0-9.-]+)\s+([0-9.-]+)\)/);
    if (match) {
      coordonnees = {
        longitude: parseFloat(match[1]),
        latitude: parseFloat(match[2])
      };
    }
  }

  return {
    id: apiCommune.id,
    codeInsee: apiCommune.code_insee,
    nom: apiCommune.nom_commune || 'Commune inconnue',
    departement: apiCommune.departement || 'Département inconnu',
    region: apiCommune.region || 'Région inconnue',
    coordonnees,
    parcelles: apiCommune.parcelles,
    surface: apiCommune.surface_commune ? parseFloat(apiCommune.surface_commune) : undefined,
    population: apiCommune.population || undefined,
    brulagesCount: apiCommune.brulages_count || 0,
    createdAt: apiCommune.created_at,
    updatedAt: apiCommune.updated_at
  };
};

// Helper pour déterminer le niveau d'activité
export const getActivityLevel = (brulagesCount: number): 'high' | 'medium' | 'low' | 'none' => {
  if (brulagesCount === 0) return 'none';
  if (brulagesCount >= 20) return 'high';
  if (brulagesCount >= 5) return 'medium';
  return 'low';
};

// Helper pour formater les coordonnées PostGIS
export const formatPostGISPoint = (longitude: number, latitude: number): string => {
  return `POINT(${longitude} ${latitude})`;
};

// Helper pour parser les coordonnées PostGIS
export const parsePostGISPoint = (pointString: string): { longitude: number; latitude: number } | null => {
  const match = pointString.match(/POINT\(([0-9.-]+)\s+([0-9.-]+)\)/);
  if (match) {
    return {
      longitude: parseFloat(match[1]),
      latitude: parseFloat(match[2])
    };
  }
  return null;
};

// Couleurs pour la carte selon l'activité
export const getActivityColor = (level: 'high' | 'medium' | 'low' | 'none'): string => {
  switch (level) {
    case 'high': return '#ef4444'; // rouge
    case 'medium': return '#f97316'; // orange
    case 'low': return '#eab308'; // jaune
    case 'none': return '#9ca3af'; // gris
    default: return '#9ca3af';
  }
};

// Types pour la sélection de communes
export interface CommuneSelectOption {
  value: string;
  label: string;
  departement: string;
  region: string;
  brulagesCount?: number;
}

export const transformToSelectOption = (commune: Commune): CommuneSelectOption => ({
  value: commune.id.toString(),
  label: commune.nom,
  departement: commune.departement,
  region: commune.region,
  brulagesCount: commune.brulagesCount
});
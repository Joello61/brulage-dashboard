// ===== TYPES DE BASE API =====

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiMetadata {
  generated_at: string;
  query_time?: number;
  cache_duration?: number;
  data_source?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  metadata?: ApiMetadata;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  pagination: ApiPagination;
  filters?: Record<string, any>;
  metadata?: ApiMetadata;
}

// ===== ENTITÉS PRINCIPALES BASÉES SUR SYMFONY =====

export interface BrulageApi {
  id: number;
  date_realisation: string | null;
  surface_reelle: string | null;
  surface_prevue: string | null;
  statut: string | null;
  campagne: string | null;
  num_brulage: string | null;
  num_preconisation: string | null;
  observations: string | null;
  pourcentage_reussite: number | null;
  repasse_necessaire: boolean | null;
  type_brulage: string | null;
  created_at: string;
  updated_at: string;
  demandeur: DemandeurApi | null;
  commune: CommuneApi | null;
  brulageEnjeux?: BrulageEnjeuApi[];
  brulageEspeces?: BrulageEspeceApi[];
}

export interface CommuneApi {
  id: number;
  code_insee: string;
  nom_commune: string | null;
  departement: string | null;
  region: string | null;
  coordonnees_centre: string | null;
  parcelles: [] | undefined;
  surface_commune: string | null;
  population: number | null;
  created_at: string;
  updated_at: string;
}

export interface DemandeurApi {
  id: number;
  nom: string;
  prenom: string;
  type_demandeur: string;
  exploitation: string;
  telephone: string;
  email: string;
  adresse: string;
  siret: string;
  created_at: string;
  updated_at: string;
}

export interface BrulageEnjeuApi {
  id: number;
  pourcentage: number;
  enjeu: EnjeuApi;
}

export interface EnjeuApi {
  id: number;
  nom_enjeu: string;
  type_enjeu: string;
  description: string | null;
  priorite: number;
}

export interface BrulageEspeceApi {
  id: number;
  nombre_tetes: number;
  espece: EspeceAnimaleApi;
}

export interface EspeceAnimaleApi {
  id: number;
  nom_espece: string;
  type_animal: string;
  charge_pastorale_optimale: string | null;
}

export interface ConditionBrulageApi {
  id: number;
  temperature_air: string | null;
  humidite_air: string | null;
  vitesse_vent: string | null;
  direction_vent: string | null;
  conditions_atmospheriques: string | null;
  type_allumage: string | null;
  mode_ouverture: string | null;
  conduite_feu: string | null;
  created_at: string;
  updated_at: string;
}

// ===== TYPES POUR LES FILTRES =====

export interface BrulageFilters {
  commune?: string;
  statut?: string;
  campagne?: string;
  dateStart?: string;
  dateEnd?: string;
  type?: string;
}

export interface CommuneFilters {
  search?: string;
  withBrulages?: boolean;
  region?: string;
  departement?: string;
  minPopulation?: number;
  maxPopulation?: number;
  hasActiveBrulages?: boolean;
}

export interface DemandeurFilters {
  type?: string;
  search?: string;
  region?: string;
  dateStart?: string;
  dateEnd?: string;
  minBrulages?: number;
  minSuccessRate?: number;
}

// ===== TYPES ANALYTICS =====

export interface DashboardStatsApi {
  brulages: {
    total: number;
    anneeEnCours: number;
    evolution: number;
  };
  surface: {
    total: number;
    moyenne: number;
  };
  reussite: {
    tauxMoyen: number;
    repartition: {
      excellent: { min: number; max: number; count: number };
      bon: { min: number; max: number; count: number };
      moyen: { min: number; max: number; count: number };
      faible: { min: number; max: number; count: number };
    };
  };
  geographie: {
    communes: number;
    regions: number;
  };
  metadata?: ApiMetadata;
}

export interface AnalyticsTrendsApi {
  seasonal_trends: Record<string, {
    averageCount: number;
    averageSurface: number;
    totalCount: number;
    totalSurface: number;
    details: Array<{
      year: number;
      month: number;
      count: number;
      surface: number;
    }>;
  }>;
  predictive_analysis: {
    prediction: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    slope: number;
    historical: Array<{
      annee: number;
      count: number;
      surface: number;
    }>;
  };
  success_factors: {
    meteo: {
      temperature_optimale: number;
      humidite_optimale: number;
      vent_optimal: number;
      direction_preferee: string;
    };
    temporel: {
      meilleur_mois: { mois: number; taux: number };
      pire_mois: { mois: number; taux: number };
      tendance_saisonniere: string;
    };
    geographique: {
      meilleure_commune: {
        nomCommune: string;
        taux_moyen: number;
        total_brulages: number;
      } | null;
      facteurs_altitude: {
        correlation: string;
        optimal_range: string;
      };
      facteurs_superficie: {
        correlation: string;
        optimal_size: string;
        details?: Record<string, number>;
      };
    };
    organisationnel: {
      demandeurs_efficaces: Array<{
        nom: string;
        prenom: string;
        type_demandeur: string;
        count: number;
      }>;
      types_efficaces: Array<{
        type_brulage: string;
        efficacite: number;
        total: number;
      }>;
      duree_optimale: string;
    };
  };
  recent_trends: {
    evolution_mensuelle: Array<{
      mois: number;
      count: number;
      surface: number;
    }>;
    comparaison_annuelle: {
      current: number;
      previous: number;
    };
    top_communes: Array<{
      nom_commune: string;
      count: number;
      surface: number;
    }>;
    efficacite_tendance: {
      current: number;
      previous: number;
      evolution: number;
    };
  };
  time_series: Array<{
    year: number;
    count: number;
    surface: number;
    efficiency: number;
  }>;
  metadata?: ApiMetadata;
}

export interface WeatherEfficiencyApi {
  bestConditions: Array<{
    temp_category: string;
    humidite_category: string;
    vent_category: string;
    taux_reussite: number;
    nombre_brulages: number;
  }>;
  worstConditions: Array<{
    temp_category: string;
    humidite_category: string;
    vent_category: string;
    taux_reussite: number;
    nombre_brulages: number;
  }>;
  recommendations: Array<{
    type: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

// ===== TYPES GEOJSON =====

export interface GeoJsonFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    id: number;
    nom: string;
    code_insee?: string;
    departement: string;
    region?: string;
    population?: number;
    brulagesCount?: number;
  };
}

export interface GeoJsonResponse {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
  metadata?: {
    generated_at: string;
    total_features: number;
    with_details?: boolean;
    map_type: string;
  };
}

// ===== TYPES EXPORTS =====

export interface ExportFormats {
  csv: {
    name: string;
    description: string;
    mime_type: string;
    extension: string;
    endpoint: string;
  };
  json: {
    name: string;
    description: string;
    mime_type: string;
    extension: string;
    endpoint: string;
  };
  excel: {
    name: string;
    description: string;
    mime_type: string;
    extension: string;
    endpoint: string;
  };
  pdf_report: {
    name: string;
    description: string;
    mime_type: string;
    extension: string;
    endpoint: string;
    options: string[];
  };
  pdf_stats: {
    name: string;
    description: string;
    mime_type: string;
    extension: string;
    endpoint: string;
  };
}

export interface ExportFormatsResponse {
  available_formats: ExportFormats;
  total_formats: number;
  filters_supported: string[];
  metadata: ApiMetadata;
}

// ===== TYPES ADDITIONNELS POUR ENDPOINTS MANQUANTS =====

// Types pour les conditions météo d'un brûlage
export interface BrulageConditionsResponse {
  brulage_id: number;
  conditions: ConditionBrulageApi[];
  metadata?: {
    generated_at: string;
    conditions_count: number;
  };
}

// Types pour la recherche
export interface BrulageSearchResponse {
  query: string;
  results: Array<{
    id: number;
    date_realisation: string;
    commune: {
      nom_commune: string;
    };
    demandeur: {
      nom: string;
      prenom: string;
    };
    statut: string;
  }>;
  count: number;
  metadata?: {
    generated_at: string;
    search_time: number;
  };
}

// Types pour l'évolution
export interface EvolutionResponse {
  evolution_mensuelle: Array<{
    mois: number | string;
    nombre?: number;
    count?: number;
    surface: number;
  }>;
  metadata?: ApiMetadata;
}

// Types pour la distribution des statuts
export interface StatusDistributionResponse {
  repartition: Record<string, {
    count: number;
    percentage?: number;
  }>;
  metadata?: ApiMetadata;
}

// Types pour les stats des communes
export interface CommunesStatsResponse {
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
    population?: number;
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
  metadata?: ApiMetadata;
}

// ===== UNION TYPES =====

export type BrulageStatus = 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE' | 'SUSPENDU';
export type BrulageType = 'PREVENTIF' | 'SYLVICOLE' | 'AGRICOLE' | 'PASTORAL';
export type DemandeurType = 'Particulier' | 'Entreprise' | 'Collectivité' | 'Association' | 'Agriculteur';
export type AlertPriority = 'critical' | 'high' | 'medium' | 'low';
export type TrendDirection = 'increasing' | 'decreasing' | 'stable';
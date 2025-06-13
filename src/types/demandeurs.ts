import type { DemandeurApi, ApiMetadata } from './api';

export interface Demandeur {
  id: number;
  nom: string;
  prenom: string;
  typeDemandeur: 'Particulier' | 'Entreprise' | 'Collectivité' | 'Association' | 'Agriculteur';
  exploitation: string;
  telephone: string;
  email: string;
  adresse: string;
  siret: string;
  createdAt: string;
  updatedAt: string;
  
  // Statistiques calculées (si disponibles)
  totalBrulages?: number;
  surfaceTotale?: number;
  tauxReussiteMoyen?: number;
  derniereActivite?: string;
  premierBrulage?: string;
  communesOperees?: Array<{
    id: number;
    nom: string;
    count: number;
  }>;
}

// Statistiques globales des demandeurs
export interface DemandeursStats {
  general: {
    total_demandeurs: number;
    demandeurs_actifs: number;
    nouveaux_cette_annee: number;
  };
  by_type: Array<{
    type_demandeur: string;
    nb_demandeurs: number;
    total_brulages: number;
    taux_moyen: number;
    surface_totale: number;
  }>;
  performance: Array<{
    id: number;
    nom: string;
    prenom: string;
    type_demandeur: string;
    exploitation: string;
    total_brulages: number;
    taux_moyen: number;
    surface_totale: number;
    dernier_brulage: string;
  }>;
  geographic: Array<{
    region: string;
    nb_demandeurs: number;
    total_brulages: number;
  }>;
  loyalty: Array<{
    categorie_fidelite: 'Très actif' | 'Régulier' | 'Occasionnel' | 'Ponctuel';
    nb_demandeurs: number;
    taux_reussite_moyen: number;
  }>;
  metadata?: ApiMetadata;
}

// Analyse de performance des demandeurs
export interface DemandeursPerformance {
  performance: Array<{
    id: number;
    nom: string;
    prenom: string;
    type_demandeur: string;
    exploitation: string;
    total_brulages: number;
    taux_moyen: number;
    surface_totale: number;
    dernier_brulage?: string;
  }>;
  sort_by: 'taux_moyen' | 'total_brulages' | 'surface_totale';
  total_analyzed: number;
  insights: Array<{
    type: 'top_performer' | 'average' | 'excellence' | 'improvement_needed';
    message: string;
  }>;
  metadata?: ApiMetadata;
}

// Types de demandeurs avec statistiques
export interface DemandeursTypes {
  types: Array<{
    type_demandeur: string;
    nb_demandeurs: number;
    total_brulages: number;
    taux_moyen: number;
    surface_totale: number;
  }>;
  total_types: number;
  insights: Array<{
    type: 'most_active' | 'best_performance' | 'growth_opportunity';
    message: string;
  }>;
  metadata?: ApiMetadata;
}

// Demandeurs actifs
export interface DemandeursActive {
  active_demandeurs: Demandeur[];
  period_months: number;
  since_date: string;
  count: number;
  activity_rate: number;
  metadata?: ApiMetadata;
}

// Analyse de fidélité
export interface DemandeursLoyalty {
  loyalty_segments: Array<{
    categorie_fidelite: 'Très actif' | 'Régulier' | 'Occasionnel' | 'Ponctuel';
    nb_demandeurs: number;
    taux_reussite_moyen: number;
    criteres: {
      min_brulages?: number;
      max_brulages?: number;
      frequence?: string;
    };
  }>;
  insights: Array<{
    type: 'positive' | 'opportunity' | 'warning';
    message: string;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    description: string;
    target_segment?: string;
  }>;
  metadata?: ApiMetadata;
}

// Recherche avancée de demandeurs
export interface DemandeursAdvancedSearch {
  results: Demandeur[];
  filters_applied: {
    type?: string;
    region?: string;
    dateStart?: string;
    dateEnd?: string;
    minBrulages?: number;
    minSuccessRate?: number;
  };
  count: number;
  summary: {
    total_demandeurs: number;
    total_brulages: number;
    surface_totale: number;
    type_distribution: Record<string, number>;
    moyenne_brulages_par_demandeur: number;
  };
  metadata?: ApiMetadata;
}

// Tendances d'activité des demandeurs
export interface DemandeursTrends {
  demandeur_trends: Array<{
    year: number;
    new_demandeurs: number;
    active_demandeurs: number;
    total_brulages: number;
    average_success_rate: number;
  }>;
  activity_evolution: {
    evolution_type: 'croissante' | 'décroissante' | 'stable';
    growth_rate: number;
    peak_activity_month: string;
    seasonal_patterns: Record<string, number>;
  };
  performance_trends: {
    efficiency_trend: 'improving' | 'declining' | 'stable';
    average_improvement: number;
    best_performing_year: number;
    consistency_score: number;
  };
  time_series: Array<{
    year: number;
    count: number;
    surface: number;
    efficiency: number;
    new_registrations: number;
  }>;
  retention_analysis: {
    retention_rate_1_year: number;
    retention_rate_2_years: number;
    churn_rate: number;
    reactivation_rate: number;
  };
  metadata?: ApiMetadata;
}

// Profil détaillé d'un demandeur
export interface DemandeurProfile {
  demandeur: Demandeur;
  statistics: {
    total_brulages: number;
    surface_totale: number;
    taux_reussite_moyen: number;
    derniere_activite: string;
    premier_brulage: string;
    communes_operees: Array<{
      id: number;
      nom: string;
      count: number;
      surface_totale: number;
      taux_moyen: number;
    }>;
    evolution_annuelle: Array<{
      annee: number;
      nb_brulages: number;
      surface: number;
      taux_reussite: number;
    }>;
  };
  performance_indicators: {
    categorie_fidelite: string;
    niveau_performance: 'excellent' | 'bon' | 'moyen' | 'faible';
    tendance: 'progression' | 'stable' | 'régression';
    points_forts: string[];
    axes_amelioration: string[];
  };
  recommendations: Array<{
    type: 'technique' | 'commercial' | 'operationnel';
    priority: 'high' | 'medium' | 'low';
    message: string;
  }>;
  metadata?: ApiMetadata;
}

// Transformation des données API
export const transformDemandeurFromApi = (apiDemandeur: DemandeurApi & { 
  total_brulages?: number;
  surface_totale?: number;
  taux_reussite_moyen?: number;
  derniere_activite?: string;
}): Demandeur => {
  return {
    id: apiDemandeur.id,
    nom: apiDemandeur.nom,
    prenom: apiDemandeur.prenom,
    typeDemandeur: apiDemandeur.type_demandeur as any,
    exploitation: apiDemandeur.exploitation,
    telephone: apiDemandeur.telephone,
    email: apiDemandeur.email,
    adresse: apiDemandeur.adresse,
    siret: apiDemandeur.siret,
    createdAt: apiDemandeur.created_at,
    updatedAt: apiDemandeur.updated_at,
    totalBrulages: apiDemandeur.total_brulages,
    surfaceTotale: apiDemandeur.surface_totale,
    tauxReussiteMoyen: apiDemandeur.taux_reussite_moyen,
    derniereActivite: apiDemandeur.derniere_activite
  };
};

// Helpers pour l'affichage
export const getTypeDemandeurColor = (type: string): string => {
  switch (type) {
    case 'Agriculteur': return 'bg-green-100 text-green-800 border-green-200';
    case 'Particulier': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Entreprise': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Collectivité': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Association': return 'bg-pink-100 text-pink-800 border-pink-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPerformanceLevel = (tauxReussite: number): {
  level: 'excellent' | 'bon' | 'moyen' | 'faible';
  color: string;
  label: string;
} => {
  if (tauxReussite >= 90) {
    return {
      level: 'excellent',
      color: 'bg-green-100 text-green-800 border-green-200',
      label: 'Excellence'
    };
  } else if (tauxReussite >= 75) {
    return {
      level: 'bon',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'Bon niveau'
    };
  } else if (tauxReussite >= 60) {
    return {
      level: 'moyen',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Niveau moyen'
    };
  } else {
    return {
      level: 'faible',
      color: 'bg-red-100 text-red-800 border-red-200',
      label: 'À améliorer'
    };
  }
};

export const getFideliteLevel = (nbBrulages: number): {
  categorie: 'Très actif' | 'Régulier' | 'Occasionnel' | 'Ponctuel';
  color: string;
  description: string;
} => {
  if (nbBrulages >= 20) {
    return {
      categorie: 'Très actif',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: '20+ brûlages par an'
    };
  } else if (nbBrulages >= 10) {
    return {
      categorie: 'Régulier',
      color: 'bg-green-100 text-green-800 border-green-200',
      description: '10-19 brûlages par an'
    };
  } else if (nbBrulages >= 3) {
    return {
      categorie: 'Occasionnel',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      description: '3-9 brûlages par an'
    };
  } else {
    return {
      categorie: 'Ponctuel',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      description: '1-2 brûlages par an'
    };
  }
};

// Type pour les options de sélection
export interface DemandeurSelectOption {
  value: string;
  label: string;
  type: string;
  exploitation: string;
  brulagesCount?: number;
}

export const transformToSelectOption = (demandeur: Demandeur): DemandeurSelectOption => ({
  value: demandeur.id.toString(),
  label: `${demandeur.prenom} ${demandeur.nom}`,
  type: demandeur.typeDemandeur,
  exploitation: demandeur.exploitation,
  brulagesCount: demandeur.totalBrulages
});
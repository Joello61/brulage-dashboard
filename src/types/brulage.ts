import type { BrulageApi, DemandeurApi, CommuneApi } from './api';
import type { Commune } from './commune';
import type { Demandeur } from './demandeurs';

// ===== INTERFACE BRULAGE PRINCIPALE =====

export interface Brulage {
  id: number;
  date_realisation: string;
  surface_reelle: number; // en hectares
  surface_prevue?: number;
  statut: 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE' | 'SUSPENDU';
  campagne?: string;
  num_brulage?: string;
  num_preconisation?: string;
  observations?: string;
  pourcentage_reussite?: number;
  repasse_necessaire: boolean;
  type_brulage: 'PREVENTIF' | 'SYLVICOLE' | 'AGRICOLE' | 'PASTORAL';
  created_at: string;
  updated_at: string;
  
  // Relations - objets complets, pas des strings !
  commune: Commune;
  demandeur: Demandeur;
  
  // Relations optionnelles
  enjeux?: Array<{
    id: number;
    nom_enjeu: string;
    type_enjeu: string;
    pourcentage: number;
    priorite?: number;
  }>;
  
  // Espèces - avec nombre_tetes qui existe dans l'API
  especes?: Array<{
    id: number;
    nom_espece: string;
    type_animal: string;
    nombre_tetes: number;
  }>;
  conditions?: {
    id: number;
    temperature_air?: number;
    humidite_air?: number;
    vitesse_vent?: number;
    direction_vent?: string;
    conditions_atmospheriques?: string;
    type_allumage?: string;
    mode_ouverture?: string;
    conduite_feu?: string;
  };
}

// ===== INTERFACES SIMPLIFIÉES POUR LES LISTES =====

export interface BrulageListItem {
  id: number;
  commune: {
    id: number;
    nom_commune: string;
    departement: string;
  };
  demandeur: {
    id: number;
    nom: string;
    prenom: string;
  };
  surface_reelle: number;
  statut: string;
  date_realisation: string;
  type_brulage: string;
  pourcentage_reussite?: number;
  campagne?: string;
}

export interface BrulageCard {
  id: number;
  commune: {
    nom_commune: string;
    departement: string;
  };
  surface_reelle: number;
  statut: string;
  date_realisation: string;
  demandeur: {
    nom: string;
    prenom: string;
  };
  type_brulage: string;
  pourcentage_reussite?: number;
  coordonnees?: {
    latitude: number;
    longitude: number;
  };
}

// ===== STATISTIQUES DASHBOARD =====

export interface DashboardStats {
  totalBrulages: number;
  brulagesActifs: number;
  surfaceTotale: number;
  tauxReussite: number;
  communesActives: number;
  evolutionMensuelle: Array<{
    mois: string;
    nombre: number;
    surface: number;
  }>;
  repartitionStatut: Array<{
    statut: string;
    nombre: number;
    couleur: string;
  }>;
  repartitionCommune: Array<{
    commune: string;
    nombre: number;
    surface: number;
  }>;
}

// ===== FILTRES ET RECHERCHE =====

export interface BrulageFilters {
  commune?: string;
  statut?: string;
  type?: string;
  campagne?: string;
  dateStart?: string;
  dateEnd?: string;
  demandeur?: string;
  minSurface?: number;
  maxSurface?: number;
  minReussite?: number;
  maxReussite?: number;
  region?: string;
  departement?: string;
}

export interface BrulageSearchResult {
  brulages: Brulage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// ===== FONCTIONS DE TRANSFORMATION =====

export const transformBrulageFromApi = (apiBrulage: BrulageApi): Brulage => {
  return {
    id: apiBrulage.id,
    date_realisation: apiBrulage.date_realisation || apiBrulage.created_at,
    surface_reelle: parseFloat(apiBrulage.surface_reelle || '0'),
    surface_prevue: apiBrulage.surface_prevue ? parseFloat(apiBrulage.surface_prevue) : undefined,
    statut: (apiBrulage.statut || 'PLANIFIE') as any,
    campagne: apiBrulage.campagne || undefined,
    num_brulage: apiBrulage.num_brulage || undefined,
    num_preconisation: apiBrulage.num_preconisation || undefined,
    observations: apiBrulage.observations || undefined,
    pourcentage_reussite: apiBrulage.pourcentage_reussite || undefined,
    repasse_necessaire: apiBrulage.repasse_necessaire || false,
    type_brulage: (apiBrulage.type_brulage || 'PREVENTIF') as any,
    created_at: apiBrulage.created_at,
    updated_at: apiBrulage.updated_at,
    
    // 🔧 CORRECTION : Gérer le cas où commune ou demandeur sont null
    commune: apiBrulage.commune ? transformCommuneFromApi(apiBrulage.commune) : {
      id: 0,
      codeInsee: 'UNKNOWN',
      nom: 'Commune inconnue',
      departement: 'Département inconnu',
      region: 'Région inconnue',
      createdAt: apiBrulage.created_at,
      updatedAt: apiBrulage.updated_at
    },
    
    demandeur: apiBrulage.demandeur ? transformDemandeurFromApi(apiBrulage.demandeur) : {
      id: 0,
      nom: 'Non défini',
      prenom: '',
      typeDemandeur: 'Particulier' as any,
      exploitation: '',
      telephone: '',
      email: '',
      adresse: '',
      siret: '',
      createdAt: apiBrulage.created_at,
      updatedAt: apiBrulage.updated_at
    },
    
    // Enjeux - vérifier que l'array existe
    enjeux: apiBrulage.brulageEnjeux?.map(be => ({
      id: be.enjeu.id,
      nom_enjeu: be.enjeu.nom_enjeu,
      type_enjeu: be.enjeu.type_enjeu,
      pourcentage: be.pourcentage,
      priorite: be.enjeu.priorite,
    })) || [],
    
    // Espèces - vérifier que l'array existe
    especes: apiBrulage.brulageEspeces?.map(be => ({
      id: be.espece.id,
      nom_espece: be.espece.nom_espece,
      type_animal: be.espece.type_animal,
      nombre_tetes: be.nombre_tetes,
    })) || [],
  };
};

// Import des fonctions de transformation depuis leurs modules respectifs
const transformCommuneFromApi = (apiCommune: CommuneApi): Commune => {
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
    codeInsee: apiCommune.code_insee || 'UNKNOWN',
    nom: apiCommune.nom_commune || 'Commune inconnue',
    departement: apiCommune.departement || 'Département inconnu',
    region: apiCommune.region || 'Région inconnue',
    coordonnees,
    parcelles: apiCommune.parcelles,
    surface: apiCommune.surface_commune ? parseFloat(apiCommune.surface_commune) : undefined,
    population: apiCommune.population || undefined,
    createdAt: apiCommune.created_at,
    updatedAt: apiCommune.updated_at
  };
};

const transformDemandeurFromApi = (apiDemandeur: DemandeurApi): Demandeur => {
  return {
    id: apiDemandeur.id,
    nom: apiDemandeur.nom || 'Non défini',
    prenom: apiDemandeur.prenom || '',
    typeDemandeur: (apiDemandeur.type_demandeur || 'Particulier') as any,
    exploitation: apiDemandeur.exploitation || '',
    telephone: apiDemandeur.telephone || '',
    email: apiDemandeur.email || '',
    adresse: apiDemandeur.adresse || '',
    siret: apiDemandeur.siret || '',
    createdAt: apiDemandeur.created_at,
    updatedAt: apiDemandeur.updated_at
  };
};

// ===== HELPERS POUR L'AFFICHAGE =====

export const getStatutColor = (statut: string): string => {
  switch (statut.toUpperCase()) {
    case 'EN_COURS': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'TERMINE': return 'bg-green-100 text-green-800 border-green-200';
    case 'PLANIFIE': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'SUSPENDU': return 'bg-red-100 text-red-800 border-red-200';
    case 'ANNULE': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatutLabel = (statut: string): string => {
  switch (statut.toUpperCase()) {
    case 'EN_COURS': return 'En cours';
    case 'TERMINE': return 'Terminé';
    case 'PLANIFIE': return 'Planifié';
    case 'SUSPENDU': return 'Suspendu';
    case 'ANNULE': return 'Annulé';
    default: return statut;
  }
};

export const getTypeColor = (type: string): string => {
  switch (type.toUpperCase()) {
    case 'PREVENTIF': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'SYLVICOLE': return 'bg-green-50 text-green-700 border-green-200';
    case 'AGRICOLE': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'PASTORAL': return 'bg-blue-50 text-blue-700 border-blue-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const formatSurface = (surface: number): string => {
  if (surface < 1) {
    return `${(surface * 10000).toFixed(0)} m²`;
  }
  return `${surface.toFixed(1)} ha`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateRelative = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} ans`;
};
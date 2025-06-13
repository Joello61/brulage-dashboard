export const STATUTS_BRULAGE = [
  'PLANIFIE',
  'EN_COURS', 
  'TERMINE',
  'SUSPENDU',
  'ANNULE'
] as const;

export const TYPES_BRULAGE = [
  'PREVENTIF',
  'SYLVICOLE',
  'AGRICOLE', 
  'PASTORAL'
] as const;

export const NIVEAUX_RISQUE = [
  'FAIBLE',
  'MODERE',
  'ELEVE',
  'TRES_ELEVE'
] as const;

export const STATUT_LABELS = {
  PLANIFIE: 'Planifié',
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
  SUSPENDU: 'Suspendu',
  ANNULE: 'Annulé'
} as const;

export const RISQUE_LABELS = {
  FAIBLE: 'Faible',
  MODERE: 'Modéré', 
  ELEVE: 'Élevé',
  TRES_ELEVE: 'Très élevé'
} as const;
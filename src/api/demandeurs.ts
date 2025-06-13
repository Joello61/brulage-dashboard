import { apiClient } from './client';
import type { DateFilters } from '@/store/filtersStore';

// Service simplifié pour les demandeurs (lecture seule)
export class DemandeursApi {
  private static basePath = '/demandeurs';

  /**
   * Récupère la liste des demandeurs
   */
  static async getList(params?: {
    type?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) {
    const { type = '', search = '', limit = 50, page = 1 } = params || {};
    
    const queryParams = new URLSearchParams();
    if (type) queryParams.append('type', type);
    if (search) queryParams.append('search', search);
    queryParams.append('limit', limit.toString());
    queryParams.append('page', page.toString());

    const url = `${this.basePath}?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère un demandeur par son ID
   */
  static async getById(id: number) {
    const response = await apiClient.get(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Récupère les statistiques des demandeurs
   */
  static async getStats(filters?: DateFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/stats?${queryParams.toString()}`
      : `${this.basePath}/stats`;
      
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère l'analyse de performance des demandeurs
   */
 static async getPerformance(params?: {
    limit?: number;
    sortBy?: 'taux_moyen' | 'total_brulages' | 'surface_totale';
    filters?: DateFilters;
  }) {
    const { limit = 20, sortBy = 'taux_moyen', filters = {} } = params || {};
    
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('sortBy', sortBy);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${this.basePath}/performance?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère les statistiques par type de demandeur
   */
  static async getTypes(filters?: DateFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/types?${queryParams.toString()}`
      : `${this.basePath}/types`;
      
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère les demandeurs actifs
   */
  static async getActive(months: number = 12) {
    const queryParams = new URLSearchParams();
    queryParams.append('months', months.toString());

    const url = `${this.basePath}/active?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère l'analyse de fidélité
   */
  static async getLoyalty() {
    const response = await apiClient.get(`${this.basePath}/loyalty`);
    return response.data;
  }

  /**
   * Recherche avancée de demandeurs
   */
  static async searchAdvanced(params?: {
    type?: string;
    region?: string;
    dateStart?: string;
    dateEnd?: string;
    minBrulages?: number;
    minSuccessRate?: number;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.basePath}/search/advanced?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère les tendances d'activité des demandeurs
   */
  static async getTrends(years: number = 3) {
    const queryParams = new URLSearchParams();
    queryParams.append('years', years.toString());

    const url = `${this.basePath}/trends?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }
}

export default DemandeursApi;
import { apiClient } from "./client";
import type { DateFilters } from "@/store/filtersStore";

// Service simplifié pour les communes (lecture seule)
export class CommunesApi {
  private static basePath = "/communes";

  /**
   * Récupère la liste des communes
   */
static async getList(params?: {
    search?: string;
    withBrulages?: boolean;
    limit?: number;
    filters?: DateFilters;
  }) {
    const { search = "", withBrulages = false, limit = 50, filters = {} } = params || {};

    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (withBrulages) queryParams.append("withBrulages", "true");
    queryParams.append("limit", limit.toString());

    // Ajouter les filtres de dates
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${this.basePath}?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère une commune par son ID
   */
  static async getById(id: number) {
    const response = await apiClient.get(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Récupère les données GeoJSON des communes
   */
   static async getGeoJson(params?: {
    withDetails?: boolean;
    filters?: DateFilters;
  }) {
    const { withDetails = false, filters = {} } = params || {};

    const queryParams = new URLSearchParams();
    if (withDetails) queryParams.append("withDetails", "true");

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${this.basePath}/geojson?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère les statistiques des communes
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
   * Recherche de communes
   */
  static async search(query: string) {
    if (query.length < 2) {
      return { data: [] };
    }

    const queryParams = new URLSearchParams();
    queryParams.append("search", query);

    const url = `${this.basePath}?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Recherche avancée de communes
   */
  static async searchAdvanced(params?: {
    region?: string;
    departement?: string;
    minPopulation?: number;
    maxPopulation?: number;
    hasActiveBrulages?: boolean;
  }) {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.basePath}/search/advanced?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère les données par région
   */
   static async getRegions(filters?: DateFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/regions?${queryParams.toString()}`
      : `${this.basePath}/regions`;
      
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère l'analyse de couverture géographique
   */
  static async getCoverage(filters?: DateFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/coverage?${queryParams.toString()}`
      : `${this.basePath}/coverage`;
      
    const response = await apiClient.get(url);
    return response.data;
  }
}

export default CommunesApi;

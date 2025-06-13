import { apiClient } from "./client";
import type { SimpleBrulageFilters } from "@/store/filtersStore";

// Service simplifié pour les analytics (lecture seule)
export class AnalyticsApi {
  private static basePath = "/analytics";

  /**
   * Récupère les statistiques pour le dashboard
   */
    static async getDashboard(filters?: SimpleBrulageFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/dashboard?${queryParams.toString()}`
      : `${this.basePath}/dashboard`;
      
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère les métriques de performance
   */
    static async getPerformance(filters?: SimpleBrulageFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/performance?${queryParams.toString()}`
      : `${this.basePath}/performance`;
      
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère les données pour la carte
   */
  static async getMapData(filters?: SimpleBrulageFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/maps?${queryParams.toString()}`
      : `${this.basePath}/maps`;
      
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère l'analyse des conditions météorologiques
   */
  static async getConditions(period: string = "year") {
    const queryParams = new URLSearchParams();
    queryParams.append("period", period);

    const url = `${this.basePath}/conditions?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère les tendances avec prédictions
   */
  static async getTrends(params?: {
    years?: number;
    filters?: SimpleBrulageFilters;
  }) {
    const { years = 3, filters = {} } = params || {};
    
    const queryParams = new URLSearchParams();
    queryParams.append("years", years.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${this.basePath}/trends?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère les prédictions et recommandations
   */
  static async getPredictions() {
    const response = await apiClient.get(`${this.basePath}/predictions`);
    return response.data;
  }

  /**
   * Récupère le résumé exécutif complet
   */
    static async getSummary(filters?: SimpleBrulageFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/summary?${queryParams.toString()}`
      : `${this.basePath}/summary`;
      
    const response = await apiClient.get(url);
    return response.data;
  }
}

export default AnalyticsApi;

import { apiClient } from "./client";
import type { SimpleBrulageFilters } from "@/store/filtersStore";

// Service simplifié pour les brûlages (lecture seule)
export class BrulagesApi {
  private static basePath = "/brulages";

  /**
   * Récupère la liste des brûlages avec filtres et pagination
   */
  static async getList(params?: {
    page?: number;
    limit?: number;
    filters?: SimpleBrulageFilters;
    search?: string;
  }) {
    const { page = 1, limit = 12, filters = {}, search = "" } = params || {};

    // Construire les paramètres de requête
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    // Ajouter les filtres
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    // Ajouter la recherche
    if (search.trim()) {
      queryParams.append("search", search.trim());
    }

    const url = `${this.basePath}?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère un brûlage par son ID
   */
  static async getById(id: number) {
    const response = await apiClient.get(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Recherche simple dans les brûlages
   */
  static async search(query: string) {
    if (query.length < 3) {
      throw new Error("La recherche doit contenir au moins 3 caractères");
    }

    const queryParams = new URLSearchParams();
    queryParams.append("q", query);

    const url = `${this.basePath}/search?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Récupère les statistiques pour le dashboard
   */
    static async getStats(filters?: SimpleBrulageFilters) {
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
   * Récupère les brûlages récents
   */
  static async getRecent(params?: {
    limit?: number;
    filters?: SimpleBrulageFilters;
  }) {
    const { limit = 10, filters = {} } = params || {};
    
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit.toString());
    queryParams.append("sortBy", "date_realisation");

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
   * Récupère les tendances temporelles
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
   * Récupère les conditions météorologiques d'un brûlage
   */
  static async getConditions(id: number) {
    const response = await apiClient.get(`${this.basePath}/conditions/${id}`);
    return response.data;
  }

  /**
   * Exporte les données en CSV
   */
  static async exportCsv(filters?: SimpleBrulageFilters) {
    const queryParams = new URLSearchParams();

    // Ajouter les filtres s'ils existent
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.basePath}/export/csv?${queryParams.toString()}`;
    const response = await apiClient.get(url, {
      responseType: "blob", // Important pour les fichiers
    });
    return response;
  }

  /**
   * Exporte les données en JSON
   */
  static async exportJson(filters?: SimpleBrulageFilters) {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.basePath}/export/json?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Exporte un rapport PDF
   */
  static async exportPdf(filters?: SimpleBrulageFilters) {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.basePath}/export/pdf?${queryParams.toString()}`;
    const response = await apiClient.get(url, {
      responseType: "blob",
    });
    return response;
  }
}

export default BrulagesApi;

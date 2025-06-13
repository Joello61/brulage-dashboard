import { apiClient } from './client';
import type { SimpleBrulageFilters, DateFilters } from '@/store/filtersStore';

// Service dédié aux exports (lecture seule)
export class ExportApi {
  private static basePath = '/export';

  /**
   * Récupère les formats d'export disponibles
   */
  static async getFormats() {
    const response = await apiClient.get(`${this.basePath}/formats`);
    return response.data;
  }

  /**
   * Aperçu avant export
   */
  static async getPreview(params?: {
    format?: 'csv' | 'json' | 'excel';
    previewLimit?: number;
    filters?: SimpleBrulageFilters;
  }) {
    const { format = 'csv', previewLimit = 5, filters = {} } = params || {};
    
    const queryParams = new URLSearchParams();
    queryParams.append('format', format);
    queryParams.append('preview_limit', previewLimit.toString());

    // Ajouter les filtres
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${this.basePath}/preview?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Export CSV global
   */
  static async exportCsv(filters?: SimpleBrulageFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.basePath}/csv?${queryParams.toString()}`;
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    return response;
  }

  /**
   * Export JSON global
   */
  static async exportJson(filters?: SimpleBrulageFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.basePath}/json?${queryParams.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Export Excel
   */
  static async exportExcel(filters?: SimpleBrulageFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.basePath}/excel?${queryParams.toString()}`;
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    return response;
  }

  /**
   * Export rapport PDF complet
   */
  static async exportPdfReport(params?: {
    type?: 'dashboard' | 'analytics' | 'complete';
    filters?: DateFilters;
  }) {
    const { type = 'complete', filters = {} } = params || {};
    
    const queryParams = new URLSearchParams();
    queryParams.append('type', type);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${this.basePath}/pdf/report?${queryParams.toString()}`;
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    return response;
  }

  /**
   * Export rapport PDF statistiques
   */
  static async exportPdfStats(filters?: DateFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/pdf/stats?${queryParams.toString()}`
      : `${this.basePath}/pdf/stats`;
      
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    return response;
  }

  /**
   * Export rapport PDF pour une commune
   */
  static async exportPdfCommune(id: number) {
    const response = await apiClient.get(`${this.basePath}/pdf/commune/${id}`, {
      responseType: 'blob',
    });
    return response;
  }
}

export default ExportApi;
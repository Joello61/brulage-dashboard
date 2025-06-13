import axios from 'axios';

// Configuration simple du client API (lecture seule)
const API_BASE_URL = 'http://localhost:8000/api';

// Instance Axios configurée pour la lecture seule
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour les requêtes (logs en dev)
apiClient.interceptors.request.use(
  (config) => {
    // Log des requêtes en développement
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour les réponses avec gestion d'erreurs simple
apiClient.interceptors.response.use(
  (response) => {
    // Log des réponses en développement
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Gestion simple des erreurs
    if (import.meta.env.DEV) {
      console.error(`API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    }
    
    // Retourner une erreur utilisateur-friendly
    const userError = {
      message: 'Erreur de connexion au serveur',
      status: error.response?.status || 0,
      data: error.response?.data || null
    };
    
    // Messages d'erreur personnalisés selon le statut
    switch (error.response?.status) {
      case 404:
        userError.message = 'Données non trouvées';
        break;
      case 500:
        userError.message = 'Erreur serveur - veuillez réessayer';
        break;
      case 0:
        userError.message = 'Impossible de contacter le serveur';
        break;
    }
    
    return Promise.reject(userError);
  }
);

export default apiClient;
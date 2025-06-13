import { create } from 'zustand';

interface SimpleUIState {
  // Navigation mobile
  sidebarOpen: boolean;
  
  // États de chargement
  loading: boolean;
  
  // Vue responsive
  isMobile: boolean;
  isTablet: boolean;
  
  // Brûlage sélectionné (pour les détails)
  selectedBrulageId: number | null;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  setResponsiveState: (isMobile: boolean, isTablet: boolean) => void;
  setSelectedBrulage: (id: number | null) => void;
}

export const useUIStore = create<SimpleUIState>()((set) => ({
  // État initial
  sidebarOpen: false, // Fermé par défaut pour mobile
  loading: false,
  isMobile: false,
  isTablet: false,
  selectedBrulageId: null,

  // Actions
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setResponsiveState: (isMobile, isTablet) => set({ 
    isMobile, 
    isTablet,
    // Fermer automatiquement la sidebar sur mobile
    sidebarOpen: isMobile ? false : true
  }),
  
  setSelectedBrulage: (selectedBrulageId) => set({ selectedBrulageId })
}));
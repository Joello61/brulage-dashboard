import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Brulage } from '@/types/brulage';

interface BrulageFormData extends Omit<Brulage, 'id'> {}

interface BrulageState {
  // State
  selectedBrulage: Brulage | null;
  formData: Partial<BrulageFormData>;
  isFormOpen: boolean;
  isEditing: boolean;
  
  // UI State
  viewMode: 'table' | 'cards' | 'map';
  selectedIds: string[];
  bulkActions: boolean;
  
  // Actions
  setSelectedBrulage: (brulage: Brulage | null) => void;
  setFormData: (data: Partial<BrulageFormData>) => void;
  updateFormField: (field: keyof BrulageFormData, value: any) => void;
  openForm: (brulage?: Brulage) => void;
  closeForm: () => void;
  resetForm: () => void;
  
  // UI Actions
  setViewMode: (mode: 'table' | 'cards' | 'map') => void;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setBulkActions: (enabled: boolean) => void;
}

const initialFormData: Partial<BrulageFormData> = {
  commune: undefined,
  surface_reelle: 0,
  statut: 'PLANIFIE',
  type_brulage: 'PREVENTIF',
  conditions: {
    id: 0,
    temperature_air: 20,
    vitesse_vent: 10,
    humidite_air: 50,
    conditions_atmospheriques: 'BONNE',
    conduite_feu: '',
    mode_ouverture: '',
    type_allumage: '',
    direction_vent: ''

  },
  observations: ''
};

export const useBrulageStore = create<BrulageState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedBrulage: null,
      formData: initialFormData,
      isFormOpen: false,
      isEditing: false,
      viewMode: 'table',
      selectedIds: [],
      bulkActions: false,

      // Actions
      setSelectedBrulage: (brulage) => set({ selectedBrulage: brulage }),

      setFormData: (data) => set((state) => ({ 
        formData: { ...state.formData, ...data } 
      })),

      updateFormField: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value }
      })),

      openForm: (brulage) => {
        if (brulage) {
          set({ 
            formData: brulage,
            isFormOpen: true,
            isEditing: true,
            selectedBrulage: brulage
          });
        } else {
          set({ 
            formData: initialFormData,
            isFormOpen: true,
            isEditing: false,
            selectedBrulage: null
          });
        }
      },

      closeForm: () => set({ 
        isFormOpen: false,
        isEditing: false,
        formData: initialFormData,
        selectedBrulage: null
      }),

      resetForm: () => set({ formData: initialFormData }),

      // UI Actions
      setViewMode: (mode) => set({ viewMode: mode }),

      toggleSelection: (id) => set((state) => ({
        selectedIds: state.selectedIds.includes(id)
          ? state.selectedIds.filter(selectedId => selectedId !== id)
          : [...state.selectedIds, id]
      })),

      selectAll: (ids) => set({ selectedIds: ids }),

      clearSelection: () => set({ selectedIds: [] }),

      setBulkActions: (enabled) => set({ bulkActions: enabled })
    }),
    { name: 'brulage-store' }
  )
);
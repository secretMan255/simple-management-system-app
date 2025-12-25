import { create } from 'zustand';

interface TableState {
  search: string;
  page: number;
  itemsPerPage: number;
  selectedIds: Set<string>;
  filters: Record<string, string>;
  
  // Actions
  setSearch: (term: string) => void;
  setPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  toggleSelection: (id: string) => void;
  toggleAll: (ids: string[]) => void;
  setFilter: (key: string, value: string) => void;
  clearSelection: () => void;
  reset: () => void;
}

export const useTableStore = create<TableState>((set) => ({
  search: '',
  page: 1,
  itemsPerPage: 5,
  selectedIds: new Set(),
  filters: {},

  setSearch: (term) => set({ search: term, page: 1 }), // Reset to page 1 on search
  setPage: (page) => set({ page }),
  setItemsPerPage: (count) => set({ itemsPerPage: count, page: 1 }),
  
  toggleSelection: (id) => set((state) => {
    const newSelected = new Set(state.selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    return { selectedIds: newSelected };
  }),

  toggleAll: (ids) => set((state) => {
    // If all provided IDs are already selected, deselect them. Otherwise, select them.
    const allSelected = ids.every(id => state.selectedIds.has(id));
    const newSelected = new Set(state.selectedIds);
    
    if (allSelected) {
      ids.forEach(id => newSelected.delete(id));
    } else {
      ids.forEach(id => newSelected.add(id));
    }
    
    return { selectedIds: newSelected };
  }),

  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
    page: 1
  })),

  clearSelection: () => set({ selectedIds: new Set() }),

  reset: () => set({
    search: '',
    page: 1,
    itemsPerPage: 5,
    selectedIds: new Set(),
    filters: {}
  }),
}));

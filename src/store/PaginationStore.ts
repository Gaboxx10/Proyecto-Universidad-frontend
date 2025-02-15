import { create } from "zustand";

const LIMIT = 10;

interface Pagination {
  offset: number;
  page: number;
}

interface PaginationStore {
  activeSection: string; // Sección activa (por ejemplo, productos, clientes)
  pagination: Pagination; // Estado de paginación
  setActiveSection: (section: string) => void; // Método para establecer la sección activa
  updatePagination: (type: "next" | "prev") => void; // Método para actualizar la paginación
  next: () => void; // Método para ir a la siguiente página
  prev: () => void; // Método para ir a la página anterior
  reset: () => void; // Método para resetear la paginación
  setPage: (page: number) => void; // Método para establecer una página específica
  setOffset: (offset: number) => void; // Método para establecer un offset específico
  LIMIT: number; // Límite de elementos por página
}

const usePaginationStore = create<PaginationStore>((set) => ({
  activeSection: "",

  pagination: {
    offset: 1,
    page: LIMIT,
  },

  setActiveSection: (section) =>
    set((state) => {
      if (state.activeSection !== section) {
        return {
          activeSection: section,
          pagination: { offset: 1, page: LIMIT },
        };
      }
      return {};
    }),

  updatePagination: (type) =>
    set((state) => {
      let newOffset = state.pagination.offset;
      let newPage = state.pagination.page;

      if (type === "next") {
        newOffset = state.pagination.offset + 1;
        newPage = state.pagination.page + LIMIT;
      } else if (type === "prev") {
        newOffset = Math.max(state.pagination.offset - 1, 0);
        newPage = Math.max(state.pagination.page - LIMIT, 0);
      }

      return { pagination: { offset: newOffset, page: newPage } };
    }),

  next: () => set((state) => state.updatePagination("next")),
  prev: () => set((state) => state.updatePagination("prev")),
  reset: () => set({ pagination: { offset: 1, page: LIMIT } }),
  setPage: (page) => set({ pagination: { ...state.pagination, page } }),
  setOffset: (offset) => set({ pagination: { ...state.pagination, offset } }),

  LIMIT,
}));

export default usePaginationStore;

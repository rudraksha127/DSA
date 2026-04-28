import { create } from 'zustand'
import api from '@/lib/api'

const useProblemStore = create((set, get) => ({
  problems: [],
  currentProblem: null,
  loading: false,
  error: null,
  filters: {
    track: '',
    difficulty: '',
    topic: '',
    search: '',
    page: 1,
  },
  totalPages: 1,

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters, page: 1 },
    })),

  setPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),

  fetchProblems: async () => {
    set({ loading: true, error: null })
    try {
      const { filters } = get()
      const params = new URLSearchParams()
      if (filters.track)      params.set('track', filters.track)
      if (filters.difficulty) params.set('difficulty', filters.difficulty)
      if (filters.topic)      params.set('topic', filters.topic)
      if (filters.search)     params.set('search', filters.search)
      params.set('page', filters.page)
      const { data } = await api.get(`/problems?${params}`)
      set({ problems: data.problems, totalPages: data.pages, loading: false })
    } catch (err) {
      set({ error: err?.message ?? 'Failed to fetch problems', loading: false })
    }
  },

  fetchProblem: async (slug) => {
    set({ loading: true, error: null, currentProblem: null })
    try {
      const { data } = await api.get(`/problems/${slug}`)
      set({ currentProblem: data.problem, loading: false })
    } catch (err) {
      set({ error: err?.message ?? 'Failed to fetch problem', loading: false })
    }
  },
}))

export default useProblemStore

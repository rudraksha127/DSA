import { create } from 'zustand'
import api from '@/lib/api'

const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data.user, loading: false })
    } catch (err) {
      set({ error: err?.message ?? 'Failed to fetch user', loading: false })
    }
  },

  updateXP: (xp, level, rank) => {
    set((state) => ({
      user: state.user ? { ...state.user, xp, level, rank } : null,
    }))
  },

  clearUser: () => set({ user: null }),
}))

export default useUserStore

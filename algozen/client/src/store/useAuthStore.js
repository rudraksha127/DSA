import { create } from 'zustand'
import api from '../lib/api'

const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  fetchUser: async () => {
    set({ loading: true })
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))

export default useAuthStore

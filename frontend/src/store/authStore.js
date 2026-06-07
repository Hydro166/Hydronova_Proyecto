import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,

  setUser: (user) => {
    const isAdminUser = user?.rol === 'admin' || user?.rol === 'ADMIN';
    set({ 
      user, 
      isAuthenticated: !!user, 
      isAdmin: isAdminUser
    });
  },

  setToken: (token) => set({ token }),

  clearAuth: () => set({ 
    user: null, 
    token: null, 
    isAuthenticated: false, 
    isAdmin: false 
  })
}));
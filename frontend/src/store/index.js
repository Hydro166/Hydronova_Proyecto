// HydroNova v1.0 - Zustand Stores
// src/store/authStore.js

import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,

  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'ADMIN' || user?.rol === 'SUPER_ADMIN'
  }),

  setToken: (token) => set({ token }),

  verifyToken: async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        set({
          user: data.user,
          token,
          isAuthenticated: true,
          isAdmin: data.user.rol === 'ADMIN' || data.user.rol === 'SUPER_ADMIN'
        });
      } else {
        set({ token: null, user: null, isAuthenticated: false });
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  clearAuth: () => set({
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false
  })
}));

// ============================================
// src/store/cartStore.js
// ============================================
export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existingItem = items.find(item => item.productId === product.id);

    let newItems;
    if (existingItem) {
      newItems = items.map(item =>
        item.productId === product.id
          ? { ...item, cantidad: item.cantidad + quantity }
          : item
      );
    } else {
      newItems = [
        ...items,
        {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          nombre: product.nombre,
          precio: product.precio,
          precioOferta: product.precioOferta,
          precioFinal: product.precioOferta || product.precio,
          imagenUrl: product.imagenUrl,
          cantidad: quantity
        }
      ];
    }

    set({ items: newItems });
    get().calculateTotal();
  },

  updateQuantity: (productId, cantidad) => {
    const items = get().items.map(item =>
      item.productId === productId
        ? { ...item, cantidad }
        : item
    );
    set({ items });
    get().calculateTotal();
  },

  removeItem: (productId) => {
    const items = get().items.filter(item => item.productId !== productId);
    set({ items });
    get().calculateTotal();
  },

  clearCart: () => {
    set({ items: [], total: 0 });
  },

  setItems: (items) => {
    set({ items });
    get().calculateTotal();
  },

  calculateTotal: () => {
    const items = get().items;
    const total = items.reduce((sum, item) => sum + (item.precioFinal * item.cantidad), 0);
    set({ total: parseFloat(total.toFixed(2)) });
  },

  getItemCount: () => get().items.length,

  getTotal: () => get().total
}));

// ============================================
// src/store/uiStore.js
// ============================================
export const useUIStore = create((set) => ({
  cartOpen: false,
  mobileMenuOpen: false,
  theme: 'light',
  notifications: [],

  toggleCart: () => set(state => ({ cartOpen: !state.cartOpen })),
  toggleMobileMenu: () => set(state => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setTheme: (theme) => set({ theme }),

  addNotification: (notification) => {
    const id = Date.now();
    const newNotification = { id, ...notification };
    set(state => ({
      notifications: [...state.notifications, newNotification]
    }));

    // Auto-remove después de 5 segundos
    setTimeout(() => {
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    }, 5000);
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  }
}));

// ============================================
// src/store/adminStore.js
// ============================================
export const useAdminStore = create((set) => ({
  selectedTab: 'dashboard',
  filters: {},
  selectedProduct: null,
  selectedOrder: null,

  setSelectedTab: (tab) => set({ selectedTab: tab }),
  setFilters: (filters) => set({ filters }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setSelectedOrder: (order) => set({ selectedOrder: order })
}));
// HydroNova v1.0 - Frontend Hooks
// src/hooks/useAuth.js

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import * as authService from '../services/authService';

export const useAuth = () => {
  const auth = useAuthStore();

  // Verificar token al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !auth.user) {
      auth.verifyToken(token);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      auth.setUser(response.user);
      auth.setToken(response.token);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, nombre, telefono, direccion) => {
    try {
      const response = await authService.register(
        email,
        password,
        nombre,
        telefono,
        direccion
      );
      auth.setUser(response.user);
      auth.setToken(response.token);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    auth.clearAuth();
    localStorage.removeItem('token');
  };

  return {
    ...auth,
    login,
    register,
    logout
  };
};

// ============================================
// src/hooks/useCart.js
// ============================================
import { useCartStore } from '../store/cartStore';
import * as orderService from '../services/orderService';

export const useCart = () => {
  const cart = useCartStore();

  // Cargar carrito del localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('hydronova_cart');
    if (savedCart) {
      cart.setItems(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (product, quantity = 1) => {
    cart.addItem(product, quantity);
    localStorage.setItem('hydronova_cart', JSON.stringify(cart.items));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    cart.updateQuantity(productId, quantity);
    localStorage.setItem('hydronova_cart', JSON.stringify(cart.items));
  };

  const removeFromCart = (productId) => {
    cart.removeItem(productId);
    localStorage.setItem('hydronova_cart', JSON.stringify(cart.items));
  };

  const clearCart = () => {
    cart.clearCart();
    localStorage.removeItem('hydronova_cart');
  };

  return {
    ...cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
};

// ============================================
// src/hooks/useProducts.js
// ============================================
import { useState, useEffect } from 'react';
import * as productService from '../services/productService';

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0
  });

  const [filters, setFilters] = useState({
    categoria: 'Todos',
    search: '',
    page: 1,
    limit: 12,
    ...initialFilters
  });

  // Cargar productos
  useEffect(() => {
    loadProducts();
  }, [filters]);

  // Cargar categorías
  useEffect(() => {
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts(filters);
      setProducts(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset a página 1
    }));
  };

  const goToPage = (pageNum) => {
    setFilters(prev => ({
      ...prev,
      page: pageNum
    }));
  };

  const searchProducts = (query) => {
    updateFilters({ search: query });
  };

  const filterByCategory = (category) => {
    updateFilters({ categoria: category });
  };

  return {
    products,
    categories,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    goToPage,
    searchProducts,
    filterByCategory
  };
};

// ============================================
// src/hooks/useOrderDetail.js
// ============================================
import { useState, useEffect } from 'react';
import * as orderService from '../services/orderService';

export const useOrderDetail = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrder(orderId);
      setOrder(response);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { order, loading, error };
};
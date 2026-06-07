// HydroNova v1.0 - API Services
// src/services/api.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Agregar token a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Manejo de errores
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error.response?.data || error;
  }
);

// ============================================
// src/services/authService.js
// ============================================
import { api } from './api';

export const register = (email, password, nombre, telefono, direccion) =>
  api.post('/auth/register', { email, password, nombre, telefono, direccion });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const verifyToken = (token) =>
  api.post('/auth/verify', {}, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

export const getProfile = () =>
  api.get('/auth/profile');

export const updateProfile = (data) =>
  api.put('/auth/profile', data);

// ============================================
// src/services/productService.js
// ============================================
export const getProducts = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.categoria && filters.categoria !== 'Todos') {
    params.append('categoria', filters.categoria);
  }
  if (filters.search) {
    params.append('search', filters.search);
  }
  params.append('page', filters.page || 1);
  params.append('limit', filters.limit || 12);

  return api.get(`/products?${params}`);
};

export const getProduct = (id) =>
  api.get(`/products/${id}`);

export const searchProducts = (query) =>
  api.get(`/products/search/query?q=${query}`);

export const getCategories = () =>
  api.get('/products/categories/all');

// ============================================
// src/services/orderService.js
// ============================================
export const getCart = () =>
  api.get('/cart');

export const addToCart = (productId, cantidad = 1) =>
  api.post('/cart', { productId, cantidad });

export const updateCartItem = (itemId, cantidad) =>
  api.put(`/cart/${itemId}`, { cantidad });

export const removeFromCart = (itemId) =>
  api.delete(`/cart/${itemId}`);

export const clearCart = () =>
  api.delete('/cart');

export const createOrder = (data) =>
  api.post('/orders', data);

export const getOrders = () =>
  api.get('/orders');

export const getOrder = (id) =>
  api.get(`/orders/${id}`);

// ============================================
// src/services/adminService.js
// ============================================
export const getDashboard = () =>
  api.get('/admin/dashboard');

// Productos
export const getAdminProducts = (filters = {}) => {
  const params = new URLSearchParams();
  params.append('page', filters.page || 1);
  params.append('limit', filters.limit || 20);
  if (filters.activo !== undefined) {
    params.append('activo', filters.activo);
  }
  return api.get(`/admin/products?${params}`);
};

export const createProduct = (data) =>
  api.post('/admin/products', data);

export const updateProduct = (id, data) =>
  api.put(`/admin/products/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/admin/products/${id}`);

// Órdenes
export const getAdminOrders = (filters = {}) => {
  const params = new URLSearchParams();
  params.append('page', filters.page || 1);
  params.append('limit', filters.limit || 20);
  if (filters.estado) {
    params.append('estado', filters.estado);
  }
  return api.get(`/admin/orders?${params}`);
};

export const updateOrderStatus = (id, estado, notas) =>
  api.patch(`/admin/orders/${id}`, { estado, notas });

// Usuarios
export const getAdminUsers = (filters = {}) => {
  const params = new URLSearchParams();
  params.append('page', filters.page || 1);
  params.append('limit', filters.limit || 20);
  return api.get(`/admin/users?${params}`);
};

// Mensajes
export const sendMessage = (data) =>
  api.post('/messages', data);

export const getMessages = (filters = {}) => {
  const params = new URLSearchParams();
  params.append('page', filters.page || 1);
  params.append('limit', filters.limit || 20);
  if (filters.respondido !== undefined) {
    params.append('respondido', filters.respondido);
  }
  return api.get(`/messages?${params}`);
};

export const respondMessage = (id, respuesta) =>
  api.patch(`/messages/${id}`, { respuesta });
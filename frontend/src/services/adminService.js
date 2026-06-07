import { api } from './api';

export const getDashboard = () => api.get('/admin/dashboard');
export const getAdminOrders = (params) => api.get('/admin/orders', { params });
export const updateOrderStatus = (id, data) => api.patch(`/admin/orders/${id}`, data);
export const getAdminProducts = (params) => api.get('/admin/products', { params });
export const createProduct = (data) => api.post('/admin/products', data);
export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);
export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const getMessages = (params) => api.get('/messages', { params });
export const respondMessage = (id, data) => api.patch(`/messages/${id}`, data);
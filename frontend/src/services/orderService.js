import { api } from './api';

// Carrito
export const getCart = () => api.get('/cart');
export const addToCart = (productId, cantidad) => api.post('/cart', { productId, cantidad });
export const updateCartItem = (itemId, cantidad) => api.put(`/cart/${itemId}`, { cantidad });
export const removeFromCart = (itemId) => api.delete(`/cart/${itemId}`);
export const clearCart = () => api.delete('/cart');

// Órdenes
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (orderData) => api.post('/orders', orderData);
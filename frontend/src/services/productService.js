import { api } from './api';

export const getProducts = (filters) => api.get('/products', { params: filters });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get('/products/categories/all');
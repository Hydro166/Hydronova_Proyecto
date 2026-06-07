import { api } from './api';

export const register = (email, password, nombre, telefono, direccion) =>
  api.post('/auth/register', { email, password, nombre, telefono, direccion });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const verifyToken = (token) =>
  api.post('/auth/verify', {}, { headers: { Authorization: `Bearer ${token}` } });

export const getProfile = () => api.get('/auth/profile');

export const updateProfile = (data) => api.put('/auth/profile', data);
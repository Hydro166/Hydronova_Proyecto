import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import * as authService from '../services/authService';

export const useAuth = () => {
  const auth = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser && !auth.user) {
      try {
        const user = JSON.parse(savedUser);
        auth.setUser(user);
        auth.setToken(token);
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      const userData = {
        id: response.user.id,
        email: response.user.email,
        nombre: response.user.nombre,
        rol: response.user.rol,
        activo: true
      };
      
      auth.setUser(userData);
      auth.setToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, nombre, telefono, direccion) => {
    try {
      const response = await authService.register(email, password, nombre, telefono, direccion);
      
      const userData = {
        id: response.user.id,
        email: response.user.email,
        nombre: response.user.nombre,
        rol: response.user.rol || 'cliente',
        activo: true
      };
      
      auth.setUser(userData);
      auth.setToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      auth.setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    auth.clearAuth();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('hydronova_cart');
  };

  const verifyToken = async (token) => {
    try {
      const response = await authService.verifyToken(token);
      if (response.valid && response.user) {
        auth.setUser(response.user);
        auth.setToken(token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  return {
    ...auth,
    login,
    register,
    updateProfile,
    logout,
    verifyToken
  };
};
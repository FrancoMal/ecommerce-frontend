import api from './api';
import { User, LoginFormData, RegisterFormData } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Mock authentication with role-based logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Admin user
    if (email === 'admin@haversack.com' && password === 'admin123') {
      return {
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@haversack.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        token: 'mock-admin-token-' + Date.now()
      };
    }
    
    // Regular user authentication (any other email/password)
    return {
      user: {
        id: Math.floor(Math.random() * 1000) + 2,
        username: email.split('@')[0],
        email,
        firstName: 'Usuario',
        lastName: 'Demo',
        role: 'user',
        createdAt: new Date().toISOString(),
      },
      token: 'mock-user-token-' + Date.now()
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error al iniciar sesión');
  }
};

export const register = async (userData: RegisterFormData): Promise<AuthResponse> => {
  try {
    // Mock registration with role assignment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      user: {
        id: Math.floor(Math.random() * 1000) + 2,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user', // New users are regular users by default
        createdAt: new Date().toISOString(),
      },
      token: 'mock-user-token-' + Date.now()
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error al registrar usuario');
  }
};

export const getProfile = async (): Promise<User> => {
  try {
    const response = await api.get('/auth/profile');
    return response.data.user;
  } catch (error: any) {
    throw new Error(error.message || 'Error al obtener perfil');
  }
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data.user;
  } catch (error: any) {
    throw new Error(error.message || 'Error al actualizar perfil');
  }
};
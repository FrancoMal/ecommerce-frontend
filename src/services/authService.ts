import api from './api';
import { User, LoginFormData, RegisterFormData } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Error al iniciar sesión');
  }
};

export const register = async (userData: RegisterFormData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
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
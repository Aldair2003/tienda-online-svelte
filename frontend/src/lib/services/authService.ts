import type { ApiResponse } from '$lib/types';
import type { Usuario } from '$lib/stores/auth';

const API_URL = 'http://localhost:3000/api';

export interface RegistroData {
  nombre: string;
  email: string;
  password: string;
  rol: 'cliente' | 'vendedor';
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  static async registro(data: RegistroData): Promise<Usuario> {
    const response = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result: ApiResponse<Usuario> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Error en el registro');
    }
    
    return result.data!;
  }

  static async login(data: LoginData): Promise<Usuario> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result: ApiResponse<Usuario> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Credenciales inválidas');
    }
    
    return result.data!;
  }

  static async obtenerPerfil(userId: string): Promise<Usuario> {
    const response = await fetch(`${API_URL}/auth/perfil?userId=${userId}`);
    const result: ApiResponse<Usuario> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Error al obtener perfil');
    }
    
    return result.data!;
  }
}


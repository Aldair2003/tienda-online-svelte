import type { Articulo, Pedido, ApiResponse, Cliente } from '$lib/types';

// Usa variable de entorno si existe, sino usa localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class ApiService {
  // Artículos
  static async obtenerArticulos(): Promise<Articulo[]> {
    const response = await fetch(`${API_URL}/articulos`);
    const data: ApiResponse<Articulo[]> = await response.json();
    return data.data || [];
  }

  static async obtenerArticulo(id: string): Promise<Articulo | null> {
    const response = await fetch(`${API_URL}/articulos/${id}`);
    const data: ApiResponse<Articulo> = await response.json();
    return data.data || null;
  }

  static async crearArticulo(articulo: Omit<Articulo, 'id'>): Promise<Articulo> {
    const response = await fetch(`${API_URL}/articulos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articulo),
    });
    const data: ApiResponse<Articulo> = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Error al crear artículo');
    }
    return data.data!;
  }

  static async actualizarArticulo(id: string, articulo: Partial<Articulo>): Promise<Articulo> {
    const response = await fetch(`${API_URL}/articulos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articulo),
    });
    const data: ApiResponse<Articulo> = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Error al actualizar artículo');
    }
    return data.data!;
  }

  static async eliminarArticulo(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/articulos/${id}`, {
      method: 'DELETE',
    });
    const data: ApiResponse<void> = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Error al eliminar artículo');
    }
  }

  // Pedidos
  static async obtenerPedidos(): Promise<Pedido[]> {
    const response = await fetch(`${API_URL}/pedidos`);
    const data: ApiResponse<Pedido[]> = await response.json();
    return data.data || [];
  }

  static async crearPedido(
    cliente: Cliente,
    articulos: { articuloId: string; cantidad: number }[]
  ): Promise<Pedido> {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cliente, articulos }),
    });
    const data: ApiResponse<Pedido> = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Error al crear pedido');
    }
    return data.data!;
  }

  static async actualizarEstadoPedido(
    id: string,
    estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado'
  ): Promise<Pedido> {
    const response = await fetch(`${API_URL}/pedidos/${id}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado }),
    });
    const data: ApiResponse<Pedido> = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Error al actualizar estado');
    }
    return data.data!;
  }

  static async eliminarPedido(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/pedidos/${id}`, {
      method: 'DELETE',
    });
    const data: ApiResponse<void> = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Error al eliminar pedido');
    }
  }
}


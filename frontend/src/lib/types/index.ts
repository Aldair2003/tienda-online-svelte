export interface Articulo {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface Cliente {
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface ArticuloPedido {
  articuloId: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  cliente: Cliente;
  articulos: ArticuloPedido[];
  total: number;
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
  fechaPedido: string;
  fechaActualizacion?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CarritoItem {
  articulo: Articulo;
  cantidad: number;
}


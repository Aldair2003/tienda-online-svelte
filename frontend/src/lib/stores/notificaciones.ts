import { writable } from 'svelte/store';

export interface Notificacion {
  id: string;
  tipo: 'success' | 'error' | 'info' | 'warning';
  mensaje: string;
}

function crearNotificaciones() {
  const { subscribe, update } = writable<Notificacion[]>([]);

  return {
    subscribe,
    agregar: (tipo: Notificacion['tipo'], mensaje: string, duracion: number = 5000) => {
      const id = Date.now().toString();
      const notificacion: Notificacion = { id, tipo, mensaje };
      
      update(items => [...items, notificacion]);

      // Auto-remover después de la duración
      setTimeout(() => {
        update(items => items.filter(item => item.id !== id));
      }, duracion);
    },
    remover: (id: string) => {
      update(items => items.filter(item => item.id !== id));
    },
    success: (mensaje: string) => {
      return crearNotificaciones().agregar('success', mensaje);
    },
    error: (mensaje: string) => {
      return crearNotificaciones().agregar('error', mensaje);
    },
  };
}

export const notificaciones = crearNotificaciones();


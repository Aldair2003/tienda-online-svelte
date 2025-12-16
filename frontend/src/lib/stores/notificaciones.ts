import { writable } from 'svelte/store';

export interface Notificacion {
  id: string;
  tipo: 'success' | 'error' | 'info' | 'warning';
  mensaje: string;
}

function crearNotificaciones() {
  const { subscribe, update } = writable<Notificacion[]>([]);

  function agregar(tipo: Notificacion['tipo'], mensaje: string, duracion: number = 8000) {
    const id = `${Date.now()}-${Math.random()}`; // ID único para evitar duplicados
    const notificacion: Notificacion = { id, tipo, mensaje };
    
    update(items => {
      // Evitar duplicados del mismo mensaje
      const existe = items.some(item => item.mensaje === mensaje && item.tipo === tipo);
      if (existe) return items;
      return [...items, notificacion];
    });

    // Auto-remover después de la duración
    setTimeout(() => {
      update(items => items.filter(item => item.id !== id));
    }, duracion);
  }

  return {
    subscribe,
    agregar,
    remover: (id: string) => {
      update(items => items.filter(item => item.id !== id));
    },
    limpiar: () => {
      update(() => []);
    }
  };
}

export const notificaciones = crearNotificaciones();


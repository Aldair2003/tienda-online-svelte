import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'cliente' | 'vendedor';
  fechaRegistro?: string;
}

interface AuthState {
  usuario: Usuario | null;
  autenticado: boolean;
}

// Cargar desde localStorage si está disponible
const getInitialState = (): AuthState => {
  if (browser) {
    const stored = localStorage.getItem('usuario');
    if (stored) {
      try {
        const usuario = JSON.parse(stored);
        return {
          usuario,
          autenticado: true
        };
      } catch {
        return {
          usuario: null,
          autenticado: false
        };
      }
    }
  }
  return {
    usuario: null,
    autenticado: false
  };
};

function crearAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(getInitialState());

  return {
    subscribe,
    login: (usuario: Usuario) => {
      if (browser) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
      }
      set({
        usuario,
        autenticado: true
      });
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem('usuario');
      }
      set({
        usuario: null,
        autenticado: false
      });
    },
    actualizar: (usuario: Usuario) => {
      if (browser) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
      }
      update(state => ({
        ...state,
        usuario
      }));
    }
  };
}

export const auth = crearAuthStore();


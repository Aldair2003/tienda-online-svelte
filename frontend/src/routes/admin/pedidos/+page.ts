import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { auth } from '$lib/stores/auth';

export const load = () => {
  if (browser) {
    const authState = get(auth);
    
    // Si no hay usuario o no es vendedor, redirigir a login
    if (!authState.usuario || authState.usuario.rol !== 'vendedor') {
      goto('/auth');
      return {
        redirect: true
      };
    }
  }
  
  return {};
};


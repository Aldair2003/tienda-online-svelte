import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { auth } from '$lib/stores/auth';

export const load = () => {
  if (browser) {
    const authState = get(auth);
    
    // Si no hay usuario, redirigir a login
    if (!authState.usuario) {
      goto('/auth');
      return {
        redirect: true
      };
    }
  }
  
  return {};
};


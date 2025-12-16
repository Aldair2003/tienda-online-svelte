<script lang="ts">
  import { notificaciones } from '$lib/stores/notificaciones';
  import { fly, fade } from 'svelte/transition';
  import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-svelte';

  function getIcono(tipo: string) {
    switch (tipo) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  }

  function getClase(tipo: string) {
    switch (tipo) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  }

  function getIconColor(tipo: string) {
    switch (tipo) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  }
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md pointer-events-none">
  {#each $notificaciones as notif (notif.id)}
    <div
      transition:fly={{ x: 300, duration: 300 }}
      class="pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border {getClase(notif.tipo)} backdrop-blur-sm"
    >
      <svelte:component this={getIcono(notif.tipo)} class="w-5 h-5 flex-shrink-0 {getIconColor(notif.tipo)}" />
      <p class="flex-1 font-medium">{notif.mensaje}</p>
      <button
        on:click={() => notificaciones.remover(notif.id)}
        class="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  {/each}
</div>


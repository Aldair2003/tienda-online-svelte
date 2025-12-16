<script lang="ts">
  import { notificaciones } from '$lib/stores/notificaciones';
  import { fly } from 'svelte/transition';
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
      case 'success': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200';
      case 'error': return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200';
      case 'warning': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-200';
      default: return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200';
    }
  }
</script>

<div class="fixed top-20 right-4 z-50 flex flex-col gap-4 max-w-sm pointer-events-none">
  {#each $notificaciones as notif (notif.id)}
    <div
      transition:fly={{ x: 400, duration: 400 }}
      class="pointer-events-auto relative overflow-hidden rounded-xl shadow-2xl {getClase(notif.tipo)} backdrop-blur-sm"
    >
      <div class="flex items-start gap-3 p-4">
        <svelte:component this={getIcono(notif.tipo)} class="w-6 h-6 flex-shrink-0 animate-pulse" />
        <p class="flex-1 font-semibold text-base leading-relaxed">{notif.mensaje}</p>
        <button
          on:click={() => notificaciones.remover(notif.id)}
          class="text-white/80 hover:text-white transition-colors flex-shrink-0 hover:bg-white/10 rounded-full p-1"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Barra de progreso animada -->
      <div class="h-1 bg-white/20">
        <div class="h-full bg-white/50 animate-progress"></div>
      </div>
    </div>
  {/each}
</div>

<style>
  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }

  .animate-progress {
    animation: progress 8s linear;
  }
</style>


<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { X } from 'lucide-svelte';

  export let titulo: string;
  export let abierto = false;
  export let onCerrar: () => void;
</script>

{#if abierto}
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    transition:fade={{ duration: 200 }}
    on:click={onCerrar}
    on:keydown={(e) => e.key === 'Escape' && onCerrar()}
    role="button"
    tabindex="0"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      transition:scale={{ duration: 200, start: 0.95 }}
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="dialog"
      tabindex="-1"
    >
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">{titulo}</h2>
        <button
          on:click={onCerrar}
          class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
          aria-label="Cerrar"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto flex-1">
        <slot />
      </div>
    </div>
  </div>
{/if}


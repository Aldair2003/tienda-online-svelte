<script lang="ts">
  import type { Articulo } from '$lib/types';
  import { goto } from '$app/navigation';
  import { carrito } from '$lib/stores/carrito';
  import { auth } from '$lib/stores/auth';
  import { notificaciones } from '$lib/stores/notificaciones';
  import { ShoppingCart, Edit2, Trash2, Package, AlertCircle } from 'lucide-svelte';

  export let articulo: Articulo;
  export let modoAdmin = false;
  export let onEditar: ((articulo: Articulo) => void) | undefined = undefined;
  export let onEliminar: ((id: string) => void) | undefined = undefined;

  $: usuario = $auth.usuario;

  function agregarAlCarrito() {
    // Verificar si el usuario está autenticado
    if (!usuario) {
      notificaciones.agregar('warning', 'Debes iniciar sesión para agregar productos al carrito');
      goto('/auth');
      return;
    }

    // Verificar que sea un cliente
    if (usuario.rol !== 'cliente') {
      notificaciones.agregar('warning', 'Solo los clientes pueden agregar productos al carrito');
      return;
    }

    if (articulo.stock > 0) {
      carrito.agregar(articulo, 1);
      notificaciones.agregar('success', `${articulo.nombre} agregado al carrito`);
    }
  }
</script>

<div class="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
  <div class="relative overflow-hidden rounded-lg mb-4">
    {#if articulo.imagen}
      <img
        src={articulo.imagen}
        alt={articulo.nombre}
        class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
      />
    {:else}
      <div class="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Package class="w-16 h-16 text-gray-300" />
      </div>
    {/if}
    {#if articulo.stock === 0}
      <div class="absolute inset-0 bg-black/60 flex items-center justify-center">
        <div class="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
          <AlertCircle class="w-4 h-4" />
          <span>Agotado</span>
        </div>
      </div>
    {/if}
  </div>

  <h3 class="text-xl font-bold mb-2 text-gray-900 line-clamp-1">{articulo.nombre}</h3>
  
  {#if articulo.descripcion}
    <p class="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">{articulo.descripcion}</p>
  {/if}

  <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
    <div>
      <div class="text-3xl font-bold text-primary">${articulo.precio.toFixed(2)}</div>
    </div>
    <div class="text-right">
      <div class="text-xs text-gray-500 mb-1">Disponible</div>
      <div class="flex items-center gap-1 {articulo.stock > 0 ? 'text-green-600' : 'text-red-600'} font-semibold">
        <Package class="w-4 h-4" />
        <span>{articulo.stock}</span>
      </div>
    </div>
  </div>

  {#if modoAdmin}
    <div class="flex gap-2">
      <button
        on:click={() => onEditar?.(articulo)}
        class="flex-1 flex items-center justify-center gap-2 btn bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
      >
        <Edit2 class="w-4 h-4" />
        <span>Editar</span>
      </button>
      <button
        on:click={() => onEliminar?.(articulo.id)}
        class="flex-1 flex items-center justify-center gap-2 btn btn-danger shadow-sm"
      >
        <Trash2 class="w-4 h-4" />
        <span>Eliminar</span>
      </button>
    </div>
  {:else}
    <button
      on:click={agregarAlCarrito}
      disabled={articulo.stock === 0}
      class="w-full flex items-center justify-center gap-2 btn {articulo.stock > 0 ? 'btn-primary shadow-sm' : 'btn-secondary cursor-not-allowed opacity-60'} transition-all"
    >
      <ShoppingCart class="w-4 h-4" />
      <span>{articulo.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}</span>
    </button>
  {/if}
</div>


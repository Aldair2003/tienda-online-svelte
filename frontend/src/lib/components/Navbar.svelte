<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { cantidadItems } from '$lib/stores/carrito';
  import { auth } from '$lib/stores/auth';
  import { notificaciones } from '$lib/stores/notificaciones';
  import { ShoppingCart, Store, Package, ClipboardList, LayoutDashboard, ArrowLeft, LogOut, User } from 'lucide-svelte';

  $: esAdmin = $page.url.pathname.startsWith('/admin');
  $: esCliente = $page.url.pathname === '/' || $page.url.pathname.startsWith('/carrito');
  $: usuario = $auth.usuario;

  function handleLogout() {
    auth.logout();
    notificaciones.agregar('success', 'Sesión cerrada correctamente');
    goto('/auth');
  }
</script>

<nav class="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <div class="flex items-center gap-8">
        <a href="/" class="flex items-center gap-2 text-2xl font-bold text-primary hover:text-blue-700 transition-colors">
          <Store class="w-7 h-7" />
          <span>Mi Tienda</span>
        </a>
        
        {#if esAdmin}
          <div class="hidden md:flex gap-2">
            <a
              href="/admin"
              class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all {$page.url.pathname === '/admin' ? 'bg-primary text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}"
            >
              <Package class="w-4 h-4" />
              <span>Artículos</span>
            </a>
            <a
              href="/admin/pedidos"
              class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all {$page.url.pathname === '/admin/pedidos' ? 'bg-primary text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}"
            >
              <ClipboardList class="w-4 h-4" />
              <span>Pedidos</span>
            </a>
          </div>
        {/if}
      </div>

      <div class="flex items-center gap-3">
        {#if usuario}
          <!-- Usuario autenticado -->
          <div class="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <User class="w-4 h-4 text-gray-600" />
            <span class="text-sm font-medium text-gray-700">{usuario.nombre}</span>
            <span class="text-xs px-2 py-0.5 bg-primary text-white rounded-full">{usuario.rol === 'vendedor' ? 'Vendedor' : 'Cliente'}</span>
          </div>

          {#if usuario.rol === 'cliente' && esCliente}
            <a
              href="/carrito"
              class="relative btn btn-primary flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <ShoppingCart class="w-4 h-4" />
              <span class="hidden sm:inline">Carrito</span>
              {#if $cantidadItems > 0}
                <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md animate-pulse">
                  {$cantidadItems}
                </span>
              {/if}
            </a>
          {:else if usuario.rol === 'vendedor' && !esAdmin}
            <a href="/admin" class="btn btn-primary flex items-center gap-2">
              <LayoutDashboard class="w-4 h-4" />
              <span>Panel Vendedor</span>
            </a>
          {:else if usuario.rol === 'vendedor' && esAdmin}
            <a href="/" class="btn btn-secondary flex items-center gap-2">
              <ArrowLeft class="w-4 h-4" />
              <span>Ver Tienda</span>
            </a>
          {:else if usuario.rol === 'cliente' && esAdmin}
            <a href="/" class="btn btn-secondary flex items-center gap-2">
              <ArrowLeft class="w-4 h-4" />
              <span>Ver Tienda</span>
            </a>
          {/if}

          <button
            on:click={handleLogout}
            class="flex items-center gap-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-all"
          >
            <LogOut class="w-4 h-4" />
            <span class="hidden sm:inline">Salir</span>
          </button>
        {:else}
          <!-- Usuario no autenticado -->
          <a href="/auth" class="btn btn-primary">
            Iniciar Sesión
          </a>
        {/if}
      </div>
    </div>
  </div>
</nav>


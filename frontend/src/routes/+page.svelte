<script lang="ts">
  import { onMount } from 'svelte';
  import type { Articulo } from '$lib/types';
  import { ApiService } from '$lib/services/api';
  import TarjetaArticulo from '$lib/components/TarjetaArticulo.svelte';
  import Navbar from '$lib/components/Navbar.svelte';

  let articulos: Articulo[] = [];
  let cargando = true;
  let error = '';
  let busqueda = '';

  onMount(async () => {
    await cargarArticulos();
  });

  async function cargarArticulos() {
    try {
      cargando = true;
      articulos = await ApiService.obtenerArticulos();
      error = '';
    } catch (err) {
      error = 'Error al cargar los artículos. Asegúrate de que el servidor esté corriendo.';
      console.error(err);
    } finally {
      cargando = false;
    }
  }

  $: articulosFiltrados = articulos.filter(art =>
    art.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    art.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  $: articulosDisponibles = articulosFiltrados.filter(art => art.stock > 0);
  $: articulosSinStock = articulosFiltrados.filter(art => art.stock === 0);
</script>

<svelte:head>
  <title>Mi Tienda - Catálogo de Productos</title>
</svelte:head>

<Navbar />

<div class="max-w-7xl mx-auto px-4 py-8">
  <!-- Hero Section -->
  <div class="text-center mb-12 py-8">
    <h1 class="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
      Bienvenido a Mi Tienda
    </h1>
    <p class="text-xl text-gray-600 max-w-2xl mx-auto">
      Encuentra los mejores productos al mejor precio
    </p>
  </div>

  <!-- Buscador -->
  <div class="mb-10 max-w-2xl mx-auto">
    <div class="relative">
      <input
        type="text"
        bind:value={busqueda}
        placeholder="Buscar productos..."
        class="input pl-12 shadow-sm focus:shadow-md transition-shadow"
      />
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>

  {#if cargando}
    <div class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    </div>
  {:else if error}
    <div class="card bg-red-50 border-red-200 text-center py-12">
      <p class="text-red-600 text-lg mb-4">{error}</p>
      <button on:click={cargarArticulos} class="btn btn-primary">
        Reintentar
      </button>
    </div>
  {:else if articulos.length === 0}
    <div class="card text-center py-12">
      <p class="text-gray-600 text-lg mb-4">No hay artículos disponibles en este momento</p>
      <a href="/admin" class="btn btn-primary">
        Ir al panel de administración
      </a>
    </div>
  {:else}
    <!-- Productos disponibles -->
    {#if articulosDisponibles.length > 0}
      <div class="mb-12">
        <h2 class="text-3xl font-bold mb-6">Productos Disponibles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {#each articulosDisponibles as articulo (articulo.id)}
            <TarjetaArticulo {articulo} />
          {/each}
        </div>
      </div>
    {/if}

    <!-- Productos sin stock -->
    {#if articulosSinStock.length > 0}
      <div class="opacity-60">
        <h2 class="text-2xl font-bold mb-6 text-gray-500">Sin Stock</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {#each articulosSinStock as articulo (articulo.id)}
            <TarjetaArticulo {articulo} />
          {/each}
        </div>
      </div>
    {/if}

    {#if articulosFiltrados.length === 0}
      <div class="card text-center py-12">
        <p class="text-gray-600 text-lg">No se encontraron productos que coincidan con tu búsqueda</p>
      </div>
    {/if}
  {/if}
</div>

<script lang="ts">
  import { onMount } from 'svelte';
  import type { Articulo } from '$lib/types';
  import { ApiService } from '$lib/services/api';
  import { notificaciones } from '$lib/stores/notificaciones';
  import TarjetaArticulo from '$lib/components/TarjetaArticulo.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { Plus, Package } from 'lucide-svelte';

  let articulos: Articulo[] = [];
  let cargando = true;
  let modalAbierto = false;
  let editando = false;
  
  let formulario = {
    id: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen: ''
  };

  onMount(async () => {
    await cargarArticulos();
  });

  async function cargarArticulos() {
    try {
      cargando = true;
      articulos = await ApiService.obtenerArticulos();
    } catch (err) {
      notificaciones.agregar('error', 'Error al cargar artículos');
    } finally {
      cargando = false;
    }
  }

  function abrirModalNuevo() {
    editando = false;
    formulario = {
      id: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagen: ''
    };
    modalAbierto = true;
  }

  function abrirModalEditar(articulo: Articulo) {
    editando = true;
    formulario = { ...articulo };
    modalAbierto = true;
  }

  function cerrarModal() {
    modalAbierto = false;
  }

  async function guardarArticulo() {
    try {
      if (!formulario.nombre || formulario.precio < 0 || formulario.stock < 0) {
        notificaciones.agregar('error', 'Por favor completa todos los campos correctamente');
        return;
      }

      if (editando) {
        await ApiService.actualizarArticulo(formulario.id, formulario);
        notificaciones.agregar('success', 'Artículo actualizado exitosamente');
      } else {
        await ApiService.crearArticulo(formulario);
        notificaciones.agregar('success', 'Artículo creado exitosamente');
      }

      await cargarArticulos();
      cerrarModal();
    } catch (err: any) {
      notificaciones.agregar('error', err.message || 'Error al guardar artículo');
    }
  }

  async function eliminarArticulo(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
      return;
    }

    try {
      await ApiService.eliminarArticulo(id);
      notificaciones.agregar('success', 'Artículo eliminado exitosamente');
      await cargarArticulos();
    } catch (err: any) {
      notificaciones.agregar('error', err.message || 'Error al eliminar artículo');
    }
  }
</script>

<svelte:head>
  <title>Admin - Gestión de Artículos</title>
</svelte:head>

<Navbar />

<div class="max-w-7xl mx-auto px-4 py-8">
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
    <div>
      <div class="flex items-center gap-3 mb-2">
        <div class="p-3 bg-primary/10 rounded-xl">
          <Package class="w-8 h-8 text-primary" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900">Gestión de Artículos</h1>
      </div>
      <p class="text-gray-600 ml-14">Administra el inventario de tu tienda</p>
    </div>
    <button on:click={abrirModalNuevo} class="btn btn-primary shadow-md hover:shadow-lg whitespace-nowrap">
      <Plus class="w-5 h-5" />
      <span>Nuevo Artículo</span>
    </button>
  </div>

  {#if cargando}
    <div class="flex flex-col justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      <p class="mt-4 text-gray-600">Cargando artículos...</p>
    </div>
  {:else if articulos.length === 0}
    <div class="card text-center py-16 max-w-md mx-auto">
      <div class="mb-6">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package class="w-10 h-10 text-gray-400" />
        </div>
        <p class="text-gray-600 text-lg mb-2 font-medium">No hay artículos registrados</p>
        <p class="text-gray-500 text-sm">Comienza agregando tu primer producto</p>
      </div>
      <button on:click={abrirModalNuevo} class="btn btn-primary">
        <Plus class="w-5 h-5" />
        <span>Crear primer artículo</span>
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each articulos as articulo (articulo.id)}
        <TarjetaArticulo
          {articulo}
          modoAdmin={true}
          onEditar={abrirModalEditar}
          onEliminar={eliminarArticulo}
        />
      {/each}
    </div>
  {/if}
</div>

<!-- Modal de formulario -->
<Modal
  titulo={editando ? 'Editar Artículo' : 'Nuevo Artículo'}
  abierto={modalAbierto}
  onCerrar={cerrarModal}
>
  <form on:submit|preventDefault={guardarArticulo} class="space-y-4">
    <div>
      <label for="nombre-articulo" class="label">Nombre del Artículo *</label>
      <input
        id="nombre-articulo"
        type="text"
        bind:value={formulario.nombre}
        class="input"
        required
      />
    </div>

    <div>
      <label for="descripcion-articulo" class="label">Descripción</label>
      <textarea
        id="descripcion-articulo"
        bind:value={formulario.descripcion}
        class="input"
        rows="3"
      ></textarea>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="precio-articulo" class="label">Precio *</label>
        <input
          id="precio-articulo"
          type="number"
          step="0.01"
          min="0"
          bind:value={formulario.precio}
          class="input"
          required
        />
      </div>

      <div>
        <label for="stock-articulo" class="label">Stock *</label>
        <input
          id="stock-articulo"
          type="number"
          min="0"
          bind:value={formulario.stock}
          class="input"
          required
        />
      </div>
    </div>

    <div>
      <label for="imagen-articulo" class="label">URL de Imagen</label>
      <input
        id="imagen-articulo"
        type="url"
        bind:value={formulario.imagen}
        class="input"
        placeholder="https://ejemplo.com/imagen.jpg"
      />
    </div>

    {#if formulario.imagen}
      <div>
        <p class="text-sm text-gray-600 mb-2">Vista previa:</p>
        <img
          src={formulario.imagen}
          alt="Preview"
          class="w-full h-48 object-cover rounded-lg"
          on:error={() => notificaciones.agregar('warning', 'No se pudo cargar la imagen')}
        />
      </div>
    {/if}

    <div class="flex gap-4 pt-4">
      <button type="submit" class="flex-1 btn btn-success">
        {editando ? '✓ Actualizar' : '✓ Crear'}
      </button>
      <button type="button" on:click={cerrarModal} class="flex-1 btn btn-secondary">
        Cancelar
      </button>
    </div>
  </form>
</Modal>


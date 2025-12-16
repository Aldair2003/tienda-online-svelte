<script lang="ts">
  import { goto } from '$app/navigation';
  import { carrito, totalCarrito } from '$lib/stores/carrito';
  import { notificaciones } from '$lib/stores/notificaciones';
  import { ApiService } from '$lib/services/api';
  import type { Cliente } from '$lib/types';
  import Navbar from '$lib/components/Navbar.svelte';
  import { 
    ShoppingCart, 
    Plus, 
    Minus, 
    Trash2, 
    ArrowLeft, 
    CreditCard,
    User,
    MapPin,
    Phone,
    Package,
    CheckCircle
  } from 'lucide-svelte';

  let cliente: Cliente = {
    nombre: '',
    direccion: '',
    telefono: ''
  };

  let procesando = false;
  let mostrarFormulario = false;

  function actualizarCantidad(articuloId: string, cantidad: number) {
    if (cantidad < 1) return;
    carrito.actualizar(articuloId, cantidad);
  }

  function eliminarItem(articuloId: string) {
    carrito.eliminar(articuloId);
    notificaciones.agregar('info', 'Producto eliminado del carrito');
  }

  async function procesarPedido() {
    // Validar formulario
    if (!cliente.nombre || !cliente.direccion || !cliente.telefono) {
      notificaciones.agregar('error', 'Por favor completa todos los campos');
      return;
    }

    if ($carrito.length === 0) {
      notificaciones.agregar('error', 'El carrito está vacío');
      return;
    }

    try {
      procesando = true;
      
      const articulos = $carrito.map(item => ({
        articuloId: item.articulo.id,
        cantidad: item.cantidad
      }));

      await ApiService.crearPedido(cliente, articulos);
      
      notificaciones.agregar('success', '¡Pedido realizado exitosamente!');
      carrito.limpiar();
      
      // Resetear formulario
      cliente = { nombre: '', direccion: '', telefono: '' };
      mostrarFormulario = false;
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        goto('/');
      }, 2000);
    } catch (err: any) {
      notificaciones.agregar('error', err.message || 'Error al procesar el pedido');
    } finally {
      procesando = false;
    }
  }
</script>

<svelte:head>
  <title>Carrito de Compras</title>
</svelte:head>

<Navbar />

<div class="max-w-6xl mx-auto px-4 py-8">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
    <div class="flex items-center gap-4">
      <div class="p-3 bg-primary/10 rounded-xl">
        <ShoppingCart class="w-8 h-8 text-primary" />
      </div>
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Carrito de Compras</h1>
        <p class="text-gray-600">{$carrito.length} {$carrito.length === 1 ? 'producto' : 'productos'} en tu carrito</p>
      </div>
    </div>
    <a href="/" class="btn btn-secondary whitespace-nowrap shadow-sm hover:shadow-md w-full sm:w-auto justify-center">
      <ArrowLeft class="w-4 h-4" />
      <span>Seguir Comprando</span>
    </a>
  </div>

  {#if $carrito.length === 0}
    <div class="card text-center py-16 max-w-md mx-auto shadow-lg">
      <div class="mb-8">
        <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShoppingCart class="w-12 h-12 text-primary" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p class="text-gray-600">Descubre nuestros productos y agrega tus favoritos</p>
      </div>
      <div class="space-y-3">
        <a href="/" class="btn btn-primary py-3 text-lg shadow-lg hover:shadow-xl w-full sm:w-auto inline-flex">
          <Package class="w-5 h-5" />
          <span>Explorar Productos</span>
        </a>
        <p class="text-sm text-gray-500 mt-3">
          Encuentra artículos de calidad al mejor precio
        </p>
      </div>
    </div>
  {:else}
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Items del carrito -->
      <div class="lg:col-span-2">
        <div class="space-y-4">
          {#each $carrito as item (item.articulo.id)}
            <div class="card hover:shadow-lg transition-all duration-300 border-l-4 border-primary">
              <div class="flex gap-5">
                <!-- Imagen del producto -->
                <div class="relative flex-shrink-0">
                  {#if item.articulo.imagen}
                    <img
                      src={item.articulo.imagen}
                      alt={item.articulo.nombre}
                      class="w-28 h-28 object-cover rounded-xl"
                    />
                  {:else}
                    <div class="w-28 h-28 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                      <Package class="w-12 h-12 text-gray-300" />
                    </div>
                  {/if}
                </div>

                <!-- Información del producto -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-xl text-gray-900 mb-1 truncate">{item.articulo.nombre}</h3>
                  {#if item.articulo.descripcion}
                    <p class="text-gray-600 text-sm mb-3 line-clamp-1">{item.articulo.descripcion}</p>
                  {/if}
                  
                  <div class="flex items-center gap-2 mb-4">
                    <span class="text-lg font-semibold text-gray-700">${item.articulo.precio.toFixed(2)}</span>
                    <span class="text-sm text-gray-500">c/u</span>
                  </div>
                  
                  <div class="flex items-center gap-4 flex-wrap">
                    <!-- Controles de cantidad -->
                    <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                      <button
                        on:click={() => actualizarCantidad(item.articulo.id, item.cantidad - 1)}
                        class="w-9 h-9 btn btn-secondary flex items-center justify-center p-0 disabled:opacity-30"
                        disabled={item.cantidad <= 1}
                        aria-label="Disminuir cantidad"
                      >
                        <Minus class="w-4 h-4" />
                      </button>
                      <span class="w-12 text-center font-bold text-lg text-gray-900">{item.cantidad}</span>
                      <button
                        on:click={() => actualizarCantidad(item.articulo.id, item.cantidad + 1)}
                        class="w-9 h-9 btn btn-primary flex items-center justify-center p-0 disabled:opacity-30"
                        disabled={item.cantidad >= item.articulo.stock}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus class="w-4 h-4" />
                      </button>
                    </div>
                    
                    <!-- Stock disponible -->
                    <div class="flex items-center gap-2 text-sm">
                      <Package class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-600">
                        {item.articulo.stock} disponibles
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Precio y eliminar -->
                <div class="flex flex-col items-end justify-between flex-shrink-0">
                  <div class="text-right">
                    <p class="text-xs text-gray-500 mb-1">Subtotal</p>
                    <p class="font-bold text-2xl text-primary">
                      ${(item.articulo.precio * item.cantidad).toFixed(2)}
                    </p>
                  </div>
                  <button
                    on:click={() => eliminarItem(item.articulo.id)}
                    class="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
                  >
                    <Trash2 class="w-4 h-4" />
                    <span class="text-sm font-medium">Eliminar</span>
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Resumen y checkout -->
      <div class="lg:col-span-1">
        <div class="card sticky top-24 shadow-xl">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-green-100 rounded-lg">
              <CheckCircle class="w-6 h-6 text-green-600" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Resumen del Pedido</h2>
          </div>
          
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 mb-6">
            <div class="space-y-3 mb-4">
              <div class="flex justify-between text-gray-700">
                <span>Subtotal ({$carrito.length} {$carrito.length === 1 ? 'producto' : 'productos'})</span>
                <span class="font-semibold">${$totalCarrito.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-gray-700">
                <span>Envío</span>
                <span class="font-semibold text-green-600">Gratis</span>
              </div>
            </div>
            <div class="border-t-2 border-gray-300 pt-4">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Total</span>
                <span class="text-3xl font-bold text-primary">${$totalCarrito.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {#if !mostrarFormulario}
            <button
              on:click={() => mostrarFormulario = true}
              class="w-full btn btn-primary py-3 text-lg mb-3 shadow-lg hover:shadow-xl"
            >
              <CreditCard class="w-5 h-5" />
              <span>Proceder al Pago</span>
            </button>
            <a href="/" class="w-full btn btn-secondary flex items-center justify-center gap-2">
              <ArrowLeft class="w-4 h-4" />
              <span>Seguir Comprando</span>
            </a>
          {:else}
            <form on:submit|preventDefault={procesarPedido} class="space-y-5">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div class="flex items-start gap-3">
                  <User class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 class="font-bold text-lg text-gray-900 mb-1">Datos de Entrega</h3>
                    <p class="text-sm text-gray-600">Completa tu información para recibir el pedido</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label for="nombre-cliente" class="label">Nombre Completo</label>
                <div class="relative">
                  <User class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="nombre-cliente"
                    type="text"
                    bind:value={cliente.nombre}
                    class="input pl-11"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
              </div>

              <div>
                <label for="direccion-cliente" class="label">Dirección de Entrega</label>
                <div class="relative">
                  <MapPin class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    id="direccion-cliente"
                    bind:value={cliente.direccion}
                    class="input pl-11 min-h-[100px]"
                    placeholder="Calle Principal #123, Col. Centro, Ciudad"
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>

              <div>
                <label for="telefono-cliente" class="label">Teléfono de Contacto</label>
                <div class="relative">
                  <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="telefono-cliente"
                    type="tel"
                    bind:value={cliente.telefono}
                    class="input pl-11"
                    placeholder="+52 33 1234 5678"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={procesando}
                class="w-full btn btn-success py-3 text-lg shadow-lg hover:shadow-xl"
              >
                {#if procesando}
                  <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Procesando...</span>
                {:else}
                  <CheckCircle class="w-5 h-5" />
                  <span>Confirmar Pedido</span>
                {/if}
              </button>

              <button
                type="button"
                on:click={() => mostrarFormulario = false}
                class="w-full btn btn-secondary"
                disabled={procesando}
              >
                Cancelar
              </button>
              
              <div class="pt-4 border-t border-gray-200">
                <a href="/" class="w-full btn btn-secondary flex items-center justify-center gap-2 bg-white border-2">
                  <ArrowLeft class="w-4 h-4" />
                  <span>Seguir Comprando</span>
                </a>
              </div>
            </form>
          {/if}
          
          <!-- Indicador de seguridad (siempre visible) -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex items-start gap-3 text-sm text-gray-600">
              <CheckCircle class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-semibold text-gray-900 mb-1">Compra 100% segura</p>
                <p class="text-xs">Tus datos están protegidos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>


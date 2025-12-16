<script lang="ts">
  import { onMount } from 'svelte';
  import type { Pedido } from '$lib/types';
  import { ApiService } from '$lib/services/api';
  import { notificaciones } from '$lib/stores/notificaciones';
  import Navbar from '$lib/components/Navbar.svelte';
  import Notificaciones from '$lib/components/Notificaciones.svelte';
  import { 
    ClipboardList, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Loader2,
    User,
    MapPin,
    Phone,
    Package,
    DollarSign,
    Calendar,
    Trash2,
    Filter,
    TrendingUp,
    ShoppingBag
  } from 'lucide-svelte';

  let pedidos: Pedido[] = [];
  let cargando = true;
  let filtroEstado: string = 'todos';

  onMount(async () => {
    await cargarPedidos();
  });

  async function cargarPedidos() {
    try {
      cargando = true;
      pedidos = await ApiService.obtenerPedidos();
      pedidos.sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());
    } catch (err) {
      notificaciones.agregar('error', 'Error al cargar pedidos');
    } finally {
      cargando = false;
    }
  }

  async function cambiarEstado(id: string, estado: Pedido['estado']) {
    try {
      await ApiService.actualizarEstadoPedido(id, estado);
      notificaciones.agregar('success', 'Estado actualizado correctamente');
      await cargarPedidos();
    } catch (err: any) {
      notificaciones.agregar('error', err.message || 'Error al actualizar estado');
    }
  }

  async function eliminarPedido(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      return;
    }

    try {
      await ApiService.eliminarPedido(id);
      notificaciones.agregar('success', 'Pedido eliminado');
      await cargarPedidos();
    } catch (err: any) {
      notificaciones.agregar('error', err.message || 'Error al eliminar pedido');
    }
  }

  function formatearFecha(fecha: string) {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getEstadoConfig(estado: string) {
    switch (estado) {
      case 'pendiente': 
        return {
          clase: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icono: Clock,
          color: 'text-yellow-600',
          texto: 'Pendiente'
        };
      case 'en_proceso': 
        return {
          clase: 'bg-blue-100 text-blue-800 border-blue-200',
          icono: Loader2,
          color: 'text-blue-600',
          texto: 'En Proceso'
        };
      case 'completado': 
        return {
          clase: 'bg-green-100 text-green-800 border-green-200',
          icono: CheckCircle2,
          color: 'text-green-600',
          texto: 'Completado'
        };
      case 'cancelado': 
        return {
          clase: 'bg-red-100 text-red-800 border-red-200',
          icono: XCircle,
          color: 'text-red-600',
          texto: 'Cancelado'
        };
      default: 
        return {
          clase: 'bg-gray-100 text-gray-800 border-gray-200',
          icono: Clock,
          color: 'text-gray-600',
          texto: estado
        };
    }
  }

  $: pedidosFiltrados = filtroEstado === 'todos'
    ? pedidos
    : pedidos.filter(p => p.estado === filtroEstado);

  $: totalVentas = pedidos
    .filter(p => p.estado === 'completado')
    .reduce((sum, p) => sum + p.total, 0);
</script>

<svelte:head>
  <title>Admin - Gestión de Pedidos</title>
</svelte:head>

<Navbar />
<Notificaciones />

<div class="max-w-7xl mx-auto px-4 py-8">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
    <div>
      <div class="flex items-center gap-3 mb-2">
        <div class="p-3 bg-primary/10 rounded-xl">
          <ClipboardList class="w-8 h-8 text-primary" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900">Gestión de Pedidos</h1>
      </div>
      <p class="text-gray-600 ml-14">Administra y rastrea todos los pedidos de tus clientes</p>
    </div>
  </div>

  <!-- Estadísticas -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 hover:shadow-xl transition-all">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm opacity-90 mb-1">Total Pedidos</p>
          <p class="text-4xl font-bold">{pedidos.length}</p>
        </div>
        <ShoppingBag class="w-12 h-12 opacity-20" />
      </div>
    </div>
    
    <div class="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 hover:shadow-xl transition-all">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm opacity-90 mb-1">Pendientes</p>
          <p class="text-4xl font-bold">{pedidos.filter(p => p.estado === 'pendiente').length}</p>
        </div>
        <Clock class="w-12 h-12 opacity-20" />
      </div>
    </div>
    
    <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white border-0 hover:shadow-xl transition-all">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm opacity-90 mb-1">Completados</p>
          <p class="text-4xl font-bold">{pedidos.filter(p => p.estado === 'completado').length}</p>
        </div>
        <CheckCircle2 class="w-12 h-12 opacity-20" />
      </div>
    </div>
    
    <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 hover:shadow-xl transition-all">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm opacity-90 mb-1">Ventas Totales</p>
          <p class="text-4xl font-bold">${totalVentas.toFixed(2)}</p>
        </div>
        <TrendingUp class="w-12 h-12 opacity-20" />
      </div>
    </div>
  </div>

  <!-- Filtros -->
  <div class="card mb-6">
    <div class="flex items-center gap-3 mb-4">
      <Filter class="w-5 h-5 text-gray-600" />
      <h3 class="font-semibold text-gray-900">Filtrar por estado</h3>
    </div>
    <div class="flex gap-2 flex-wrap">
      <button
        on:click={() => filtroEstado = 'todos'}
        class="btn {filtroEstado === 'todos' ? 'btn-primary' : 'btn-secondary'}"
      >
        Todos ({pedidos.length})
      </button>
      <button
        on:click={() => filtroEstado = 'pendiente'}
        class="btn {filtroEstado === 'pendiente' ? 'btn-primary' : 'btn-secondary'}"
      >
        <Clock class="w-4 h-4" />
        <span>Pendientes ({pedidos.filter(p => p.estado === 'pendiente').length})</span>
      </button>
      <button
        on:click={() => filtroEstado = 'en_proceso'}
        class="btn {filtroEstado === 'en_proceso' ? 'btn-primary' : 'btn-secondary'}"
      >
        <Loader2 class="w-4 h-4" />
        <span>En Proceso ({pedidos.filter(p => p.estado === 'en_proceso').length})</span>
      </button>
      <button
        on:click={() => filtroEstado = 'completado'}
        class="btn {filtroEstado === 'completado' ? 'btn-primary' : 'btn-secondary'}"
      >
        <CheckCircle2 class="w-4 h-4" />
        <span>Completados ({pedidos.filter(p => p.estado === 'completado').length})</span>
      </button>
      <button
        on:click={() => filtroEstado = 'cancelado'}
        class="btn {filtroEstado === 'cancelado' ? 'btn-primary' : 'btn-secondary'}"
      >
        <XCircle class="w-4 h-4" />
        <span>Cancelados ({pedidos.filter(p => p.estado === 'cancelado').length})</span>
      </button>
    </div>
  </div>

  {#if cargando}
    <div class="flex flex-col justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      <p class="mt-4 text-gray-600">Cargando pedidos...</p>
    </div>
  {:else if pedidosFiltrados.length === 0}
    <div class="card text-center py-16 max-w-md mx-auto">
      <div class="mb-6">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag class="w-10 h-10 text-gray-400" />
        </div>
        <p class="text-gray-600 text-lg mb-2 font-medium">
          {filtroEstado === 'todos' ? 'No hay pedidos registrados' : `No hay pedidos ${getEstadoConfig(filtroEstado).texto.toLowerCase()}`}
        </p>
        <p class="text-gray-500 text-sm">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
      </div>
    </div>
  {:else}
    <div class="space-y-4">
      {#each pedidosFiltrados as pedido (pedido.id)}
        {@const estadoConfig = getEstadoConfig(pedido.estado)}
        <div class="card hover:shadow-xl transition-all duration-300 border-l-4 {estadoConfig.color.replace('text-', 'border-')}">
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Información del pedido -->
            <div class="flex-1">
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-2xl font-bold text-gray-900">Pedido #{pedido.id.slice(-8)}</h3>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar class="w-4 h-4" />
                    <span>{formatearFecha(pedido.fechaPedido)}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 rounded-lg border {estadoConfig.clase}">
                  <svelte:component this={estadoConfig.icono} class="w-4 h-4" />
                  <span class="font-semibold">{estadoConfig.texto}</span>
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-4 mb-4">
                <!-- Datos del cliente -->
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <div class="flex items-center gap-2 mb-4">
                    <User class="w-5 h-5 text-primary" />
                    <h4 class="font-semibold text-gray-900">Datos del Cliente</h4>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-start gap-3">
                      <User class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p class="text-xs text-gray-500">Nombre</p>
                        <p class="font-medium text-gray-900">{pedido.cliente.nombre}</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-3">
                      <MapPin class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p class="text-xs text-gray-500">Dirección</p>
                        <p class="font-medium text-gray-900">{pedido.cliente.direccion}</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-3">
                      <Phone class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p class="text-xs text-gray-500">Teléfono</p>
                        <p class="font-medium text-gray-900">{pedido.cliente.telefono}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Artículos del pedido -->
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <div class="flex items-center gap-2 mb-4">
                    <Package class="w-5 h-5 text-primary" />
                    <h4 class="font-semibold text-gray-900">Artículos ({pedido.articulos.length})</h4>
                  </div>
                  <div class="space-y-2 mb-4">
                    {#each pedido.articulos as articulo}
                      <div class="flex justify-between items-center text-sm bg-white rounded-lg p-3 border border-blue-100">
                        <div class="flex-1">
                          <p class="font-medium text-gray-900">{articulo.nombre}</p>
                          <p class="text-xs text-gray-500">Cantidad: {articulo.cantidad} × ${articulo.precio.toFixed(2)}</p>
                        </div>
                        <span class="font-bold text-primary">${articulo.subtotal.toFixed(2)}</span>
                      </div>
                    {/each}
                  </div>
                  <div class="border-t-2 border-blue-200 pt-3 flex justify-between items-center">
                    <div class="flex items-center gap-2">
                      <DollarSign class="w-5 h-5 text-primary" />
                      <span class="font-semibold text-gray-900">Total:</span>
                    </div>
                    <span class="text-2xl font-bold text-primary">${pedido.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Panel de acciones -->
            <div class="lg:w-64 flex flex-col gap-3 bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 class="font-semibold text-gray-900 mb-2">Cambiar Estado</h4>
              
              <button
                on:click={() => cambiarEstado(pedido.id, 'pendiente')}
                disabled={pedido.estado === 'pendiente'}
                class="btn justify-start {pedido.estado === 'pendiente' ? 'bg-gray-200 cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600'}"
              >
                <Clock class="w-4 h-4" />
                <span>Pendiente</span>
              </button>
              
              <button
                on:click={() => cambiarEstado(pedido.id, 'en_proceso')}
                disabled={pedido.estado === 'en_proceso'}
                class="btn justify-start {pedido.estado === 'en_proceso' ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}"
              >
                <Loader2 class="w-4 h-4" />
                <span>En Proceso</span>
              </button>
              
              <button
                on:click={() => cambiarEstado(pedido.id, 'completado')}
                disabled={pedido.estado === 'completado'}
                class="btn justify-start {pedido.estado === 'completado' ? 'bg-gray-200 cursor-not-allowed' : 'btn-success'}"
              >
                <CheckCircle2 class="w-4 h-4" />
                <span>Completado</span>
              </button>
              
              <button
                on:click={() => cambiarEstado(pedido.id, 'cancelado')}
                disabled={pedido.estado === 'cancelado'}
                class="btn justify-start {pedido.estado === 'cancelado' ? 'bg-gray-200 cursor-not-allowed' : 'btn-danger'}"
              >
                <XCircle class="w-4 h-4" />
                <span>Cancelado</span>
              </button>
              
              <hr class="my-2 border-gray-300" />
              
              <button
                on:click={() => eliminarPedido(pedido.id)}
                class="btn bg-red-600 text-white hover:bg-red-700 justify-start"
              >
                <Trash2 class="w-4 h-4" />
                <span>Eliminar Pedido</span>
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

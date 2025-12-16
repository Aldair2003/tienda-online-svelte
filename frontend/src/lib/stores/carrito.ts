import { writable, derived } from 'svelte/store';
import type { CarritoItem, Articulo } from '$lib/types';

// Función para cargar carrito desde localStorage
function cargarCarritoDesdeStorage(): CarritoItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      return JSON.parse(carritoGuardado);
    }
  } catch (error) {
    console.error('Error al cargar carrito desde localStorage:', error);
  }
  return [];
}

// Función para guardar carrito en localStorage
function guardarCarritoEnStorage(items: CarritoItem[]) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('carrito', JSON.stringify(items));
    console.log('💾 Carrito guardado en localStorage:', items.length, 'items');
  } catch (error) {
    console.error('Error al guardar carrito en localStorage:', error);
  }
}

function crearCarrito() {
  // Cargar carrito inicial desde localStorage
  const { subscribe, set, update } = writable<CarritoItem[]>(cargarCarritoDesdeStorage());

  return {
    subscribe,
    agregar: (articulo: Articulo, cantidad: number = 1) => {
      update(items => {
        const existente = items.find(item => item.articulo.id === articulo.id);
        let nuevosItems: CarritoItem[];
        
        if (existente) {
          // Actualizar cantidad si ya existe
          nuevosItems = items.map(item =>
            item.articulo.id === articulo.id
              ? { ...item, cantidad: Math.min(item.cantidad + cantidad, articulo.stock) }
              : item
          );
        } else {
          // Agregar nuevo item
          nuevosItems = [...items, { articulo, cantidad: Math.min(cantidad, articulo.stock) }];
        }
        
        guardarCarritoEnStorage(nuevosItems);
        return nuevosItems;
      });
    },
    actualizar: (articuloId: string, cantidad: number) => {
      update(items => {
        const nuevosItems = items
          .map(item =>
            item.articulo.id === articuloId
              ? { ...item, cantidad: Math.min(cantidad, item.articulo.stock) }
              : item
          )
          .filter(item => item.cantidad > 0);
        
        guardarCarritoEnStorage(nuevosItems);
        return nuevosItems;
      });
    },
    eliminar: (articuloId: string) => {
      update(items => {
        const nuevosItems = items.filter(item => item.articulo.id !== articuloId);
        guardarCarritoEnStorage(nuevosItems);
        return nuevosItems;
      });
    },
    limpiar: () => {
      set([]);
      guardarCarritoEnStorage([]);
    },
  };
}

export const carrito = crearCarrito();

// Store derivado para calcular el total
export const totalCarrito = derived(carrito, $carrito =>
  $carrito.reduce((total, item) => total + item.articulo.precio * item.cantidad, 0)
);

// Store derivado para contar items
export const cantidadItems = derived(carrito, $carrito =>
  $carrito.reduce((total, item) => total + item.cantidad, 0)
);


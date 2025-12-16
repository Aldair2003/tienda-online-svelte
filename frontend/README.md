# Frontend - Tienda Online

Frontend desarrollado con **SvelteKit** y **Tailwind CSS v4** para una tienda online con gestión de artículos y pedidos.

## 🚀 Tecnologías

- **SvelteKit** - Framework de Svelte para aplicaciones web
- **Tailwind CSS v3** - Framework de estilos utility-first
- **Lucide Icons** - Biblioteca de iconos SVG modernos
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── services/      # Servicios de API
│   │   ├── stores/        # Stores de Svelte (estado global)
│   │   └── types/         # Tipos TypeScript
│   ├── routes/
│   │   ├── admin/         # Panel de administración
│   │   ├── carrito/       # Carrito de compras
│   │   └── +page.svelte   # Página principal (catálogo)
│   ├── app.css            # Estilos globales con Tailwind
│   └── app.html           # HTML base
├── static/                # Archivos estáticos
└── package.json
```

## 📋 Requisitos Previos

- Node.js v18 o superior
- npm o yarn
- Backend corriendo en `http://localhost:3000`

## 🛠️ Instalación

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias (ya instaladas)
npm install
```

## 💻 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### Modo Preview (Producción local)

```bash
npm run build
npm run preview
```

## 🌐 Rutas de la Aplicación

### Cliente
- `/` - Catálogo de productos
- `/carrito` - Carrito de compras y checkout

### Administrador
- `/admin` - Gestión de artículos (CRUD)
- `/admin/pedidos` - Gestión de pedidos

## 🎨 Características

### Para Clientes
- ✅ Catálogo de productos con búsqueda
- ✅ Carrito de compras interactivo
- ✅ Validación de stock en tiempo real
- ✅ Formulario de pedido con validaciones
- ✅ Notificaciones visuales
- ✅ Diseño responsive

### Para Administradores
- ✅ CRUD completo de artículos
- ✅ Gestión de stock
- ✅ Visualización de pedidos
- ✅ Cambio de estado de pedidos
- ✅ Estadísticas de ventas
- ✅ Dashboard intuitivo

## 🔧 Configuración

### API Backend

La URL del backend se configura en `src/lib/services/api.ts`:

```typescript
const API_URL = 'http://localhost:3000/api';
```

Para cambiarla (por ejemplo, al desplegar):

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

Y crear un archivo `.env`:

```
VITE_API_URL=https://tu-backend.railway.app/api
```

## 📦 Build para Producción

```bash
npm run build
```

Los archivos de producción estarán en la carpeta `build/`.

## 🚀 Despliegue en Vercel

### Opción 1: Desde la CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
cd frontend
vercel
```

### Opción 2: Desde GitHub

1. Push tu código a GitHub
2. Ir a [vercel.com](https://vercel.com)
3. Importar el repositorio
4. Configurar:
   - **Framework Preset**: SvelteKit
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Agregar variable de entorno (opcional):
   - `VITE_API_URL`: URL de tu backend

### Configuración para Vercel

El proyecto ya incluye `@sveltejs/adapter-auto` que detecta automáticamente Vercel.

Si necesitas configuración específica, actualiza `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter()
  }
};
```

## 🎨 Personalización de Estilos

Los estilos están en `src/app.css` usando Tailwind v4:

```css
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  /* ... más colores */
}
```

## 📱 Responsive Design

La aplicación es completamente responsive:
- Mobile: 1 columna
- Tablet (md): 2 columnas
- Desktop (lg): 3-4 columnas

## 🐛 Troubleshooting

### Error de conexión con el backend

Asegúrate de que:
1. El backend esté corriendo en `http://localhost:3000`
2. El CORS esté configurado correctamente en el backend
3. No hay firewall bloqueando la conexión

### Estilos de Tailwind no aparecen

```bash
# Limpiar cache y reinstalar
rm -rf node_modules .svelte-kit
npm install
npm run dev
```

### Error con Tailwind v4

Si hay problemas de compatibilidad:
```bash
npm install -D tailwindcss@next @tailwindcss/vite@next --legacy-peer-deps
```

## 📝 Notas

- El carrito se almacena en memoria (se pierde al recargar)
- Las imágenes se cargan desde URLs externas
- No hay autenticación real (solo rutas separadas)
- Los datos se persisten en el backend (JSON files)

## 🔗 Enlaces Útiles

- [Documentación de SvelteKit](https://kit.svelte.dev/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Guía de despliegue en Vercel](https://vercel.com/docs)

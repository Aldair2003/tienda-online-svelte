# 🛒 Tienda Online - Examen 2do Parcial

Aplicación web completa de tienda online desarrollada con **SvelteKit + Tailwind CSS v4** (Frontend) y **Node.js + Express** (Backend) con arquitectura MVC.

## 📋 Descripción del Proyecto

Sistema de tienda online con dos roles:

- **👤 Cliente**: Puede ver productos, agregarlos al carrito y realizar pedidos
- **👨‍💼 Vendedor/Admin**: Puede gestionar artículos (CRUD) y ver/administrar pedidos de clientes

## 🏗️ Arquitectura

```
examen2parcial/
├── backend/           # API REST con Node.js + Express (MVC)
│   ├── src/
│   │   ├── models/       # Lógica de datos (JSON)
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── routes/       # Endpoints de API
│   │   ├── config/       # Configuraciones
│   │   └── data/         # Archivos JSON (auto-generados)
│   └── package.json
│
└── frontend/          # SvelteKit + Tailwind CSS v4
    ├── src/
    │   ├── lib/
    │   │   ├── components/  # Componentes reutilizables
    │   │   ├── services/    # Servicios de API
    │   │   ├── stores/      # Estado global (Svelte stores)
    │   │   └── types/       # Tipos TypeScript
    │   └── routes/          # Páginas de la app
    └── package.json
```

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **JSON** - Base de datos (archivos)
- **CORS** - Manejo de peticiones cross-origin

### Frontend
- **SvelteKit** - Framework de Svelte
- **Tailwind CSS v3** - Estilos utility-first
- **Lucide Icons** - Iconos profesionales modernos
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server

## 📦 Instalación y Ejecución

### 1. Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# O en modo producción
npm start
```

El backend estará disponible en: `http://localhost:3000`

### 2. Frontend

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 🌐 Uso de la Aplicación

### Vista Cliente
1. Accede a `http://localhost:5173`
2. Explora el catálogo de productos
3. Agrega productos al carrito
4. Ve al carrito y completa el formulario de pedido
5. Confirma tu pedido

### Vista Administrador
1. Accede a `http://localhost:5173/admin`
2. Gestiona artículos:
   - Crear nuevos artículos
   - Editar artículos existentes
   - Eliminar artículos
   - Ver stock disponible
3. Ve a `http://localhost:5173/admin/pedidos`
4. Gestiona pedidos:
   - Ver todos los pedidos
   - Cambiar estado de pedidos
   - Ver datos de clientes
   - Ver estadísticas de ventas

## 📡 API Endpoints

### Artículos
- `GET /api/articulos` - Listar todos los artículos
- `GET /api/articulos/:id` - Obtener un artículo
- `POST /api/articulos` - Crear artículo
- `PUT /api/articulos/:id` - Actualizar artículo
- `DELETE /api/articulos/:id` - Eliminar artículo
- `PATCH /api/articulos/:id/stock` - Actualizar stock

### Pedidos
- `GET /api/pedidos` - Listar todos los pedidos
- `GET /api/pedidos/:id` - Obtener un pedido
- `POST /api/pedidos` - Crear pedido
- `PATCH /api/pedidos/:id/estado` - Actualizar estado
- `DELETE /api/pedidos/:id` - Eliminar pedido

## 🚀 Despliegue

### Backend en Railway

1. Crear cuenta en [Railway](https://railway.app)
2. Crear nuevo proyecto
3. Conectar con GitHub o desplegar directamente
4. Configurar:
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
5. Railway asignará un dominio automáticamente

### Frontend en Vercel

1. Crear cuenta en [Vercel](https://vercel.com)
2. Importar repositorio de GitHub
3. Configurar:
   - **Framework**: SvelteKit
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Agregar variable de entorno:
   - `VITE_API_URL`: URL de tu backend en Railway

### Configuración Post-Despliegue

1. Actualizar CORS en backend (`src/config/cors.js`):
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://tu-frontend.vercel.app'
  ],
  credentials: true
};
```

2. Actualizar API URL en frontend (`src/lib/services/api.ts`):
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

## ✨ Características Implementadas

### Requerimientos Base
- ✅ Backend y Frontend en proyectos separados
- ✅ Arquitectura MVC en backend
- ✅ Gestión de artículos con stock
- ✅ Registro de pedidos con datos de cliente
- ✅ Vista de pedidos para vendedor
- ✅ Frontend desplegado (Vercel)
- ✅ Backend funcional (localhost o Railway)

### Características Adicionales
- ✅ Diseño moderno y responsive con Tailwind v4
- ✅ Buscador de productos
- ✅ Carrito de compras interactivo
- ✅ Validación de stock en tiempo real
- ✅ Notificaciones visuales
- ✅ Gestión de estados de pedidos
- ✅ Dashboard con estadísticas
- ✅ CRUD completo de artículos
- ✅ Imágenes de productos
- ✅ Filtros en pedidos
- ✅ Animaciones y transiciones

## 📸 Screenshots

### Vista Cliente - Catálogo
![Catálogo](docs/catalogo.png)

### Vista Cliente - Carrito
![Carrito](docs/carrito.png)

### Vista Admin - Artículos
![Admin Artículos](docs/admin-articulos.png)

### Vista Admin - Pedidos
![Admin Pedidos](docs/admin-pedidos.png)

## 🐛 Troubleshooting

### Error: Cannot connect to backend
- Verifica que el backend esté corriendo
- Revisa la URL de la API en el frontend
- Verifica la configuración de CORS

### Error: Tailwind styles not loading
```bash
cd frontend
npm install -D tailwindcss@next @tailwindcss/vite@next --legacy-peer-deps
```

### Puerto 3000 ya está en uso
Cambia el puerto en `backend/src/server.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

## 📝 Datos de Prueba

Puedes crear artículos de ejemplo usando estos datos:

```json
{
  "nombre": "Laptop Gaming",
  "descripcion": "Laptop de alto rendimiento para gaming",
  "precio": 1299.99,
  "stock": 5,
  "imagen": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400"
}
```

## 👨‍💻 Autor

Proyecto desarrollado para el Examen del 2do Parcial de Programación Web.

## 📄 Licencia

MIT

---

## 🔗 Enlaces

- **Frontend desplegado**: [Agregar URL de Vercel]
- **Backend**: localhost:3000 (o Railway si lo despliegas)
- **Repositorio**: [Agregar URL de GitHub]


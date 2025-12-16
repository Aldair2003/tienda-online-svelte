# Backend - API Tienda

Backend desarrollado con Node.js + Express siguiendo arquitectura MVC para gestionar artículos y pedidos de una tienda.

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── config/         # Configuraciones (CORS, etc.)
│   ├── controllers/    # Lógica de negocio
│   ├── models/         # Modelos de datos
│   ├── routes/         # Rutas de API
│   └── data/           # Archivos JSON (generados automáticamente)
├── package.json
└── README.md
```

## 📋 Requisitos

- Node.js v14 o superior
- npm o yarn

## 🚀 Instalación

```bash
# Instalar dependencias
npm install
```

## 💻 Ejecución

### Modo desarrollo (con nodemon)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📡 Endpoints de la API

### Artículos

- `GET /api/articulos` - Obtener todos los artículos
- `GET /api/articulos/:id` - Obtener artículo por ID
- `POST /api/articulos` - Crear nuevo artículo
  ```json
  {
    "nombre": "Producto ejemplo",
    "descripcion": "Descripción del producto",
    "precio": 99.99,
    "stock": 10,
    "imagen": "url_imagen"
  }
  ```
- `PUT /api/articulos/:id` - Actualizar artículo
- `DELETE /api/articulos/:id` - Eliminar artículo
- `PATCH /api/articulos/:id/stock` - Actualizar stock
  ```json
  {
    "cantidad": 5
  }
  ```

### Pedidos

- `GET /api/pedidos` - Obtener todos los pedidos
- `GET /api/pedidos/:id` - Obtener pedido por ID
- `POST /api/pedidos` - Crear nuevo pedido
  ```json
  {
    "cliente": {
      "nombre": "Juan Pérez",
      "direccion": "Calle Principal 123",
      "telefono": "555-1234"
    },
    "articulos": [
      {
        "articuloId": "1234567890",
        "cantidad": 2
      }
    ]
  }
  ```
- `PATCH /api/pedidos/:id/estado` - Actualizar estado del pedido
  ```json
  {
    "estado": "completado"
  }
  ```
  Estados válidos: `pendiente`, `en_proceso`, `completado`, `cancelado`
- `DELETE /api/pedidos/:id` - Eliminar pedido

## 🗄️ Base de Datos

Los datos se almacenan en archivos JSON en la carpeta `src/data/`:
- `articulos.json` - Artículos de la tienda
- `pedidos.json` - Pedidos realizados

Estos archivos se crean automáticamente al iniciar la aplicación.

## 🔧 Tecnologías Utilizadas

- **Express** - Framework web
- **CORS** - Manejo de peticiones cross-origin
- **Body-parser** - Parseo de JSON
- **Nodemon** - Reinicio automático en desarrollo

## 📝 Notas

- El backend acepta peticiones desde `localhost:5173`, `localhost:3000` y `localhost:4173`
- Al crear un pedido, se valida el stock disponible y se actualiza automáticamente
- Los IDs se generan usando timestamps para simplicidad

